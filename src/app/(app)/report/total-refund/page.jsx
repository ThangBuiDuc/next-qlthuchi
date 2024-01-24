import { getRevenueGroup } from "@/utils/funtionApi";
import Content from "./content";

const Page = async () => {
  const apiGetRevenueGroup = await getRevenueGroup();

  if (apiGetRevenueGroup.status !== 200) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return <Content revenueGroup={apiGetRevenueGroup.data.result} />;
};

export default Page;
