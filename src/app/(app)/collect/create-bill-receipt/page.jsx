import Content from "./content";
import { getListSearch, getPreBill, getSchoolYear } from "@/utils/funtionApi";

const Page = async () => {
  const apiListSearch = await getListSearch();
  const apiPreBill = await getPreBill();
  const present = await getSchoolYear({ is_active: { _eq: true } });

  if (apiListSearch.status !== 200 || !apiPreBill)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      listSearch={apiListSearch.data}
      InitialPreBill={apiPreBill}
      present={present.data}
    />
  );
};

export default Page;
