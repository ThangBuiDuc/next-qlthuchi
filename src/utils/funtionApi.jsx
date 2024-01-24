import axios from "axios";

// ##### Hệ Thống ######

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

//Lấy danh sách người dùng + quyền
export const getUserRole = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_USER_ROLE,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lay danh sách tỉnh thành phố
export const getProvinces = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_PROVINCES,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lay danh sách quận huyện
export const getDistricts = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_DISTRICTS,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lay danh sách quận huyện của một thành phố
export const getDistrictsOfProvince = async (id) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_HASURA_GET_DISTRICTS_OF_PROVINCE}${id}`,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Lay danh sách phường xã
export const getWards = async (id) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_HASURA_GET_WARDS}${id}`,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//INSERT-----------------------------------------------------

// Tạo mới người dùng
export const createUser = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_INSERT_USER,
    method: "post",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Thêm quyền cho người dùng
export const upsertUserRole = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPSERT_USER_ROLE,
    method: "put",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//=====================================================================================================================================================

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

//Lấy thông tin nhóm khoản thu
export const getRevenueGroup = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_REVENUE_GROUP,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy thông tin kết chuyển công nợ
export const getTransfer = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_TRANSFER,
    method: "get",
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

  return res.data;
};

//Lấy thông tin cần thiết phục vụ PHIẾU thu/chi
export const getPreBill = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_PRE_BILL,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res.data;
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
      where: where,
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

//Lấy thông tin lịch sử biên lai thu
export const getHistoryReceipt = async (token, where, where1, pageParam) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_HISTORY_RECEIPT,
    method: "post",
    data: {
      where,
      where1,
      limit: pageParam ? 10 : null,
      offset: pageParam ? (pageParam - 1) * 10 : null,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return { ...res, nextPage: ++pageParam };
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

//Cập nhật biên lai thu
export const updateReceipt = async (token, updates) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_RECEIPT,
    method: "patch",
    data: { updates: updates },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Cập nhật phiếu thu
export const updateBillReceipt = async (token, updates) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_BILL_RECEIPT,
    method: "patch",
    data: { updates: updates },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Cập nhật phiếu chi
export const updateBillRefund = async (token, updates) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_BILL_REFUND,
    method: "patch",
    data: { updates: updates },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Cập nhật phụ huynh học sinh
export const updateParent = async (token, data) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_PARENT,
    method: "patch",
    data: { ...data },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Cập nhật  học sinh
export const updateStudent = async (token, data) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_STUDENT,
    method: "patch",
    data: { ...data },
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
    method: "put",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

// Tạo mới người dùng
export const createParent = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_PARENT,
    method: "put",
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

//Tạo mới biên lai thu
export const createReceipt = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_RECEIPT,
    method: "put",
    data: { objects: objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Tạo mới biên lai chi
export const createRefund = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_REFUND,
    method: "put",
    data: { objects: objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Tạo mới phiếu thu tiền mặt
export const createBillReceipt = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_BILL_RECEIPT,
    method: "put",
    data: { objects: objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Tạo mới phiếu chi tiền mặt
export const createBillRefund = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_BILL_REFUND,
    method: "put",
    data: { objects: objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Tạo định mức thu BHYT router handler
export const createInsuranceRevenueNorm = async (data) => {
  const res = await axios({
    url: "/api/norm",
    method: "PUT",
    data,
  });

  return res;
};

//Thực hiện kết chuyển công nợ
export const Transfer = async (token, updates, objects, update_columns) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_TRANSFER,
    method: "post",
    data: { objects, updates, update_columns },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Thực hiện kết chuyển công nợ router handler
export const handleTransfer = async (data) => {
  const res = await axios({
    url: "/api/transfer",
    method: "POST",
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

//Tạo dự kiến thu bổ sung
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
export const meilisearchStudentSearch = async (data, token, pageParam) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_student/search`,
    method: "post",
    data: {
      q: data.query,
      hitsPerPage: 15,
      page: pageParam ? pageParam : 1,
      filter: `year_active=true AND status_id = 1 ${
        data.school ? `AND school_level_code= ${data.school.code}` : ""
      } ${
        data.class_level ? `AND class_level_code= ${data.class_level.code}` : ""
      } ${data.class ? `AND class_name= ${data.class.label}` : ""}`,
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

//Lấy thông tin biên lai thu qua Meilisearch
export const meilisearchReceiptGet = async (data, token, pageParam) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_receipt/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      limit: pageParam ? 10 : 10000,
      offset: pageParam ? (pageParam - 1) * 10 : 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (pageParam) {
    return { ...res, nextPage: ++pageParam };
  } else {
    return res.data;
  }
};

//Lấy thông tin phiếu thu qua Meilisearch
export const meilisearchBillReceiptGet = async (data, token, pageParam) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_bill_receipt/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      limit: pageParam ? 10 : 10000,
      offset: pageParam ? (pageParam - 1) * 10 : 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (pageParam) {
    return { ...res, nextPage: ++pageParam };
  } else {
    return res.data;
  }
};

//Lấy thông tin biên lai hoàn trả qua Meilisearch
export const meilisearchRefundGet = async (data, token, pageParam) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_refund/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      limit: pageParam ? 10 : 10000,
      offset: pageParam ? (pageParam - 1) * 10 : 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (pageParam) {
    return { ...res, nextPage: ++pageParam };
  } else {
    return res.data;
  }
};

//Lấy thông tin phiếu thu qua Meilisearch
export const meilisearchBillRefundGet = async (data, token, pageParam) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_bill_refund/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      limit: pageParam ? 10 : 10000,
      offset: pageParam ? (pageParam - 1) * 10 : 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (pageParam) {
    return { ...res, nextPage: ++pageParam };
  } else {
    return res.data;
  }
};

//Lấy thông tin báo cáo khoản đã thu nhiều học sinh
export const meilisearchReportReceiptGet = async (token) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_report_receipt/documents/fetch`,
    method: "post",
    data: {
      // filter: data,
      limit: 10000,
      offset: 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Lấy thông tin báo cáo khoản đã thu một học sinh
export const meilisearchReportReceiptOneGet = async (token, data) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_report_receipt_one/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      limit: 10000,
      offset: 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Lấy thông tin tổng hợp công nợ
export const meilisearchReportDebtGet = async (token, data) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_f_batch_debt/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      limit: 10000,
      offset: 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Lấy thông tin báo cáo khoản đã hoàn trả nhiều học sinh
export const meilisearchReportRefundGet = async (token) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_report_refund/documents/fetch`,
    method: "post",
    data: {
      // filter: data,
      limit: 10000,
      offset: 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Lấy thông tin báo cáo khoản đã hoàn một học sinh
export const meilisearchReportRefundOneGet = async (token, data) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_report_refund_one/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      limit: 10000,
      offset: 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Lấy thông tin học sinh qua Meilisearch
export const meilisearchStudentGet = async (student_code) => {
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
