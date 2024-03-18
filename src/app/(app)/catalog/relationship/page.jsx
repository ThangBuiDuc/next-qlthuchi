import Content from "./content";
import { auth } from "@clerk/nextjs";
import { getPermission, getFamilyRalationship } from "@/utils/funtionApi";

const Page = async () => {
  const pathName = "/catalog/relationship";
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

  const relationshipData = await getFamilyRalationship()
  if (relationshipData.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");


  return (
    <Content permission={permission.data.result[0]?.permission.id.toString()} relationshipData={relationshipData.data}/>
  );
};

export default Page;
