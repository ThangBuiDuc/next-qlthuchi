import {
  getClassLevel,
  getSchoolLevel,
  getClasses,
  getPermission,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";


const Page = async () => {
  const pathName = "/catalog/provinces";
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

  const apiClassLevel = await getClassLevel();
  const apiShoolLevel = await getSchoolLevel();
  const apiClasses = await getClasses();

  if (
    apiClassLevel.status !== 200 ||
    apiShoolLevel.status !== 200 ||
    apiClasses.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      classlevel={apiClassLevel.data}
      schoolLevel={apiShoolLevel.data}
      classes={apiClasses.data}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
