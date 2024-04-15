import {
  getSchoolYear,
  meilisearchStudentGet,
  getPreReceipt,
  getPermission,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

import Content from "./content";

const Page = async ({ params }) => {
  const pathName = "/spend/refund";
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

  const present = await getSchoolYear({ is_active: { _eq: true } });

  const student = await meilisearchStudentGet(params.student_code);

  const apiPreReceipt = await getPreReceipt();

  if (present.status !== 200 || !student || !apiPreReceipt)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      student={student}
      present={present.data}
      InitialPreReceipt={apiPreReceipt}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
