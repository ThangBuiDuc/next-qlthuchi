import { auth } from "@clerk/nextjs";
import { getListPermissionFunction, getPermission } from "@/utils/funtionApi";

import Content from "./content";

const Page = async () => {
  const pathName = "/system/roles";
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

  const ApiListPermissionFunction = await getListPermissionFunction();

  if (ApiListPermissionFunction.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  // const jwt = await getToken({
  //   template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
  // });

  // const rolesList = await getRolesList(jwt);
  // const userRole = await getUserRole(jwt);

  return (
    <Content
      permission={permission.data.result[0]?.permission.id.toString()}
      listPermissionFunction={ApiListPermissionFunction.data}
    />
  );
};
export default Page;
