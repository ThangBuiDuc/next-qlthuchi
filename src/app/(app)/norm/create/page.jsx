import Content from "./content";
import {
  getCalculationUnit,
  getListRevenue,
  getListSearch,
  getSchoolYear,
} from "@/utils/funtionApi";

const Page = async () => {

  

  const apiListSearch = await getListSearch();

  const present = await getSchoolYear({ is_active: { _eq: true } });

  const apiListRevenue = await getListRevenue();

  const apiCalculationUnit = await getCalculationUnit();
  
  // console.log(process.env.NEXT_PUBLIC_HASURA_GET_CALCULATION_UNIT)

  if (
    apiListSearch.status !== 200 ||
    present.status !== 200 ||
    apiListRevenue.status !== 200 ||
    apiCalculationUnit.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      listSearch={apiListSearch.data}
      present={present.data}
      listRevenue={apiListRevenue.data}
      calculationUnit={apiCalculationUnit.data}
    />
  );

  // return <p>1</p>
};

export default Page;
