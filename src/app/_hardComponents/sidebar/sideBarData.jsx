import { IoSettingsOutline } from "react-icons/io5";
import { BiFile } from "react-icons/bi";
export const sideBarData = [
  // {
  //     id: 1,
  //     title: "Trang chủ",
  //     path: "/home",
  //     subNav : null
  // },
  {
    id: 1,
    title: "Hệ thống",
    path: "system",
    subNav: [
      {
        title: "Kết chuyển công nợ",
        path: "/system/transfer",
      },
    ],
  },
  {
    id: 2,
    title: "Danh mục",
    path: "/catalog",
    subNav: [
      // {
      //   title: "Khối",
      //   path: "catalog/class",
      // },
      {
        title: "Đối tượng chính sách",
        path: "/catalog/policy-object",
      },
      {
        title: "Ưu đãi",
        path: "/catalog/voucher",
      },
      {
        title: "Quan hệ gia đình",
        path: "/catalog/relationship",
      },
      {
        title: "Tình trạng học tập",
        path: "/catalog/study-status",
      },
    ],
  },
  {
    id: 3,
    title: "Hồ sơ học sinh",
    path: "/resume",
    subNav: [
      {
        title: "Thêm mới/ Cập nhật",
        path: "/resume/add-update-student",
      },
      {
        title: "Biến động học sinh",
        path: "/resume/dynamic-student",
      },
    ],
  },
  {
    id: 4,
    title: "Định mức thu",
    path: "/norm",
    subNav: [
      { title: "Lập định mức thu", path: "/norm/create" },
      { title: "Quản lý định mức thu", path: "/norm/manage" },
    ],
  },
  {
    id: 5,
    title: "Dự kiến thu",
    path: "/expected-revenue",
    subNav: [
      { title: "Lập dự kiến thu", path: "/expected-revenue/create" },
      { title: "Giảm giá", path: "/expected-revenue/voucher" },
      { title: "Quản lý dự kiến thu", path: "/expected-revenue/manage" },
    ],
  },

  {
    id: 7,
    title: "Thu",
    path: "/collect",
    subNav: [
      { title: "Lập biên lai thu", path: "/collect/create-receipt" },
      { title: "Quản lý biên lai thu", path: "/collect/list-receipt" },
      { title: "Lập phiếu thu tiền mặt", path: "/collect/create-bill-receipt" },
      {
        title: "Quản lý phiếu thu tiền mặt",
        path: "/collect/list-bill-receipt",
      },
    ],
  },
  {
    id: 8,
    title: "Chi",
    path: "/spend",
    subNav: [
      { title: "Hoàn trả tiền thừa", path: "/spend/refund" },
      { title: "Lập phiếu chi tiền mặt", path: "/spend/create-bill-refund" },
      {
        title: "Quản lý phiếu chi tiền mặt",
        path: "/spend/list-bill-refund",
      },
    ],
  },
];
