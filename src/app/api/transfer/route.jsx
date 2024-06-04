import { NextResponse } from "next/server";
// import axios from "axios";
import { Client } from "pg";
const _ = require("lodash");
import { auth } from "@clerk/nextjs";
import { Transfer } from "@/utils/funtionApi";

//Lập dự kiến thu
export async function POST(req) {
  const { userId, getToken } = auth();
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  // console.log(userId);
  // console.log(
  //   await getToken({
  //     template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
  //   })
  // );
  try {
    const { id, previous_batch_id, time } = await req.json();
    await client.connect();
    const sql_debt = await client.query(`SELECT "id"
	,"revenue_code"
	,"student_code"
	,"batch_id"
	,"next_batch_money"
	,"revenue_group_id"
FROM "public"."expected_revenues" WHERE batch_id = ${previous_batch_id} AND next_batch_money < 0 AND revenue_group_id != 12;`);
    const updates = sql_debt.rows.map((item) => ({
      _set: {
        next_batch_money: 0,
        updated_at: time,
        updated_by: userId,
        note: "Kết chuyển công nợ",
      },
      where: {
        id: {
          _eq: item.id,
        },
      },
    }));

    const objects = sql_debt.rows.map((item) => ({
      revenue_code: item.revenue_code,
      batch_id: id,
      student_code: item.student_code,
      revenue_group_id: item.revenue_group_id,
      start_at: time,
      created_by: userId,
      previous_batch_money: item.next_batch_money,
    }));

    const update_columns = ["previous_batch_money"];

    await client.end();
    const res = await Transfer(
      await getToken({
        template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
      }),
      updates,
      objects,
      update_columns
    );

    console.log(res);
    if (res.status === 200)
      return NextResponse.json({ result: "Succes!" }, { status: 201 });
    else return NextResponse.json({ result: "Failed!" }, { status: 400 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}
