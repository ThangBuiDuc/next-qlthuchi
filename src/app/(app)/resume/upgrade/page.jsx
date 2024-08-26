import Content from "./content";
import {
  getListSearch,
  getSchoolYear,
  getPermission,
  getUpgrade,
  getListSearchSchoolYear,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const pathName = "/resume/upgrade";
  const { getToken, userId } = auth();

  const token = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  });

  // const permission = await getPermission(token, pathName);

  const [permission, apiUpgrade] = await Promise.all([
    getPermission(token, pathName, userId),
    getUpgrade(),
  ]);

  // console.log(permission.data, apiUpgrade.data);

  if (permission.status !== 200 || apiUpgrade.status !== 200)
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

  if (!apiUpgrade.data.result[0].previous_school_year_id) {
    return (
      <div className="flex justify-center">
        <h3>Hiện tại chưa có thông tin năm học trước!</h3>
      </div>
    );
  }

  const [apiListSearchSchoolYear, present] = await Promise.all([
    getListSearchSchoolYear(apiUpgrade.data.result[0].previous_school_year_id),
    getSchoolYear({ is_active: { _eq: true } }),
  ]);

  // const apiListSearchSchoolYear = await getListSearch();

  // const present = await getSchoolYear({ is_active: { _eq: true } });

  // const apiListRevenue = await getListRevenue();

  // const apiCalculationUnit = await getCalculationUnit();

  // console.log(process.env.NEXT_PUBLIC_HASURA_GET_CALCULATION_UNIT)

  if (apiListSearchSchoolYear.status !== 200 || present.status !== 200)
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
      listSearchSchoolYear={apiListSearchSchoolYear.data}
      present={present.data}
      permission={permission.data.result[0]?.permission.id.toString()}
      upgrade={apiUpgrade.data}
    />
  );

  // return <p>1</p>
};

export default Page;
