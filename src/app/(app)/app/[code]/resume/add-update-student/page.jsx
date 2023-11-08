import { getCatalogStudent } from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";

const Page = async ({ params }) => {
  const { getToken } = auth();

  const apiCatalogStudent = await getCatalogStudent(
    await getToken({ template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT }),
    params.code
  );

  if (apiCatalogStudent.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return <Content catalogStudent={apiCatalogStudent.data} code={params.code} />;
};

export default Page;
