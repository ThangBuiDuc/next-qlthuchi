import { meilisearchStudentGet, getSchoolYear } from "@/utils/funtionApi";
import Content from "./content";

const Page = async ({ params }) => {
  const student = await meilisearchStudentGet(params.student_code);

  const apiGetSchoolYear = await getSchoolYear();

  if (apiGetSchoolYear.status !== 200 || !student) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return (
    <Content
      student_code={params.student_code}
      student={student}
      schoolYear={apiGetSchoolYear.data}
    />
  );
};

export default Page;
