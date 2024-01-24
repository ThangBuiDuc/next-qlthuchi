import {
  getCatalogStudent,
  getSchoolYear,
  getStudent,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";

const Page = async ({ params }) => {
  const { getToken } = auth();
  const token = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
  });

  const present = await getSchoolYear({ is_active: { _eq: true } });

  const apiCatalogStudentPromise = getCatalogStudent(token);

  const studentInforPromise = getStudent(token, {
    code: { _eq: params.student_code },
  });

  const [apiCatalogStudent, studentInfor] = await Promise.all([
    apiCatalogStudentPromise,
    studentInforPromise,
  ]);

  if (
    apiCatalogStudent.status !== 200 ||
    present.status !== 200 ||
    studentInfor.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  return (
    <Content
      student_code={params.student_code}
      initialStudent={studentInfor.data}
      present={present.data}
      catalogStudent={apiCatalogStudent.data}
    />
  );
};

export default Page;
