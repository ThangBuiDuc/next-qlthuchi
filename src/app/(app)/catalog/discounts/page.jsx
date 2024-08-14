import {
  getDiscounts,
  getDiscountType,
  getRevenueGroup,
  getPermission,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

import Content from "./content";

const Page = async () => {
  const pathName = "/catalog/discounts";
  const { getToken } = auth();

  const permission = await getPermission(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    }),
    pathName
  );

  if (permission.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  if (permission.data.result.length === 0)
    return (
      <div className="flex justify-center">
        <h3>Tài khoản chưa được phân quyền cho chức năng hiện tại!</h3>
      </div>
    );

  if (
    permission.data.result[0]?.permission.id.toString() ===
    process.env.NEXT_PUBLIC_PERMISSION_NONE
  ) {
    return (
      <div className="flex justify-center">
        <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
      </div>
    );
  }

  const [apiGetDiscounts, apiGetDiscountType, apiGetRevenueGroup] =
    await Promise.all([getDiscounts(), getDiscountType(), getRevenueGroup()]);

  // const apiGetDiscounts = await getDiscounts();
  // const apiGetDiscountType = await getDiscountType();
  // const apiGetRevenueGroup = await getRevenueGroup();

  if (
    apiGetDiscounts.status !== 200 ||
    apiGetDiscountType.status !== 200 ||
    apiGetRevenueGroup.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  // console.log(apiGetDiscounts.data);
  // console.log(apiGetDiscountType.data);
  // console.log(apiGetRevenueGroup.data);
  return (
    <Content
      discountsData={apiGetDiscounts.data}
      discountTypeData={apiGetDiscountType.data}
      revenueGroupData={apiGetRevenueGroup.data}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
