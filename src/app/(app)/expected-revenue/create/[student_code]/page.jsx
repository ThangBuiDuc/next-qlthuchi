import Content from "./content";
import { getSchoolYear, meilisearchStudentGet } from "@/utils/funtionApi";

const Page = async ({ params }) => {
  const present = await getSchoolYear({ is_active: { _eq: true } });

  const student = await meilisearchStudentGet(params.student_code);

  if (present.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return <Content present={present.data} student={student} />;
};

export default Page;
