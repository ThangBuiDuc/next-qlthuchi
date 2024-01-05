import {
  getSchoolYear,
  meilisearchStudentGet,
  getPreReceipt,
} from "@/utils/funtionApi";

import Content from "./content";

const Page = async ({ params }) => {
  const present = await getSchoolYear({ is_active: { _eq: true } });

  const student = await meilisearchStudentGet(params.student_code);

  const apiPreReceipt = await getPreReceipt();

  if (present.status !== 200 || !student || !apiPreReceipt)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      student={student}
      present={present.data}
      InitialPreReceipt={apiPreReceipt}
    />
  );
};

export default Page;
