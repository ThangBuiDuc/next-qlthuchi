import Content from "./content";
import {
  getProvinces,
  getDistricts,
  getUsers,
  getPermission,
  getGender,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const pathName = "/system/users";
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

  // const jwt = await getToken({
  //   template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
  // });

  const [apiGetProvinces, apiGetDistricts, apiGetGender, apiGetUsers] =
    await Promise.all([
      getProvinces(),
      getDistricts(),
      getGender(),
      getUsers(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        })
      ),
    ]);
  // const apiGetProvinces = await getProvinces();

  // const apiGetDistricts = await getDistricts();

  // const apiGetGender = await getGender();

  // const apiGetUsers = await getUsers(
  //   await getToken({
  //     template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  //   })
  // );

  if (
    apiGetProvinces.status !== 200 ||
    apiGetDistricts.status !== 200 ||
    apiGetUsers.status !== 200 ||
    apiGetGender.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      provinces={apiGetProvinces.data}
      districts={apiGetDistricts.data}
      gender={apiGetGender.data.result}
      usersData={apiGetUsers.data}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};
export default Page;
