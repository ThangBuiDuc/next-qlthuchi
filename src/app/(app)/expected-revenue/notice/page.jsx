import Content from "./content";
import {
  getListSearch,
  getSchoolYear,
  getPermission,
  getConfig,
  getRevenueGroup,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const pathName = "/expected-revenue/notice";
  const { getToken, userId } = auth();

  const token = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  });

  const permission = await getPermission(token, pathName, userId);

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

  const [apiListSearch, present, apiConfig, apiGetRevenueGroup] =
    await Promise.all([
      getListSearch(),
      getSchoolYear({ is_active: { _eq: true } }),
      getConfig(),
      getRevenueGroup(),
    ]);

  // const apiListSearch = await getListSearch();

  // const present = await getSchoolYear({ is_active: { _eq: true } });

  if (
    apiListSearch.status !== 200 ||
    present.status !== 200 ||
    apiConfig.status !== 200 ||
    apiGetRevenueGroup.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  if (present.data.result.length === 0)
    return (
      <div className="flex gap-1 items-center w-full justify-center p-10">
        <h5>
          Hệ thống chưa khởi tạo năm học, vui lòng tạo năm học mới để thực hiện
          các chức năng!
        </h5>
      </div>
    );

  return (
    <Content
      listSearch={apiListSearch.data}
      present={present.data}
      config={apiConfig.data}
      revenueGroup={apiGetRevenueGroup.data}
    />
  );
};

export default Page;
