import { NextResponse } from "next/server";
import axios from "axios";
import { Client } from "pg";
const _ = require("lodash");
import { auth } from "@clerk/nextjs";
import { createExpectedRevenue } from "@/utils/funtionApi";

//Lập dự kiến thu vé ăn
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
    const { type, data, norm, batch_id, time, revenue } = await req.json();
    await client.connect();

    if (type === "CLASS") {
      const sql_student = await client.query(
        `SELECT * FROM v_expected_revenue_student WHERE class_code IN (${data
          .map((item) => `'${item}'`)
          .join(",")})`
      );

      //       const previous_batch = await client.query(`SELECT "id"
      // 	,"batch"
      // 	,"school_year"
      // 	,"is_active"
      // 	,"previous_batch_id"
      // 	,"previous_batch"
      // 	,"previous_school_year"
      // FROM "public"."v_transfer" WHERE is_active IS TRUE;`);

      const ticket_status =
        await client.query(`SELECT A.id,A.student_code,A.unit_price
       	,A.amount
       	,SUM(B.ticket_count) as ticket_count
       FROM expected_revenues A
       JOIN ticket B ON A.id = B.expected_revenue_id
       WHERE A.ticket_refund IS FALSE
       AND A.ticket_transfer IS FALSE
       AND A.student_code IN (${sql_student.rows
         .map((item) => `'${item.code}'`)
         .join(",")})
       GROUP BY A.id,A.student_code,A.unit_price,A.amount
      	`);

      const objects = sql_student.rows.map((item) => {
        const ticket = ticket_status.rows.find(
          (el) => item.code === el.student_code && el.amount > el.ticket_count
        );

        if (ticket) {
          const money =
            ticket.unit_price === norm.price
              ? (norm.quantity - (ticket.amount - ticket.ticket_count)) *
                norm.price
              : norm.quantity * norm.price -
                (ticket.amount - ticket.ticket_count) * ticket.unit_price;
          return {
            revenue_code: norm.revenue.code,
            revenue_group_id: norm.group.value,
            amount: norm.quantity - (ticket.amount - ticket.ticket_count),
            ticket_remain: norm.quantity,
            calculation_unit_id: norm.calculation_unit.value,
            unit_price: norm.price,
            student_code: item.code,
            batch_id: batch_id,
            prescribed_money: money,
            created_by: userId,
            start_at: time,
            next_batch_money: money,
            tickets: {
              data: revenue.map((el) => ({
                batch_id,
                created_by: userId,
                student_code: item.code,
                revenue_code: el.code,
              })),
            },
            ticket_note: {
              old_id: ticket.id,
              old_unit_price: ticket.unit_price,
              remain_ticket: ticket.amount - ticket.ticket_count,
              new_unit_price: norm.price,
              collected_more:
                (norm.price - ticket.unit_price) *
                (ticket.amount - ticket.ticket_count),
            },
          };
        }
        // } else {
        //   return {
        //     revenue_code: norm.revenue.code,
        //     revenue_group_id: norm.group.value,
        //     amount: norm.quantity,
        //     calculation_unit_id: norm.calculation_unit.value,
        //     unit_price: norm.price,
        //     student_code: item.code,
        //     batch_id: batch_id,
        //     prescribed_money: norm.quantity * norm.price,
        //     created_by: userId,
        //     start_at: time,
        //     next_batch_money: norm.quantity * norm.price,
        //   };
        // }

        return {
          revenue_code: norm.revenue.code,
          revenue_group_id: norm.group.value,
          amount: norm.quantity,
          ticket_remain: norm.quantity,
          calculation_unit_id: norm.calculation_unit.value,
          unit_price: norm.price,
          student_code: item.code,
          batch_id: batch_id,
          prescribed_money: norm.quantity * norm.price,
          created_by: userId,
          start_at: time,
          next_batch_money: norm.quantity * norm.price,
          tickets: {
            data: revenue.map((el) => ({
              batch_id,
              created_by: userId,
              student_code: item.code,
              revenue_code: el.code,
            })),
          },
        };
      });

      const res = await axios({
        url: process.env.NEXT_PUBLIC_HASURA_CREATE_TICKET_EXPECTED_REVENUE,
        method: "PUT",
        data: {
          objects: objects,
          updates: ticket_status.rows
            .filter((item) => item.amount > item.ticket_count)
            .map((item) => ({
              _set: {
                ticket_transfer: true,
                updated_by: userId,
                updated_at: time,
              },
              where: {
                id: { _eq: item.id },
              },
            })),
        },
        headers: {
          "content-type": "Application/json",
          authorization: `Bearer ${await getToken({
            template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
          })}`,
        },
      }).catch((err) => console.log(err));

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
        `SELECT * FROM v_expected_revenue_student WHERE code IN (${data
          .map((item) => `'${item}'`)
          .join(",")})`
      );

      const ticket_status =
        await client.query(`SELECT A.id,A.student_code,A.unit_price
       	,A.amount
       	,SUM(B.ticket_count) as ticket_count
       FROM expected_revenues A
       JOIN ticket B ON A.id = B.expected_revenue_id
       WHERE A.ticket_refund IS FALSE
       AND A.ticket_transfer IS FALSE
       AND A.student_code IN (${sql_student.rows
         .map((item) => `'${item.code}'`)
         .join(",")})
       GROUP BY A.id,A.student_code,A.unit_price,A.amount
      	`);

      const objects = sql_student.rows.map((item) => {
        const ticket = ticket_status.rows.find(
          (el) => item.code === el.student_code && el.amount > el.ticket_count
        );

        if (ticket) {
          const money =
            ticket.unit_price === norm.price
              ? (norm.quantity - (ticket.amount - ticket.ticket_count)) *
                norm.price
              : norm.quantity * norm.price -
                (ticket.amount - ticket.ticket_count) * ticket.unit_price;
          return {
            revenue_code: norm.revenue.code,
            revenue_group_id: norm.group.value,
            amount: norm.quantity - (ticket.amount - ticket.ticket_count),
            ticket_remain: norm.quantity,
            calculation_unit_id: norm.calculation_unit.value,
            unit_price: norm.price,
            student_code: item.code,
            batch_id: batch_id,
            prescribed_money: money,
            created_by: userId,
            start_at: time,
            next_batch_money: money,
            tickets: {
              data: revenue.map((el) => ({
                batch_id,
                created_by: userId,
                student_code: item.code,
                revenue_code: el.code,
              })),
            },
            ticket_note: {
              old_id: ticket.id,
              old_unit_price: ticket.unit_price,
              remain_ticket: ticket.amount - ticket.ticket_count,
              new_unit_price: norm.price,
              collected_more:
                (norm.price - ticket.unit_price) *
                (ticket.amount - ticket.ticket_count),
            },
          };
        }

        return {
          revenue_code: norm.revenue.code,
          revenue_group_id: norm.group.value,
          amount: norm.quantity,
          ticket_remain: norm.quantity,
          calculation_unit_id: norm.calculation_unit.value,
          unit_price: norm.price,
          student_code: item.code,
          batch_id: batch_id,
          prescribed_money: norm.quantity * norm.price,
          created_by: userId,
          start_at: time,
          next_batch_money: norm.quantity * norm.price,
          tickets: {
            data: revenue.map((el) => ({
              batch_id,
              created_by: userId,
              student_code: item.code,
              revenue_code: el.code,
            })),
          },
        };
      });

      const res = await axios({
        url: process.env.NEXT_PUBLIC_HASURA_CREATE_TICKET_EXPECTED_REVENUE,
        method: "PUT",
        data: {
          objects: objects,
          updates: ticket_status.rows
            .filter((item) => item.amount > item.ticket_count)
            .map((item) => ({
              _set: {
                ticket_transfer: true,
                updated_by: userId,
                updated_at: time,
              },
              where: {
                id: { _eq: item.id },
              },
            })),
        },
        headers: {
          "content-type": "Application/json",
          authorization: `Bearer ${await getToken({
            template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
          })}`,
        },
      }).catch((err) => console.log(err));

      if (res.status === 200) {
        return NextResponse.json({ result: "success" }, { status: 200 });
      } else
        return NextResponse.json(
          { result: "Failed!", error: err.toString() },
          { status: 400 }
        );
      // if (res.status === 200) {
      //   return NextResponse.json({ result: "success" }, { status: 200 });
      // } else
      //   return NextResponse.json(
      //     { result: "Failed!", error: err.toString() },
      //     { status: 400 }
      //   );
    }

    // return NextResponse.json({ result: "success" }, { status: 200 });

    await client.end();
  } catch (err) {
    return NextResponse.json(
      { result: "Failed!", error: err.toString() },
      { status: 400 }
    );
  }
}
