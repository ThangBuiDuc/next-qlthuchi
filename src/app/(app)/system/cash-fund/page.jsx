import { getCashFund } from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";
import Content from "./content";

const Page = async () => {
  const { getToken } = auth();
  const apiCashFund = await getCashFund(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
    })
  );

  if (apiCashFund.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <div className="flex flex-col p-[20px] gap-[15px]">
      {/* <div className="flex gap-1 items-center w-full justify-center"> */}
      <h4 className="text-center">Quỹ tiền mặt</h4>
      {/* </div> */}
      <Content cashFund={apiCashFund.data} />
    </div>
  );
};

export default Page;
