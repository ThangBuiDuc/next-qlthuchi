import { getWards, getPermission } from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";
import Content from "./content";

const Page = async ({ params }) => {
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

  const apiGetWard = await getWards(params.district_code);

  if (apiGetWard.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  return (
    <Content
      wards={apiGetWard.data}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
