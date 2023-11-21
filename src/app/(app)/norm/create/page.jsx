import Content from "./content";
import {
  getCaculationUnit,
  getListRevenue,
  getListSearch,
  getSchoolYear,
} from "@/utils/funtionApi";

const Page = async () => {
  const apiListSearch = await getListSearch();

  const present = await getSchoolYear({ is_active: { _eq: true } });

  const apiListRevenue = await getListRevenue();

  const apiCaculationUnit = await getCaculationUnit();

  if (
    apiListSearch.status !== 200 ||
    present.status !== 200 ||
    apiListRevenue.status !== 200 ||
    apiCaculationUnit.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      listSearch={apiListSearch.data}
      present={present.data}
      listRevenue={apiListRevenue.data}
      caculationUnit={apiCaculationUnit.data}
    />
  );
};

export default Page;
