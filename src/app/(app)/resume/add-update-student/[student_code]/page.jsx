import {
  getCatalogStudent,
  // getSchoolYear,
  getPermission,
  getSchoolYear,
  getStudent,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";

const Page = async ({ params }) => {
  const pathName = "/resume/add-update-student";
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

  // const present = await getSchoolYear({ is_active: { _eq: true } });

  const [present, apiCatalogStudent, studentInfor] = await Promise.all([
    getSchoolYear({ is_active: { _eq: true } }),
    getCatalogStudent(),
    getStudent(token, {
      code: { _eq: params.student_code },
    }),
  ]);

  if (
    apiCatalogStudent.status !== 200 ||
    present.status !== 200 ||
    studentInfor.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  return (
    <Content
      student_code={params.student_code}
      initialStudent={studentInfor.data}
      present={present.data}
      catalogStudent={apiCatalogStudent.data}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
