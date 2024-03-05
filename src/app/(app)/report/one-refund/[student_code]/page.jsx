import { getRevenueGroup, meilisearchStudentGet } from "@/utils/funtionApi";
import Content from "./content";

const Page = async ({ params }) => {
  const apiGetRevenueGroup = await getRevenueGroup();
  const student = await meilisearchStudentGet(params.student_code);

  if (apiGetRevenueGroup.status !== 200 || !student) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return (
    <Content
      revenueGroup={apiGetRevenueGroup.data.result}
      student_code={params.student_code}
      student={student}
    />
  );
};

export default Page;
