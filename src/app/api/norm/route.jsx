import { NextResponse } from "next/server";
import { Client } from "pg";
const _ = require("lodash");
import { auth } from "@clerk/nextjs";
import { createRevenueNorm } from "@/utils/funtionApi";

const UNIT_PRICE = 56700;
const CALCULATION_UNIT_ID = 3;

// Lập định mức thu BHYT
export async function PUT(req) {
  const { userId, getToken } = auth();
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  const isDateInRange = (date, startMonth, startDay, endMonth, endDay) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // Check if the date is within the specified range
    return (
      (month > startMonth || (month === startMonth && day >= startDay)) &&
      (month < endMonth || (month === endMonth && day <= endDay))
    );
  };

  try {
    const { batch_id, time, class_level } = await req.json();

    await client.connect();

    const sql_bhyt = await client.query(
      `SELECT code, revenue_group_id FROM revenue WHERE code = 'BHYT';`
    );

    const insuranceRules = await client.query(
      `SELECT * FROM insurance_rules WHERE is_actived = true;`
    );

    // Tạo định mức thu cho tất cả các khối
    let allObjects = [];

    for (const level of class_level) {
      const sql_student = await client.query(
        `SELECT code, date_of_birth::date as dob FROM v_student WHERE status_id = 1 AND class_level_code = $1;`,
        [level]
      );

      for (const student of sql_student.rows) {
        const rule = insuranceRules.rows.find(
          (r) =>
            r.class_level === level &&
            isDateInRange(
              student.dob,
              r.start_month,
              r.start_day,
              r.end_month,
              r.end_day
            )
        );
        if (rule) {
          allObjects.push({
            revenue_code: sql_bhyt.rows[0].code,
            revenue_group_id: sql_bhyt.rows[0].revenue_group_id,
            batch_id: batch_id,
            calculation_unit_id: CALCULATION_UNIT_ID,
            // class_level_code: level,
            student_code: student.code,
            amount: rule.months,
            unit_price: UNIT_PRICE,
            created_by: userId,
            start_at: time,
          });
        }
      }
    }

    const allLogs = allObjects.map((item) => ({
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
      allObjects,
      allLogs
    );

    if (res.status === 200) {
      return NextResponse.json({ result: "Success!" }, { status: 201 });
    } else {
      return NextResponse.json({ result: "Failed!" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}
