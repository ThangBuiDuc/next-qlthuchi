import axios from "axios";

//GET---------------------------------------------------------------------

//Lấy thông tin năm học và kỳ học
export const getSchoolYear = async (where) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_PRESENT,
    method: "post",
    data: {
      where,
    },
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy thông tin số lượng học sinh
export const getCountStudent = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_COUNT_STUDENT,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy thông tin các khoản thu
export const getListRevenue = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_LIST_REVENUE,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy thông tin các đơn vị tính
export const getCaculationUnit = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CACULATION_UNIT,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy danh sách các cấp và trường học
export const getListSchool = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_LIST_SCHOOL,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
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

//Lấy danh sách học sinh
export const getStudent = async (token, where) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_STUDENT,
    method: "post",
    data: {
      where,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy thông tin danh mục cấp, khối, lớp phục vụ tìm kiếm học sinh
export const getListSearch = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_LIST_SEARCH,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//UPDATE---------------------------------------------------------------------

//INSERT---------------------------------------------------------------------

// Tạo mới học sinh
export const createStudent = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_STUDENT,
    method: "post",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};
