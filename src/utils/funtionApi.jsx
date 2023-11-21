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

// Tạo clerk user
export const createClerkUser = async (first_name,last_name,email) => {
  const res = await axios({
    url: process.env.NEXT_CLERK_CREATE_USER,
    method: "post",
    data: {
      "first_name": first_name,
      "last_name": last_name,
      "email-address": email,
      "password" : "Abc@123654"
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  return res;
};


