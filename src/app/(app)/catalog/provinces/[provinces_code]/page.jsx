import { getDistrictsOfProvince, getPermission } from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";
import Content from "./content";

const Page = async ({ params }) => {
  const pathName = "/catalog/provinces";
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

  const apiGetDistricts = await getDistrictsOfProvince(params.provinces_code);
  // console.log(apiGetDistricts.data)

  if (apiGetDistricts.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return <Content districts={apiGetDistricts.data} />;
};

export default Page;
