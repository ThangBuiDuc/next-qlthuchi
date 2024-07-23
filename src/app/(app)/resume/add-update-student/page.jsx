import {
  getCatalogStudent,
  // getCountStudent,
  getListSearch,
  getSchoolYear,
  getPermission,
  getConfig,
} from "@/utils/funtionApi";
import Content from "./content";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const pathName = "/resume/add-update-student";
  const { getToken } = auth();

  // const client = createApolloClient();
  // const { data } = client.subscribe({
  //   query: gql`
  //     subscription MySubscription {
  //       count_student {
  //         count
  //       }
  //     }
  //   `,
  // });

  // console.log(data);

  const token = await getToken({
    template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  });

  const permission = await getPermission(token, pathName);

  // console.log(permission.data);

  if (permission.status !== 200)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  if (permission.data.result.length === 0)
    return (
      <div className="flex justify-center">
        <h3>Tài khoản chưa được phân quyền cho chức năng hiện tại!</h3>
      </div>
    );

  if (
    permission.data.result[0]?.permission.id.toString() ===
    process.env.NEXT_PUBLIC_PERMISSION_NONE
  ) {
    return (
      <div className="flex justify-center">
        <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
      </div>
    );
  }

  // const presentPromise = getSchoolYear({ is_active: { _eq: true } });

  // const apiCatalogStudentPromise = getCatalogStudent();

  // const apiListSearchPromise = getListSearch();

  // const apiCountStudentPromise = getCountStudent();

  const [present, apiCatalogStudent, apiListSearch, apiConfig] =
    await Promise.all([
      getSchoolYear({ is_active: { _eq: true } }),
      getCatalogStudent(),
      getListSearch(),
      getConfig(),
    ]);

  if (
    apiCatalogStudent.status !== 200 ||
    // apiCountStudent.status !== 200 ||
    apiListSearch.status !== 200 ||
    present.status !== 200 ||
    apiConfig.status != 200
  )
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <Content
      catalogStudent={apiCatalogStudent.data}
      // countStudent={apiCountStudent.data}
      config={apiConfig.data}
      present={present.data}
      listSearch={apiListSearch.data}
      permission={permission.data.result[0]?.permission.id.toString()}
    />
  );
};

export default Page;
