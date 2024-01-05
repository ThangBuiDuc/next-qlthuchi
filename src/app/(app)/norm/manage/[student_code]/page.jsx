import {
  getCalculationUnit,
  getListRevenue,
  getSchoolYear,
  meilisearchStudentGet,
} from "@/utils/funtionApi";

import Content from "./content";

const Page = async ({ params }) => {
  const present = await getSchoolYear({ is_active: { _eq: true } });

  const apiListRevenue = await getListRevenue();

  const apiCalculationUnit = await getCalculationUnit();

  const student = await meilisearchStudentGet(params.student_code);

  if (
    present.status !== 200 ||
    apiListRevenue.status !== 200 ||
    apiCalculationUnit.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      student={student}
      present={present.data}
      listRevenue={apiListRevenue.data}
      calculationUnit={apiCalculationUnit.data}
    />
  );
};

export default Page;
