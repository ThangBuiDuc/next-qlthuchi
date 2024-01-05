import {
  getDistrictsOfProvince,
  getRole,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";
import Content from "./content";


const Page = async ({ params }) => {
  console.log(params.provinces_code);
  const { getToken } = auth();

  const role = await getRole(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    })
  );

  // console.log(role.data.result[0]?.role_id);

  if (
    role.data.result[0]?.role_id.toString() !==
    process.env.NEXT_PUBLIC_HASURA_ROLE_SUPER_ADMIN
  ) {
    return (
      <div className="flex justify-center">
        <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
      </div>
    );
  }

  const jwt = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
  });

  const apiGetDistricts = await getDistrictsOfProvince(params.provinces_code);
  // console.log(apiGetDistricts.data)

  if (apiGetDistricts.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  
  return (
    <Content districts={apiGetDistricts.data}/>
  );
};

export default Page;
