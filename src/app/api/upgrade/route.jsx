import { NextResponse } from "next/server";
import axios from "axios";
import { Client } from "pg";
const _ = require("lodash");
import { auth } from "@clerk/nextjs";
import { createExpectedRevenue } from "@/utils/funtionApi";

function getSchoolLevelCode(class_level_code) {
  if (class_level_code <= 5) return 1;
  else return 2;
}

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
  // console.log(userId);
  // console.log(
  //   await getToken({
  //     template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  //   })
  // );
  try {
    const { type, old_school_year_id, school_year_id } = await req.json();
    await client.connect();
    if (type === "SCHOOL") {
      const sql_student = await client.query(
        `SELECT code,class_code,class_level_code FROM v_student WHERE school_year_id = ${old_school_year_id} AND class_level_code < 9`
      );
      // console.log(sql_student.rows);
      const objects = sql_student.rows.map((item) => ({
        class_level_code: item.class_level_code + 1,
        name: `${item.class_level_code + 1}${item.class_code.substring(1)}`,
        code: `${item.class_code.substring(1)}`,
        school_level_code: getSchoolLevelCode(item.class_level_code + 1),

        // schoolyear_students: {
        //   data: {
        //     student_code: item.code,
        //     school_year_id,
        //     created_by: userId,
        //     note: "UP",
        //   },
        // },
      }));
      // console.log(objects);

      const objects1 = sql_student.rows.map((item) => ({
        student_code: item.code,
        school_year_id,
        created_by: userId,
        note: "UP",
        class_code: `${item.class_level_code + 1}${item.class_code.substring(
          1
        )}`,
      }));

      const res = await axios({
        url: process.env.NEXT_PUBLIC_HASURA_UPGRADE,
        method: "PUT",
        data: {
          objects,
          objects1,
        },
        headers: {
          "content-type": "Application/json",
          authorization: `Bearer ${await getToken({
            template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
          })}`,
        },
      });

      // return NextResponse.json({ result: "success" }, { status: 200 });

      if (res.status === 200) {
        return NextResponse.json(
          { result: "success" },
          { status: 200, res: res.data }
        );
      } else
        return NextResponse.json(
          { result: "Failed!", error: err.toString() },
          { status: 400 }
        );
    }

    if (type === "CLASS_LEVEL") {
      if (res.status === 200) {
        return NextResponse.json({ result: "success" }, { status: 200 });
      } else
        return NextResponse.json(
          { result: "Failed!", error: err.toString() },
          { status: 400 }
        );
    }

    if (type === "CLASS") {
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
    console.log(err);
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}
