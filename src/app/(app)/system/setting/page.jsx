import { auth } from "@clerk/nextjs";
import { getConfig, getPermission } from "@/utils/funtionApi";

import Content from "./content";

const Page = async () => {
  const pathName = "/system/setting";
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

  const ApiConfig = await getConfig();

  if (ApiConfig.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  // const jwt = await getToken({
  //   template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
  // });

  // const rolesList = await getRolesList(jwt);
  // const userRole = await getUserRole(jwt);

  // console.log(ApiConfig.data);

  return (
    <Content
      permission={permission.data.result[0]?.permission.id.toString()}
      config={ApiConfig.data.result[0].config}
      configID={ApiConfig.data.result[0].id}
    />
    // <>page</>
  );
};
export default Page;
