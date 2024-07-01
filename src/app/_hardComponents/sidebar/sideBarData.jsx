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
    path: "/system",
    subNav: [
      {
        title: "Người dùng",
        path: "/system/users",
      },
      {
        title: "Phân quyền người dùng",
        path: "/system/roles",
      },
      {
        title: "Kết chuyển công nợ",
        path: "/system/transfer",
      },
      {
        title: "Quỹ tiền mặt",
        path: "/system/cash-fund",
      },
      {
        title: "Năm học/ học kỳ",
        path: "/system/year-batch",
      },
    ],
  },

  {
    id: 2,
    title: "Danh mục",
    path: "/catalog",
    subNav: [
      // {
      //   title: "Đối tượng chính sách",
      //   path: "/catalog/policy-object",
      // },
      // {
      //   title: "Ưu đãi",
      //   path: "/catalog/voucher",
      // },
      {
        title: "Giảm giá",
        path: "/catalog/discounts",
      },
      {
        title: "Loại giảm giá",
        path: "/catalog/discount-types",
      },
      {
        title: "Quan hệ gia đình",
        path: "/catalog/relationship",
      },
      {
        title: "Tình trạng học tập",
        path: "/catalog/study-status",
      },
      {
        title: "Đơn vị hành chính",
        path: "/catalog/provinces",
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
      { title: "Vé ăn", path: "/expected-revenue/ticket" },
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
      { title: "Hoàn trả tiền thừa vé ăn", path: "/spend/refund-ticket" },
      { title: "Lập phiếu chi tiền mặt", path: "/spend/create-bill-refund" },
      {
        title: "Quản lý phiếu chi tiền mặt",
        path: "/spend/list-bill-refund",
      },
    ],
  },
  {
    id: 9,
    title: "Báo cáo/ Tổng hợp",
    path: "/report",
    subNav: [
      { title: "Quỹ tiền mặt", path: "/report/cash-fund" },
      {
        title: "Lịch sử thanh toán theo một học sinh",
        path: "/report/one-payment-history",
      },
      {
        title: "Lịch sử thanh toán theo nhiều học sinh",
        path: "/report/payment-history",
      },
      { title: "Công nợ theo một học sinh", path: "/report/one-debt" },
      { title: "Công nợ theo nhiều học sinh", path: "/report/debt" },
      {
        title: "Các khoản đã thu theo một học sinh",
        path: "/report/one-receipt",
      },
      {
        title: "Các khoản đã thu theo nhiều học sinh",
        path: "/report/total-receipt",
      },
      {
        title: "Các khoản đã hoàn trả theo một học sinh",
        path: "/report/one-refund",
      },
      {
        title: "Các khoản đã hoàn trả theo nhiều học sinh",
        path: "/report/total-refund",
      },
    ],
  },
];
