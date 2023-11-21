import { getListSchool } from "@/utils/funtionApi";
import LayoutClient from "./layoutClient";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

export default async function RootLayout({ children }) {
  // const { getToken } = auth();
  // const res = await getListSchool(
  //   await getToken({ template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT })
  // );

  // if (!res.data.result.some((item) => item.code == params.code))
  //   return notFound();

  return <LayoutClient>{children}</LayoutClient>;
}
