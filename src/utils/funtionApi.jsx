import axios from "axios";

// ##### Hệ Thống, Danh mục ######

//GET---------------------------------------------------------------------

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

//Lấy permission
export const getPermission = async (token, path, userId) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_PERMISSION,
    method: "post",
    data: {
      _eq: path,
      _eq1: userId,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy danh mục permission
export const getListPermissionFunction = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_LIST_PERMISSION_FUNCTION,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy danh sách quyền cho các chức năng của người dùng
export const getListUserPermission = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_LIST_USER_PERMISSION,
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

//Lay danh sách phường xã của một quận huyện
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

//Lấy danh sách giảm giá
export const getDiscounts = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_DISCOUNTS,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Lấy danh sách loại giảm giá
export const getDiscountType = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_DISCOUNT_TYPE,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Lấy danh sách số dư tiền mặt
export const getCashFund = async (token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CASH_FUND,
    // url: process.env.NEXT_PUBLIC_HASURA_GET_REVENUE_GROUPS,
    method: "get",
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

//Lấy danh sách nhóm dự kiến thu
// export const getRevenueGroup = async () => {
//   const res = await axios({
//     url: process.env.NEXT_PUBLIC_HASURA_GET_REVENUE_GROUP,
//     method: "get",
//     headers: {
//       "content-type": "Application/json",
//     },
//   });
//   return res;
// };

//Lấy danh sách quan hệ gia đình
export const getFamilyRalationship = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_FAMILY_RELATIONSHIP,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy danh sách trạng thái học tập
export const getStudyStatus = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_STUDY_STATUS,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy danh sách giới tính
export const getGender = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_GENDER,
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

//Thêm hoặc cập nhật quyền cho người dùng
export const upsertUserPermission = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_USER_PERMISSION,
    method: "put",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Thêm mới giảm giá
export const insertDiscount = async (token, objects) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_DISCOUNT,
    method: "post",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Thêm mới quan hệ gia đình
export const insertRelationship = async (token, name) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREAT_FAMILY_RELATIONSHIP,
    method: "post",
    data: { name },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Thêm mới trạng thái học tập
export const insertStudyStatus = async (token, name) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREAT_STUDY_STATUS,
    method: "post",
    data: { name },
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
export const getCountStudent = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_COUNT_STUDENT,
    method: "get",
    headers: {
      "content-type": "Application/json",
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
export const getCatalogStudent = async (code) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CATALOG_STUDENT,
    method: "post",
    data: {
      school_level: code,
    },
    headers: {
      "content-type": "Application/json",
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

//Lấy thông tin biến động quỹ tiền mặt phục vụ báo cáo
export const getReportCashFund = async (token, where) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_REPORT_CASH_FUND,
    method: "post",
    data: { where },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
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

//Lấy danh sách mã giảm giá của một khoản thu
export const getExpectedRevenueDiscount = async (
  token,
  expected_revenue_id
) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_EXPECTED_REVENUE_DISCOUNT,
    method: "post",
    data: { expected_revenue_id },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy thông tin vé ăn của học sinh
export const getTicketStudent = async (token, where) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_TICKET,
    method: "post",
    data: { where },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy số tiền giảm trừ ngoài của 1 khoản thu
export const getExternalDeduction = async (token, expected_revenue_id) => {
  const res = await axios({
    url: process.env
      .NEXT_PUBLIC_HASURA_NEXT_PUBLIC_HASURA_GET_EXTERNAL_DEDUCTION,
    method: "post",
    data: { expected_revenue_id },
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

//Cập nhật định mức thu
export const updateTicket = async (token, updates) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_TICKET,
    method: "patch",
    data: { updates },
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

//Chỉnh sửa giảm giá
export const updateDiscount = async (id, token, changes) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_DISCOUNT,
    method: "put",
    data: {
      id: id,
      changes: changes,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Chỉnh sửa kì
export const updateBatch = async (token, updates) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_BATCH,
    method: "patch",
    data: {
      updates,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Chỉnh sửa thông tin người dùng
export const updateUser = async (id, token, changes) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_USERS,
    method: "put",
    data: {
      id: id,
      changes: changes,
    },
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

// Tạo quỹ tiền mặt
export const createCashFund = async (token, object) => {
  return await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_CASH_FUND,
    method: "post",
    data: { object },
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

//Tạo dự kiến thu vé ăn router handler
export const createTicketExpectedRevenueRouter = async (data) => {
  const res = await axios({
    url: "/api/ticket",
    method: "PUT",
    data,
  });

  return res;
};

//Tạo dự kiến thu vé ăn
// export const createTicketExpectedRevenue = async (token, objects, updates) => {
//   const res = await axios({
//     url: process.env.NEXT_PUBLIC_HASURA_CREATE_TICKET_EXPECTED_REVENUE,
//     method: "PUT",
//     data: {
//       objects,
//       updates,
//     },
//     headers: {
//       "content-type": "Application/json",
//       authorization: `Bearer ${token}`,
//     },
//   });

//   return res;
// };

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

//Tạo mới năm học
export const createSchoolYear = async (token, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_SCHOOL_YEAR,
    method: "put",
    data: {
      objects,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Thêm / sửa mã giảm giá cho khoản thu
export const createExpectedRevenueDiscount = async (
  token,
  id,
  discount,
  objects
) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPSERT_EXPECTED_REVENUE_DISCOUNT,
    method: "POST",
    data: {
      objects: objects,
      id: id,
      discount: discount,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Thêm / sửa mã giảm giá cho khoản thu bản 2
export const createExpectedRevenueDiscount2 = async (token, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPSERT_EXPECTED_REVENUE_DISCOUNT,
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

//Thêm mới số tiền giảm trừ ngoài
export const createExternalDeduction = async (token, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_EXTERNAL_DEDUCTION,
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
      hitsPerPage: 10000,
      page: pageParam ? pageParam : 1,
      filter: `year_active=true AND status_id IN [1,8] ${
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
export const meilisearchReportReceiptOneGet = async (token, data, fields) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_report_receipt_one/documents/fetch`,
    method: "post",
    data: {
      filter: data,
      fields,
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

//Lấy thông tin lịch sử thanh toán theo nhiều học sinh
export const meilisearchReportPaymentHistoryGet = async (token) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_payment_history/documents/fetch`,
    method: "post",
    data: {
      limit: 10000,
      offset: 0,
    },
    headers: {
      // "Content-Type": "application/json",
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

//Lấy thông tin lịch sử thanh toán theo nhiều học sinh
export const meilisearchReportPaymentHistoryOneGet = async (token, filter) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_payment_history_one/documents/fetch`,
    method: "post",
    data: {
      filter: filter,
      limit: 10000,
      offset: 0,
    },
    headers: {
      // "Content-Type": "application/json",
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
export const meilisearchReportRefundOneGet = async (token, data, fields) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_report_refund_one/documents/fetch`,
    method: "post",
    data: {
      fields,
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
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_student/documents/fetch`,
    method: "post",
    data: {
      filter: `code = ${student_code} AND year_active=true`,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${process.env.MEILISEARCH_SECRET_KEY}`,
    },
  });

  return res.data.results[0];
};

//Lấy thông tin kết chuyển công nợ
export const getUpgrade = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_UPGRADE,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy thông tin danh mục cấp, khối, lớp phục vụ tìm kiếm học sinh theo năm học
export const getListSearchSchoolYear = async (id) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_HASURA_GET_LIST_SEARCH_SCHOOL_YEAR}/${id}`,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Tiến hành lên lớp
export const upgradeAPI = async (data) => {
  const res = await axios({
    url: "/api/upgrade",
    method: "PUT",
    data,
  });

  return res;
};

export const upgrade = async (objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPGRADE,
    method: "PUT",
    data: {
      objects,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy thiết thông tin thiết lập hệ thống
export const getConfig = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CONFIG,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Cập nhật thiết lập hệ thống
export const updateConfig = async (_set, where, token) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_CONFIG,
    method: "put",
    data: {
      _set,
      where,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res;
};

//Lấy thông tin giấy báo đóng tiền
export const meilisearchNoticeGet = async (token, data) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_notice/documents/fetch`,
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

  return res.data.results.filter((item) =>
    item.expected_revenues.some((el) => el.next_batch_money > 0)
  );
};

//Lấy bảng kê hoàn trả tiền thừa
export const meilisearchListRefundGet = async (token, data) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_list_refund/documents/fetch`,
    method: "post",
    data: {
      filter: `batch_id = ${data.present.id} ${
        data.school ? `AND school_level_code= ${data.school.code}` : ""
      } ${
        data.class_level ? `AND class_level_code= ${data.class_level.code}` : ""
      } ${data.class ? `AND class_code= ${data.class.label}` : ""}`,
      limit: 10000,
      offset: 0,
    },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });

  return res.data.results.filter((item) =>
    item.expected_revenues.some((el) => el.next_batch_money < 0)
  );
};

//Lấy thông tin báo cáo ưu đãi giảm giá
export const meilisearchReductionGet = async (token, data) => {
  const res = await axios({
    url: `${process.env.NEXT_PUBLIC_MEILISEARCH_URL}/indexes/hns_qlthuchi_v_reduction/documents/fetch`,
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

//Thêm mới loại giảm giá
export const createDiscountType = async (token, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_DISCOUNT_TYPE,
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

//Lấy đơn giá 1 tháng BHYT
export const getInsuranceUnitPrice = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_INSURANCE_UNIT_PRICE,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Lấy danh sách luật tính số tháng BHYT
export const getInsuranceRules = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_INSURANCE_RULES,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Thêm đơn giá tháng BHYT
export const createInsuaranceUnitPrice = async (token, unit_price) => {
  // console.log(unit_price)
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_INSURANCE_UNIT_PRICE,
    method: "post",
    data: { unit_price },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

//Lấy danh mục khối lớp
export const getClassLevel = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CLASS_LEVEL,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });

  return res;
};

//Thêm luật BHYT
export const createInsuaranceRule = async (token, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_INSURANCE_RULE,
    method: "post",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Vô hiệu hoá luật BHYT
export const deleteInsuaranceRule = async (token, id) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_DELETE_INSURANCE_RULE,
    method: "patch",
    data: { id },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Huỷ vô hiệu hoá luật BHYT
export const reactivateInsuranceRule = async (token, id) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UN_DELETE_INSURANCE_RULE,
    method: "patch",
    data: { id },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Chỉnh sửa luật BHYT
export const updateInsuranceRule = async (token, id, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_UPDATE_INSURANCE_RULE,
    method: "put",
    data: { id, objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

//Lấy thông tin đơn vị
export const getSchool = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_SHOOL,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Lấy loại khoản thu chi
export const getRevenueTypes = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_REVENUE_TYPES,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Lấy khoản thu chi
export const getRevenue = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_REVENUE,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Lấy danh mục cấp
export const getSchoolLevel = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_SCHOOL_LEVEL,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Lấy danh mục lớp
export const getClasses = async () => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_GET_CLASSES,
    method: "get",
    headers: {
      "content-type": "Application/json",
    },
  });
  return res;
};

//Thêm lớp
export const createClass = async (token, objects) => {
  const res = await axios({
    url: process.env.NEXT_PUBLIC_HASURA_CREATE_CLASS,
    method: "post",
    data: { objects },
    headers: {
      "content-type": "Application/json",
      authorization: `Bearer ${token}`,
    },
  });
};
