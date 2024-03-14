import { NextResponse } from "next/server";
import { Client } from "pg";
const _ = require("lodash");
import { auth } from "@clerk/nextjs";
import { createRevenueNorm } from "@/utils/funtionApi";

const UNIT_PRICE = 56700;
const CALCULATION_UNIT_ID = 3;

//Lập định mức thu BHYT
export async function PUT(req) {
  const { userId, getToken } = auth();
  const client = new Client({
    host: "27.72.249.149",
    port: 8501,
    database: "hns_qlthuchi",
    user: "admin",
    password: "Abc123654",
  });

  const isDateInRange = (date, startMonth, startDay, endMonth, endDay) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // Check if the date is within the specified range
    if (
      (month > startMonth || (month === startMonth && day >= startDay)) &&
      (month < endMonth || (month === endMonth && day <= endDay))
    ) {
      return true;
    } else {
      return false;
    }
  };

  try {
    const { batch_id, time, class_level } = await req.json();

    await client.connect();

    const sql_bhyt = await client.query(
      `SELECT code,revenue_group_id FROM revenue WHERE code = 'BHYT';`
    );
    //Tạo định mức thu cho khối 2 đến khối 9
    const exceptOneObjects = class_level
      .filter((item) => item !== 1)
      .map((item) => ({
        revenue_code: sql_bhyt.rows[0].code,
        revenue_group_id: sql_bhyt.rows[0].revenue_group_id,
        batch_id: batch_id,
        calculation_unit_id: CALCULATION_UNIT_ID,
        class_level_code: item,
        amount: 12,
        unit_price: UNIT_PRICE,
        created_by: userId,
        start_at: time,
      }));

    const exceptOneLog = exceptOneObjects.map((item) => ({
      clerk_user_id: userId,
      type: "create",
      table: "revenue_norms",
      data: item,
    }));

    //Tạo định mức thu cho khối 1
    const sql_student = await client.query(
      `SELECT code,date_of_birth::date as dob FROM v_student WHERE status_id = 1 AND class_level_code = 1;`
    );

    const oneObjects = sql_student.rows.map((item) => {
      if (isDateInRange(item.dob, 1, 1, 10, 1))
        return {
          revenue_code: sql_bhyt.rows[0].code,
          revenue_group_id: sql_bhyt.rows[0].revenue_group_id,
          batch_id: batch_id,
          calculation_unit_id: CALCULATION_UNIT_ID,
          student_code: item.code,
          amount: 15,
          unit_price: UNIT_PRICE,
          created_by: userId,
          start_at: time,
        };

      if (isDateInRange(item.dob, 10, 2, 11, 1))
        return {
          revenue_code: sql_bhyt.rows[0].code,
          revenue_group_id: sql_bhyt.rows[0].revenue_group_id,
          batch_id: batch_id,
          calculation_unit_id: CALCULATION_UNIT_ID,
          student_code: item.code,
          amount: 14,
          unit_price: UNIT_PRICE,
          created_by: userId,
          start_at: time,
        };

      if (isDateInRange(item.dob, 11, 2, 12, 1))
        return {
          revenue_code: sql_bhyt.rows[0].code,
          revenue_group_id: sql_bhyt.rows[0].revenue_group_id,
          batch_id: batch_id,
          calculation_unit_id: CALCULATION_UNIT_ID,
          student_code: item.code,
          amount: 13,
          unit_price: UNIT_PRICE,
          created_by: userId,
          start_at: time,
        };

      if (isDateInRange(item.dob, 12, 2, 12, 31))
        return {
          revenue_code: sql_bhyt.rows[0].code,
          revenue_group_id: sql_bhyt.rows[0].revenue_group_id,
          batch_id: batch_id,
          calculation_unit_id: CALCULATION_UNIT_ID,
          student_code: item.code,
          amount: 12,
          unit_price: UNIT_PRICE,
          created_by: userId,
          start_at: time,
        };
    });

    const oneLog = oneObjects.map((item) => ({
      clerk_user_id: userId,
      type: "create",
      table: "revenue_norms",
      data: item,
    }));

    await client.end();

    const res = await createRevenueNorm(
      await getToken({
        template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
      }),
      [...exceptOneObjects, ...oneObjects],
      [...exceptOneLog, ...oneLog]
    );
    if (res.status === 200)
      return NextResponse.json({ result: "Succes!" }, { status: 201 });
    else return NextResponse.json({ result: "Failed!" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}
