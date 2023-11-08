import axios from "axios";

//GET---------------------------------------------------------------------

//Lấy danh sách các cấp và trường học
export const getListSchool = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_LIST_SCHOOL,
    method: "get",
    headers: {
      "content-type": "Application/json",
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_TOKEN,
    },
  });

  return res;
};

//Lấy danh sách các lớp học
export const getCatalogStudent = async (token, code) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CATALOG_STUDENT,
    method: "post",
    data: {
      school_level: code,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//UPDATE---------------------------------------------------------------------

//INSERT---------------------------------------------------------------------

// Tạo mới học sinh
export const createStudent = async (token, data) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_INSERT_STUDENT,
    method: "post",
    data,
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};
