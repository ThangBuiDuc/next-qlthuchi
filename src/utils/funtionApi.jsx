import axios from "axios";

//GET---------------------------------------------------------------------

//Lấy role
export const getRole = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_ROLE,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

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

//Lay danh sách tỉnh thành phố
export const getProvinces = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_PROVINCES,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lay danh sách quận huyện
export const getDistricts = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_DISTRICTS,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lay danh sách phường xã
export const getWards = async (token, id) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_HASURA_GET_WARDS}${id}`,
    method: "get",
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



//Lấy danh sách người dùng
export const getUsers = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_USERS,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};



//Lấy danh sách roles
export const getRolesList = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_ROLE_LIST,
    method: "get",
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
    url: process.env.NEXT_PUBLIC_HASURA_DELETE_REVENUE_NORM,
    method: "patch",
    data: { updates: updates, objects: objects, log: log },
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


// Tạo mới người dùng
export const createUser = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_INSERT_USER,
    method: "post",
    data: {objects},
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};



// Tạo mới người dùng
export const createUser = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_INSERT_USER,
    method: "post",
    data: {objects},
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
    data: { objects, log },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
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
      page: pageParam,
      filter: `year_active=true AND status_id = 1 ${
        data.school ? `AND school_level_id= ${data.school.value}` : ""
      } ${data.class_level ? `AND class_id= ${data.class_level.value}` : ""} ${
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
