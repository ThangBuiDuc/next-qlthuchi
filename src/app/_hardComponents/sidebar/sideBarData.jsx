import { IoSettingsOutline } from "react-icons/io5";
import { BiFile } from "react-icons/bi";
export const sideBarData = [
  // {
  //     id: 1,
  //     title: "Trang chủ",
  //     path: "/home",
  //     subNav : null
  // },
  //   {
  //     id: 1,
  //     icon: <IoSettingsOutline />,
  //     title: "Hệ thống",
  //     path: "",
  //     subNav: [
  //       {
  //         title: "Thông tin đơn vị",
  //         path: "",
  //       },
  //       {
  //         title: "Nhật ký người dùng",
  //         path: "",
  //       },
  //       {
  //         title: "Tạo người dùng",
  //         path: "",
  //       },
  //       {
  //         title: "Sửa thông tin người dùng",
  //         path: "",
  //       },
  //       {
  //         title: "Tạo nhóm người dùng",
  //         path: "",
  //       },
  //       {
  //         title: "Phân nhóm người dùng",
  //         path: "",
  //       },
  //     ],
  //   },
  {
    id: 2,
    title: "Hồ sơ",
    icon: <BiFile size={24}/>,
    path: "/resume",
    subNav: [
      {
        title: "Thêm học sinh mới",
        path: "/resume/add-student",
      },
      {
        title: "Cập nhật hồ sơ học sinh",
        path: "/resume/update-student",
      },
      {
        title: "Biến động học sinh",
        path: "/resume/dynamic-student",
      },
    ],
  },
];
