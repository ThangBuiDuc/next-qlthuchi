import Content from "./content";
import {
  getSchoolYear,
  meilisearchStudentGet,
  getPermission,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async ({ params }) => {
  const pathName = "/expected-revenue/create";
  const { getToken, userId } = auth();

  const token = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  });

  const permission = await getPermission(token, pathName, userId);

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
  const [student, present] = await Promise.all([
    meilisearchStudentGet(params.student_code),
    getSchoolYear({ is_active: { _eq: true } }),
  ]);
  // const present = await getSchoolYear({ is_active: { _eq: true } });

  // const student = await meilisearchStudentGet(params.student_code);

  if (present.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      present={present.data}
      student={student}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
