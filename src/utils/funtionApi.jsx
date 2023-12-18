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

//Lấy thông tin cần thiết phục vụ thu/chi
export const getPreReceipt = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_PRE_RECEIPT,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy thông tin các đơn vị tính
export const getCalculationUnit = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CALCULATION_UNIT,
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

//Lấy thông tin định mức thu
export const getRevenueNorms = async (token, where) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_REVENUE_NORMS,
    method: "post",
    data: { where },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy danh sách dự kiến thu
export const getExpectedRevenue = async (token, where) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_EXPECTED_REVENUE,
    method: "post",
    data: { where },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//UPDATE---------------------------------------------------------------------

//Cập nhật định mức thu
export const updateRevenueNorm = async (token, updates, objects, log) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_REVENUE_NORM,
    method: "patch",
    data: { updates: updates, objects: objects, log: log },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Cập nhật dự kiến thu
export const updateExpectedRevenue = async (token, updates) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_EXPECTED_REVENUE,
    method: "patch",
    data: { updates: updates },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

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

//Tạo mới định mức thu
export const createRevenueNorm = async (token, objects, log) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_REVENUE_NORM,
    method: "put",
    data: { objects: objects, log: log.map((item) => ({ description: item })) },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Tạo định mức thu BHYT
export const createInsuranceRevenueNorm = async (data) => {
  const res = await axios({
    url: "/api/norm",
    method: "PUT",
    data,
  });

  return res;
};

//Tạo dự kiến thu router handler
export const createExpectedRevenueRouter = async (data) => {
  const res = await axios({
    url: "/api/expected-revenue",
    method: "PUT",
    data,
  });

  return res;
};

//Tạo dự kiến thu
export const createExpectedRevenue = async (token, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_EXPECTED_REVENUE,
    method: "PUT",
    data: {
      objects: objects,
      update_columns: ["prescribed_money", "start_at"],
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Tạo dự kiến thu
export const createExpectedRevenueWithOutRevenue = async (token, objects) => {
  const res = await axios({
    url: process.env
      .NEXT_PUBLIC_HASURA_CREATE_EXPECTED_REVENUE_WITH_OUT_REVENUE,
    method: "POST",
    data: {
      objects: objects,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//DELETE---------------------------------------------------------------------

//Huỷ định mức thu
export const deleteRevenueNorm = async (token, _set, where, log) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_DELETE_REVENUE_NORM,
    method: "delete",
    data: { _set: _set, where: where, log: log },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//-------------------------------THIRD PARTY------------------------------
//GET---------------------------------------

//Lấy meilisearch token
export const meilisearchGetToken = async () => {
  const res = await axios({
    url: "/api/meilisearch",
    method: "get",
  });

  return res.data.key;
};

//Tìm kiếm học sinh qua Meilisearch
export const meilisearchSearch = async (data, token, pageParam) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_student/search`,
    method: "post",
    data: {
      q: data.query,
      hitsPerPage: 15,
      page: pageParam ? pageParam : 1,
      filter: `year_active=true AND status_id = 1 ${
        data.school ? `AND school_level_code= ${data.school.code}` : ""
      } ${data.class_level ? `AND class_code= ${data.class_level.code}` : ""} ${
        data.class ? `AND class_name= ${data.class.label}` : ""
      }`,
      attributesToHighlight: ["code", "first_name", "last_name", "class_name"],
      highlightPreTag: '<span class="highlight">',
      highlightPostTag: "</span>",
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Lấy thông tin học sinh qua Meilisearch
export const meilisearchGet = async (student_code) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_student/documents/${student_code}`,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${process.env.MEILISEARCH_SECRET_KEY}`,
    },
  });

  return res.data;
};
