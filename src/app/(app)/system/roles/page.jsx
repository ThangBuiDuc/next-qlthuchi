import { auth } from "@clerk/nextjs";
import { getRole, getRolesList } from "@/utils/funtionApi";   

import Content from "./content";



const Page = async () => {
  const { getToken } = auth();

  const role = await getRole(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ANONYMOUS,
    })
  );

  console.log(role.data.result[0]?.role_id);

  if (
    role.data.result[0]?.role_id.toString() !== process.env.NEXT_PUBLIC_HASURA_ROLE_ACCOUNT_ADMIN
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

  const rolesList = await getRolesList(jwt);


  if (
      rolesList.status !== 200
    )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content roleData={rolesList.data} />
  );
};
export default Page;