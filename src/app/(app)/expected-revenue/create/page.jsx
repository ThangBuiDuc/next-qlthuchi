import Content from "./content";
import { getListSearch, getSchoolYear } from "@/utils/funtionApi";

const Page = async () => {
  const apiListSearch = await getListSearch();

  const present = await getSchoolYear({ is_active: { _eq: true } });

  if (apiListSearch.status !== 200 || present.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return <Content listSearch={apiListSearch.data} present={present.data} />;
};

export default Page;
