import Content from "./content";
import {
  getListSearch,
  getPreBill,
  getSchoolYear,
  getPermission,
  getRevenueGroup,
  getConfig,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const pathName = "/spend/create-bill-refund";
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

  const [apiGetRevenueGroup, apiListSearch, apiPreBill, present, apiConfig] =
    await Promise.all([
      getRevenueGroup(),
      getListSearch(),
      getPreBill(),
      getSchoolYear({ is_active: { _eq: true } }),
      getConfig(),
    ]);

  // const apiGetRevenueGroup = await getRevenueGroup();
  // const apiListSearch = await getListSearch();
  // const apiPreBill = await getPreBill();
  // const present = await getSchoolYear({ is_active: { _eq: true } });

  if (
    apiListSearch.status !== 200 ||
    !apiPreBill ||
    apiGetRevenueGroup.status !== 200 ||
    apiConfig.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      revenueGroup={apiGetRevenueGroup.data}
      listSearch={apiListSearch.data}
      InitialPreBill={apiPreBill}
      present={present.data}
      permission={permission.data.result[0]?.permission.id.toString()}
      config={apiConfig.data}
    />
  );
};

export default Page;
