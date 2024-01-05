import { NextResponse } from "next/server";
import axios from "axios";
import moment from "moment";

export async function GET() {
  try {
    const res = await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/keys`,
      headers: {
        authorization: `Bearer ${process.env.MEILISEARCH_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        description: "User Search and GET API KEY",
        actions: ["search", "documents.get"],
        indexes: [
          "hns_qlthuchi_v_student",
          "hns_qlthuchi_v_receipt",
          "hns_qlthuchi_v_bill_receipt",
        ],
        expiresAt: `${moment()
          .add({ seconds: 10 })
          .format("YYYY-MM-DDTHH:mm:ssZ")}`,
      },
    });

    // if (res.status !== 200) {
    //   throw new error("Connection timeout.");
    // }

    return NextResponse.json({ key: res.data.key }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { result: "Cannot create token", error: err.toString() },
      { status: 400 }
    );
  }
}
