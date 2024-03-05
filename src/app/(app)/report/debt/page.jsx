import { getSchoolYear } from "@/utils/funtionApi";
import Content from "./content";

const Page = async () => {
  const present = await getSchoolYear({ is_active: { _eq: true } });

  if (present.status !== 200) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }
  return <Content present={present.data} />;
};

export default Page;
