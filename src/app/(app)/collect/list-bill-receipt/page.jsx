import Content from "./content";
import { getConfig, getListSearch, getPermission } from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const pathName = "/collect/list-bill-receipt";
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

  const [apiListSearch, apiConfig] = await Promise.all([
    getListSearch(),
    getConfig(),
  ]);
  // const apiListSearch = await getListSearch();

  if (apiListSearch.status !== 200 || apiConfig.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      listSearch={apiListSearch.data}
      permission={permission.data.result[0]?.permission.id.toString()}
      config={apiConfig.data}
    />
  );
};

export default Page;
