import Content from "./content";
import {
  getConfig,
  getListSearch,
  //   getPreReceipt,
  getPermission,
  getRevenueGroup,
} from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const pathName = "/collect/report-receipt";
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

  const [
    apiGetRevenueGroup,
    apiListSearch,
    apiConfig,
    // , apiPreReceipt
  ] = await Promise.all([
    getRevenueGroup(),
    getListSearch(),
    getConfig(),
    // getPreReceipt(),
  ]);
  // const apiListSearch = await getListSearch();
  // const apiPreReceipt = await getPreReceipt();

  if (
    apiListSearch.status !== 200 ||
    apiGetRevenueGroup.status !== 200 ||
    apiConfig.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  // if (present.data.result.length === 0)
  //   return (
  //     <div className="flex gap-1 items-center w-full justify-center p-10">
  //       <h5>
  //         Hệ thống chưa khởi tạo năm học, vui lòng tạo năm học mới để thực hiện
  //         các chức năng!
  //       </h5>
  //     </div>
  //   );

  return (
    <Content
      listSearch={apiListSearch.data}
      revenueGroup={apiGetRevenueGroup.data}
      //   preReceipt={apiPreReceipt}
      permission={permission.data.result[0]?.permission.id.toString()}
      config={apiConfig.data}
    />
    // <>page</>
  );
};

export default Page;
