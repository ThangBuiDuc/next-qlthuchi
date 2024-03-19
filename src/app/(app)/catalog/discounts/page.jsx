import {
  getDiscounts,
  getDiscountType,
  getRevenueGroup,
} from "@/utils/funtionApi";

import Content from "./content";

const Page = async () => {
  const apiGetDiscounts = await getDiscounts();
  const apiGetDiscountType = await getDiscountType();
  const apiGetRevenueGroup = await getRevenueGroup();

  if (
    apiGetDiscounts.status !== 200 ||
    apiGetDiscountType.status !== 200 ||
    apiGetRevenueGroup.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  // console.log(apiGetDiscounts.data);
  // console.log(apiGetDiscountType.data);
  // console.log(apiGetRevenueGroup.data);
  return <Content
    discountsData = {apiGetDiscounts.data}
    discountTypeData ={apiGetDiscountType.data}
    revenueGroupData = {apiGetRevenueGroup.data}
    />;
  // return "123";
};

export default Page;
