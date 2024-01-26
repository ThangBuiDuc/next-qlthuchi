import { getTransfer } from "@/utils/funtionApi";
import Content from "./content";
const page = async () => {
  const ApiTransfer = await getTransfer();

  if (ApiTransfer.status !== 200) {
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");
  }

  return <Content transfer={ApiTransfer.data} />;
};

export default page;
