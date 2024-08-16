import { NextResponse } from "next/server";
import axios from "axios";
import { Client } from "pg";
const _ = require("lodash");
import { auth } from "@clerk/nextjs";
import { createExpectedRevenue } from "@/utils/funtionApi";

const isDateInRange = (date, startMonth, startDay, endMonth, endDay) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Check if the date is within the specified range
  return (
    (month > startMonth || (month === startMonth && day >= startDay)) &&
    (month < endMonth || (month === endMonth && day <= endDay))
  );
};

const calculatorPrescribedMoney = (el, student, batch, end_date) => {
  let prescribed_money = el.unit_price * el.amount;

  if ((el.revenue_code === "HP" || el.revenue_code === "BT" ) && student.status_id == 8) {
    if (batch == 1 && isDateInRange(student.join_date, 10, 15, 12, 31)) {
      return 0.7 * prescribed_money;
    }
    if (batch == 2 && isDateInRange(student.join_date, 3, 15, end_date.getMonth() + 1, end_date.getDate())) {
      return 0.7 * prescribed_money;
    }
  }

  return prescribed_money;
};


const mapRevenueObjects = (students, revenueNorms, batch_id, userId, time,batch,end_date) => {
  return students.map((student) => {
    let school = revenueNorms.filter(
      (el) => el.school_level_code === student.school_level_code
    );

    let class_level = revenueNorms.filter(
      (el) => el.class_level_code === student.class_level_code
    );

    let classes = revenueNorms.filter(
      (el) => el.class_code === student.class_code
    );

    let studentSpecific = revenueNorms.filter(
      (el) => el.student_code === student.code
    );

    let revenueRaw = _.unionBy(
      studentSpecific,
      _.unionBy(
        classes,
        _.unionBy(class_level, school, "revenue_code"),
        "revenue_code"
      ),
      "revenue_code"
    );

    // console.log(revenueRaw,student,batch,end_date)

    return revenueRaw.map((el) => ({
      revenue_code: el.revenue_code,
      revenue_group_id: el.revenue_group_id,
      amount: el.amount,
      calculation_unit_id: el.calculation_unit_id,
      unit_price: el.unit_price,
      student_code: student.code,
      batch_id: batch_id,
      // prescribed_money: el.unit_price * el.amount,
      prescribed_money: calculatorPrescribedMoney(el,student,batch,end_date),
      created_by: userId,
      start_at: time,
      next_batch_money: el.unit_price * el.amount,
    }));
  }).reduce((total, curr) => [...total, ...curr], []);  // Flatten the array of arrays
};


//Lập dự kiến thu
export async function PUT(req) {
  const { userId, getToken } = auth();
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  try {
    const { type, data, batch_id, time } = await req.json();
    await client.connect();
    const sql_batch = await client.query(`SELECT * FROM batchs WHERE id = ${batch_id}`);
    const batch = sql_batch.rows[0].batch;
    const sql_school_year = await client.query(`SELECT * FROM school_years WHERE is_active = true`);
    // console.log(sql_school_year)
    const end_date = sql_school_year.rows[0].end_day;
    // console.log("enddate",end_date)

    // Common query for revenue norms
    const sql_revenue_norm = await client.query(
      `SELECT * FROM revenue_norms WHERE batch_id = ${batch_id} AND end_at IS NULL`
    );
    const revenueNorms = sql_revenue_norm.rows;

    let sql_student;
    if (type === "SCHOOL") {
      sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE school_level_code IN (${data.map((item) => item).join(",")})`
      );
    } else if (type === "CLASS_LEVEL") {
      sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE class_level_code IN (${data.map((item) => item).join(",")})`
      );
    } else if (type === "CLASS") {
      sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE class_code IN (${data.map((item) => `'${item}'`).join(",")})`
      );
    } else if (type === "STUDENT") {
      sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE code = '${data}'`
      );
    }

    const students = sql_student.rows;

    // Map revenue objects
    const objects = mapRevenueObjects(students, revenueNorms, batch_id, userId, time,batch,end_date);

    const res = await axios({
      url: process.env.NEXT_PUBLIC_HASURA_CREATE_EXPECTED_REVENUE,
      method: "PUT",
      data: {
        objects: objects,
        update_columns: ["prescribed_money", "start_at"],
      },
      headers: {
        "content-type": "Application/json",
        authorization: `Bearer ${await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        })}`,
      },
    });

    await client.end();

    if (res.status === 200) {
      return NextResponse.json({ result: "success" }, { status: 200 });
    } else {
      return NextResponse.json(
        { result: "Failed!", error: res.data },
        { status: 400 }
      );
    }
  } catch (err) {
    await client.end();
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}

