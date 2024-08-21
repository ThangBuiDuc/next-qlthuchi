import {
  getTransfer,
  getPermission,
  // getCountReminder,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";
const page = async () => {
  const pathName = "/system/transfer";

  const { getToken, userId } = auth();

  const permission = await getPermission(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    }),
    pathName,
    userId
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

  const [ApiTransfer] = await Promise.all([getTransfer()]);

  if (ApiTransfer.status !== 200) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }

  // console.log(ApiCountReminder.data);

  return (
    <Content
      transfer={ApiTransfer.data}
      permission={permission.data.result[0]?.permission.id.toString()}
      // countReminder={ApiCountReminder.data}
    />
  );
};

export default page;
