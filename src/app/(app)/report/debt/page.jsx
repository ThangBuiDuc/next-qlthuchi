import { getSchoolYear } from "@/utils/funtionApi";
import Content from "./content";

const Page = async () => {
  const apiGetSchoolYear = await getSchoolYear();
  if (apiGetSchoolYear.status !== 200) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return <Content schoolYear={apiGetSchoolYear.data} />;
};

export default Page;
