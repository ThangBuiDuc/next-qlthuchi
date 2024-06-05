import {
  getCalculationUnit,
  getListRevenue,
  getListSearch,
  getSchoolYear,
  meilisearchStudentGet,
  getDiscounts,
  getPermission,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

import Content from "./content";

const Page = async ({ params }) => {
  const pathName = "/expected-revenue/voucher";
  const { getToken } = auth();

  const token = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  });

  const permission = await getPermission(token, pathName);

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

  const apiListSearch = await getListSearch();

  const present = await getSchoolYear({ is_active: { _eq: true } });

  const apiListRevenue = await getListRevenue();

  const apiCalculationUnit = await getCalculationUnit();

  const student = await meilisearchStudentGet(params.student_code);

  console.log(student)

  const apiGetDiscounts = await getDiscounts();

  if (
    apiListSearch.status !== 200 ||
    present.status !== 200 ||
    apiListRevenue.status !== 200 ||
    apiCalculationUnit.status !== 200 ||
    apiGetDiscounts.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      student={student}
      listSearch={apiListSearch.data}
      present={present.data}
      listRevenue={apiListRevenue.data}
      calculationUnit={apiCalculationUnit.data}
      discounts={apiGetDiscounts.data.result}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
