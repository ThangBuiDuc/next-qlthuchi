import Content from "./content";
import { auth } from "@clerk/nextjs";
import { getPermission, getStudyStatus } from "@/utils/funtionApi";

const Page = async () => {
  const pathName = "/catalog/study-status";
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

  const statusData = await getStudyStatus();
  if (statusData.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");



  return (
    <Content permission={permission.data.result[0]?.permission.id.toString()} statusData={statusData.data}/>
  );
};

export default Page;
