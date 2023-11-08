import { getListSchool } from "@/utils/funtionApi";
import LayoutClient from "./layoutClient";
import { notFound } from "next/navigation";

export default async function RootLayout({ children, params }) {
  const res = await getListSchool();

  if (!res.data.result.some((item) => item.code == params.code))
    return notFound();

  return <LayoutClient params={params}>{children}</LayoutClient>;
}
