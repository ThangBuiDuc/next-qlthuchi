import {
  getCatalogStudent,
  getCountStudent,
  getListSearch,
  getSchoolYear,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const { getToken } = auth();
  const token = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
  });

  const presentPromise = getSchoolYear({ is_active: { _eq: true } });

  const apiCatalogStudentPromise = getCatalogStudent(token);

  const apiListSearchPromise = getListSearch();

  const apiCountStudentPromise = getCountStudent(token);

  const [present, apiCatalogStudent, apiListSearch, apiCountStudent] =
    await Promise.all([
      presentPromise,
      apiCatalogStudentPromise,
      apiListSearchPromise,
      apiCountStudentPromise,
    ]);

  if (
    apiCatalogStudent.status !== 200 ||
    apiCountStudent.status !== 200 ||
    apiListSearch.status !== 200 ||
    present.status !== 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      catalogStudent={apiCatalogStudent.data}
      countStudent={apiCountStudent.data}
      present={present.data}
      listSearch={apiListSearch.data}
    />
  );
};

export default Page;
