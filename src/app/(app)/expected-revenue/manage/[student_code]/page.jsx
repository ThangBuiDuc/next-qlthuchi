import {
  getCalculationUnit,
  getListRevenue,
  getListSearch,
  getSchoolYear,
  meilisearchGet,
} from "@/utils/funtionApi";

import Content from "./content";

const Page = async ({ params }) => {
  const apiListSearch = await getListSearch();

  const present = await getSchoolYear({ is_active: { _eq: true } });

  const apiListRevenue = await getListRevenue();

  const apiCalculationUnit = await getCalculationUnit();

  const student = await meilisearchGet(params.student_code);

  if (
    apiListSearch.status !== 200 ||
    present.status !== 200 ||
    apiListRevenue.status !== 200 ||
    apiCalculationUnit.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      student={student}
      listSearch={apiListSearch.data}
      present={present.data}
      listRevenue={apiListRevenue.data}
      calculationUnit={apiCalculationUnit.data}
    />
  );
};

export default Page;
