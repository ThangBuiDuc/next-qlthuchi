import { NextResponse } from "next/server";
import axios from "axios";
import { Client } from "pg";
const _ = require("lodash");
import { auth } from "@clerk/nextjs";
import { createExpectedRevenue } from "@/utils/funtionApi";

//Lập dự kiến thu
export async function PUT(req) {
  const { userId, getToken } = auth();
  const client = new Client({
    host: "27.72.249.149",
    port: 8501,
    database: "hns_qlthuchi",
    user: "admin",
    password: "Abc123654",
  });
  // console.log(userId);
  // console.log(
  //   await getToken({
  //     template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  //   })
  // );
  try {
    const { type, data, batch_id, time } = await req.json();
    await client.connect();
    if (type === "SCHOOL") {
      const sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE school_level_code IN (${data
          .map((item) => item)
          .join(",")})`
      );

      const sql_revenue_norm = await client.query(
        `SELECT * FROM revenue_norms WHERE batch_id = ${batch_id} AND end_at IS NULL`
      );

      const objects = sql_student.rows.map((item) => {
        let school = sql_revenue_norm.rows.filter(
          (el) => el.school_level_code === item.school_level_code
        );

        let class_level = sql_revenue_norm.rows.filter(
          (el) => el.class_level_code === item.class_level_code
        );

        let classes = sql_revenue_norm.rows.filter(
          (el) => el.class_code === item.class_code
        );

        let student = sql_revenue_norm.rows.filter(
          (el) => el.student_code === item.code
        );

        let revenueRaw = _.unionBy(
          student,
          _.unionBy(
            classes,
            _.unionBy(class_level, school, "revenue_code"),
            "revenue_code"
          ),
          "revenue_code"
        );

        return revenueRaw.map((el) => ({
          revenue_code: el.revenue_code,
          revenue_group_id: el.revenue_group_id,
          amount: el.amount,
          calculation_unit_id: el.calculation_unit_id,
          unit_price: el.unit_price,
          student_code: item.code,
          batch_id: batch_id,
          prescribed_money: el.unit_price * el.amount,
          created_by: userId,
          start_at: time,
          next_batch_money: el.unit_price * el.amount,
        }));
      });

      const res = await axios({
        url: process.env.NEXT_PUBLIC_HASURA_CREATE_EXPECTED_REVENUE,
        method: "PUT",
        data: {
          objects: objects.reduce((total, curr) => [...total, ...curr], []),
          update_columns: ["prescribed_money", "start_at"],
        },
        headers: {
          "content-type": "Application/json",
          authorization: `Bearer ${await getToken({
            template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
          })}`,
        },
      });

      if (res.status === 200) {
        return NextResponse.json({ result: "success" }, { status: 200 });
      } else
        return NextResponse.json(
          { result: "Failed!", error: err.toString() },
          { status: 400 }
        );
    }

    if (type === "CLASS_LEVEL") {
      const sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE class_level_code IN (${data
          .map((item) => item)
          .join(",")})`
      );

      const sql_revenue_norm = await client.query(
        `SELECT * FROM revenue_norms WHERE batch_id = ${batch_id} AND end_at IS NULL`
      );

      const objects = sql_student.rows.map((item) => {
        let school = sql_revenue_norm.rows.filter(
          (el) => el.school_level_code === item.school_level_code
        );

        let class_level = sql_revenue_norm.rows.filter(
          (el) => el.class_level_code === item.class_level_code
        );

        let classes = sql_revenue_norm.rows.filter(
          (el) => el.class_code === item.class_code
        );

        let student = sql_revenue_norm.rows.filter(
          (el) => el.student_code === item.code
        );

        let revenueRaw = _.unionBy(
          student,
          _.unionBy(
            classes,
            _.unionBy(class_level, school, "revenue_code"),
            "revenue_code"
          ),
          "revenue_code"
        );

        return revenueRaw.map((el) => ({
          revenue_code: el.revenue_code,
          revenue_group_id: el.revenue_group_id,
          amount: el.amount,
          calculation_unit_id: el.calculation_unit_id,
          unit_price: el.unit_price,
          student_code: item.code,
          batch_id: batch_id,
          prescribed_money: el.unit_price * el.amount,
          created_by: userId,
          start_at: time,
          next_batch_money: el.unit_price * el.amount,
        }));
      });

      const res = await axios({
        url: process.env.NEXT_PUBLIC_HASURA_CREATE_EXPECTED_REVENUE,
        method: "PUT",
        data: {
          objects: objects.reduce((total, curr) => [...total, ...curr], []),
          update_columns: ["prescribed_money", "start_at"],
        },
        headers: {
          "content-type": "Application/json",
          authorization: `Bearer ${await getToken({
            template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
          })}`,
        },
      });

      if (res.status === 200) {
        return NextResponse.json({ result: "success" }, { status: 200 });
      } else
        return NextResponse.json(
          { result: "Failed!", error: err.toString() },
          { status: 400 }
        );
    }

    if (type === "CLASS") {
      const sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE class_code IN (${data
          .map((item) => `'${item}'`)
          .join(",")})`
      );

      const sql_revenue_norm = await client.query(
        `SELECT * FROM revenue_norms WHERE batch_id = ${batch_id} AND end_at IS NULL`
      );

      const objects = sql_student.rows.map((item) => {
        let school = sql_revenue_norm.rows.filter(
          (el) => el.school_level_code === item.school_level_code
        );

        let class_level = sql_revenue_norm.rows.filter(
          (el) => el.class_level_code === item.class_level_code
        );

        let classes = sql_revenue_norm.rows.filter(
          (el) => el.class_code === item.class_code
        );

        let student = sql_revenue_norm.rows.filter(
          (el) => el.student_code === item.code
        );

        let revenueRaw = _.unionBy(
          student,
          _.unionBy(
            classes,
            _.unionBy(class_level, school, "revenue_code"),
            "revenue_code"
          ),
          "revenue_code"
        );

        return revenueRaw.map((el) => ({
          revenue_code: el.revenue_code,
          revenue_group_id: el.revenue_group_id,
          amount: el.amount,
          calculation_unit_id: el.calculation_unit_id,
          unit_price: el.unit_price,
          student_code: item.code,
          batch_id: batch_id,
          prescribed_money: el.unit_price * el.amount,
          created_by: userId,
          start_at: time,
          next_batch_money: el.unit_price * el.amount,
        }));
      });

      const res = await axios({
        url: process.env.NEXT_PUBLIC_HASURA_CREATE_EXPECTED_REVENUE,
        method: "PUT",
        data: {
          objects: objects.reduce((total, curr) => [...total, ...curr], []),
          update_columns: ["prescribed_money", "start_at"],
        },
        headers: {
          "content-type": "Application/json",
          authorization: `Bearer ${await getToken({
            template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
          })}`,
        },
      });

      if (res.status === 200) {
        return NextResponse.json({ result: "success" }, { status: 200 });
      } else
        return NextResponse.json(
          { result: "Failed!", error: err.toString() },
          { status: 400 }
        );
    }

    if (type === "STUDENT") {
      const sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE code = '${data}'`
      );

      const sql_revenue_norm = await client.query(
        `SELECT * FROM revenue_norms WHERE batch_id = ${batch_id} AND end_at IS NULL`
      );

      const objects = sql_student.rows.map((item) => {
        let school = sql_revenue_norm.rows.filter(
          (el) => el.school_level_code === item.school_level_code
        );

        let class_level = sql_revenue_norm.rows.filter(
          (el) => el.class_level_code === item.class_level_code
        );

        let classes = sql_revenue_norm.rows.filter(
          (el) => el.class_code === item.class_code
        );

        let student = sql_revenue_norm.rows.filter(
          (el) => el.student_code === item.code
        );

        let revenueRaw = _.unionBy(
          student,
          _.unionBy(
            classes,
            _.unionBy(class_level, school, "revenue_code"),
            "revenue_code"
          ),
          "revenue_code"
        );

        return revenueRaw.map((el) => ({
          revenue_code: el.revenue_code,
          revenue_group_id: el.revenue_group_id,
          amount: el.amount,
          calculation_unit_id: el.calculation_unit_id,
          unit_price: el.unit_price,
          student_code: item.code,
          batch_id: batch_id,
          prescribed_money: el.unit_price * el.amount,
          created_by: userId,
          start_at: time,
          next_batch_money: el.unit_price * el.amount,
        }));
      });

      const res = await createExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        objects.reduce((total, curr) => [...total, ...curr], [])
      );

      if (res.status === 200) {
        return NextResponse.json({ result: "success" }, { status: 200 });
      } else
        return NextResponse.json(
          { result: "Failed!", error: err.toString() },
          { status: 400 }
        );
    }

    await client.end();
  } catch (err) {
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}
