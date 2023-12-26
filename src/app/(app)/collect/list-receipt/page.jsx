import Content from "./content";
import { getListSearch, getPreReceipt } from "@/utils/funtionApi";

const Page = async () => {
  const apiListSearch = await getListSearch();
  const apiPreReceipt = await getPreReceipt();

  if (apiListSearch.status !== 200 || !apiPreReceipt)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return <Content listSearch={apiListSearch.data} preReceipt={apiPreReceipt} />;
};

export default Page;
