import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


import { createClerkUser } from "@/utils/clerk";


export async function POST(req) {
    const { userName, email, password } = await req.json();
    const user = await currentUser();
    if (user.id) {
      const res = await createClerkUser(userName, email, password);

      console.log(res);
  
      if (res.status !== 200)
        return NextResponse.json({ result: "Failed!" }, { status: 400 });
      return NextResponse.json({...res.data }, { status: 200 });
    } else
      return NextResponse.json({ result: "NOT Authorization!" }, { status: 401 });
  }

