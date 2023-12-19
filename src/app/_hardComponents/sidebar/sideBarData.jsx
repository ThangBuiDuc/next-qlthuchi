import { IoSettingsOutline } from "react-icons/io5";
import { BiFile } from "react-icons/bi";
export const sideBarData = [
  // {
  //     id: 1,
  //     title: "Trang chủ",
  //     path: "/home",
  //     subNav : null
  // },
  // {
  //   id: 1,
  //   title: "Hệ thống",
  //   path: "system",
  //   subNav: [
  //     {
  //       title: "Thông tin đơn vị",
  //       path: "system/create-user",
  //     },
  //     {
  //       title: "Thông tin đơn vị",
  //       path: "system/unit-infomation",
  //     },
  //           {
  //             title: "Nhật ký người dùng",
  //             path: "",
  //           },
  //           {
  //             title: "Tạo người dùng",
  //             path: "",
  //           },
  //           {
  //             title: "Sửa thông tin người dùng",
  //             path: "",
  //           },
  //           {
  //             title: "Tạo nhóm người dùng",
  //             path: "",
  //           },
  //           {
  //             title: "Phân nhóm người dùng",
  //             path: "",
  //           },
  //   ],
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
    id: 6,
    title: "Thu",
    path: "/collect",
    subNav: [{ title: "Lập biên lai thu", path: "/collect/create-receipt" }],
  },
  {
    id: 7,
    title: "Tổng hợp",
    path: "/report",
    subNav: [{ title: "Báo cáo quỹ tiền mặt", path: "/report/cash-fund" }],
  },
];
