import Content from "./content";
import { auth } from "@clerk/nextjs";
import { getConfig, getPermission } from "@/utils/funtionApi";

const Page = async ({ params }) => {
  const pathName = "/report/one-payment-history";
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

  const apiConfig = await getConfig();

  if (apiConfig.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return <Content student_code={params.student_code} config={apiConfig.data} />;
};

export default Page;
