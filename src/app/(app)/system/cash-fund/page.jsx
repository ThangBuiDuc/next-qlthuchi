import { getCashFund, getPermission } from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";
import Content from "./content";

const Page = async () => {
  const pathName = "/system/cash-fund";
  const { getToken } = auth();

  const permission = await getPermission(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    }),
    pathName
  );

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

  const apiCashFund = await getCashFund(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    })
  );

  if (apiCashFund.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <div className="flex flex-col p-[20px] gap-[15px]">
      {/* <div className="flex gap-1 items-center w-full justify-center"> */}
      <h4 className="text-center">Quỹ tiền mặt</h4>
      {/* </div> */}
      <Content
        cashFund={apiCashFund.data}
        permission={permission.data.result[0]?.permission.id.toString()}
      />
    </div>
  );
};

export default Page;
