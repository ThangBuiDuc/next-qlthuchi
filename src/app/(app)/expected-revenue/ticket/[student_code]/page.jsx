import {
  getListSearch,
  getSchoolYear,
  getPermission,
  meilisearchStudentGet,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";

const Page = async ({ params }) => {
  const pathName = "/expected-revenue/ticket";

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

  //   const apiListSearch = await getListSearch();

  const [present, student] = await Promise.all([
    getSchoolYear({ is_active: { _eq: true } }),
    meilisearchStudentGet(params.student_code),
  ]);

  // const present = await getSchoolYear({ is_active: { _eq: true } });

  // const student = await meilisearchStudentGet(params.student_code);

  //   if (apiListSearch.status !== 200 || present.status !== 200)
  //     throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  if (present.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      //   listSearch={apiListSearch.data}
      permission={permission.data.result[0]?.permission.id.toString()}
      present={present.data}
      student={student}
    />
  );
};

export default Page;
