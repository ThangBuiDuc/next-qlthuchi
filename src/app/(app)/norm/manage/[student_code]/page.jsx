import {
  getCalculationUnit,
  getListRevenue,
  getSchoolYear,
  meilisearchStudentGet,
  getPermission,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

import Content from "./content";

const Page = async ({ params }) => {
  const pathName = "/norm/manage";
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

  const [present, apiListRevenue, apiCalculationUnit, student] =
    await Promise.all([
      getSchoolYear({ is_active: { _eq: true } }),
      getListRevenue(),
      getCalculationUnit(),
      meilisearchStudentGet(params.student_code),
    ]);

  // const present = await getSchoolYear({ is_active: { _eq: true } });

  // const apiListRevenue = await getListRevenue();

  // const apiCalculationUnit = await getCalculationUnit();

  // const student = await meilisearchStudentGet(params.student_code);

  // console.log("hoc sinh",student)

  if (
    present.status !== 200 ||
    apiListRevenue.status !== 200 ||
    apiCalculationUnit.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  if (present.data.result.length === 0)
    return (
      <div className="flex gap-1 items-center w-full justify-center p-10">
        <h5>
          Hệ thống chưa khởi tạo năm học, vui lòng tạo năm học mới để thực hiện
          các chức năng!
        </h5>
      </div>
    );

  return (
    <Content
      student={student}
      present={present.data}
      listRevenue={apiListRevenue.data}
      calculationUnit={apiCalculationUnit.data}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
