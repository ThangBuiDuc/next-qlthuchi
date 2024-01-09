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
FROM "public"."expected_revenues" WHERE batch_id = ${previous_batch_id}`);
    await client.end();
  } catch (err) {
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}
