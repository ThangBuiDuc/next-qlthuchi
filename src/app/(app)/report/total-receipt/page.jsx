import { getConfig, getListSearch, getRevenueGroup } from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";
import { getPermission } from "@/utils/funtionApi";

const Page = async () => {
  const pathName = "/report/total-receipt";
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

  const [apiListSearch, apiGetRevenueGroup, apiGetConfig] = await Promise.all([
    getListSearch(),
    getRevenueGroup(),
    getConfig(),
  ]);

  if (
    apiGetRevenueGroup.status !== 200 ||
    apiListSearch.status !== 200 ||
    apiGetConfig.status !== 200
  ) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return (
    <Content
      revenueGroup={apiGetRevenueGroup.data.result}
      listSearch={apiListSearch.data}
      config={apiGetConfig.data}
    />
  );
};

export default Page;
