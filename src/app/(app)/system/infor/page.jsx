import Content from "./content";
import { getUser } from "@/utils/funtionApi";
import { auth } from "@clerk/nextjs";

const page = async () => {
  const { getToken, userId } = auth();

  const apiGetUser = await getUser(
    await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    }),
    userId
  );

  if (apiGetUser.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  //   console.log(apiGetUser);

  return <Content user={apiGetUser.data} />;
};

export default page;
