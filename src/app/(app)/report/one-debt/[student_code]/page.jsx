import { meilisearchStudentGet, getSchoolYear } from "@/utils/funtionApi";
import Content from "./content";

const Page = async ({ params }) => {
  const student = await meilisearchStudentGet(params.student_code);

  const present = await getSchoolYear({ is_active: { _eq: true } });

  if (present.status !== 200 || !student) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return (
    <Content
      student_code={params.student_code}
      student={student}
      present={present.data}
    />
  );
};

export default Page;
