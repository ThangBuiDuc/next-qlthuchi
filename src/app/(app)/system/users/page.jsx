import Content from "./content";
import { getProvinces, getDistricts } from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const { getToken } = auth();
  const jwt = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
  });
  const apiGetProvinces = await getProvinces(jwt);

  const apiGetDistricts = await getDistricts(jwt);

  if (apiGetProvinces.status !== 200 || apiGetDistricts.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      provinces={apiGetProvinces.data}
      districts={apiGetDistricts.data}
      jwt = {jwt}
    />
  );
};
export default Page;
