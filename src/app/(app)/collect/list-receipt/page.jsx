import Content from "./content";
import { getListSearch } from "@/utils/funtionApi";

const Page = async () => {
  const apiListSearch = await getListSearch();

  if (apiListSearch.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return <Content listSearch={apiListSearch.data} />;
};

export default Page;
