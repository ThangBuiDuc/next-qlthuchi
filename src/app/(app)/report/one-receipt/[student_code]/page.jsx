import {
  getListSearch,
  getRevenueGroup,
  meilisearchStudentGet,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";
import { getPermission } from "@/utils/funtionApi";

const Page = async ({ params }) => {
  const pathName = "/report/one-receipt";
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

  const [apiListSearch, apiGetRevenueGroup, student] = await Promise.all([
    getListSearch(),
    getRevenueGroup(),
    meilisearchStudentGet(params.student_code),
  ]);

  if (
    (apiGetRevenueGroup.status !== 200 || !student,
    apiListSearch.status !== 200)
  ) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return (
    <Content
      revenueGroup={apiGetRevenueGroup.data.result}
      student_code={params.student_code}
      student={student}
      listSearch={apiListSearch.data}
    />
  );
};

export default Page;
