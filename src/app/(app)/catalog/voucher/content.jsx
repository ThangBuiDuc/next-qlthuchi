"use client";
import { IoMdAddCircleOutline } from "react-icons/io";
import Add from "./add";
import Item from "./Item";
import { Fragment } from "react";

const rawData = [
  {
    id: 1,
    code: "GCS1",
    description: "Con của liệt sĩ",
    percent: 0.5,
    start_date: "23/10/2023",
    end_date: "23/10/2023",
  },
  {
    id: 2,
    code: "GCS2",
    description:
      "Con của thương, bệnh binh (không phân biệt bậc thương, bệnh binh)",
    percent: 0.25,
    start_date: "23/10/2023",
    end_date: "23/10/2023",
  },
  {
    id: 3,
    code: "GCS3",
    description:
      "Con của thương, bệnh binh (không phân biệt bậc thương, bệnh binh)",
    percent: 0.5,
    start_date: "23/10/2023",
    end_date: "23/10/2023",
  },
  {
    id: 4,
    code: "GCS4",
    description:
      "Con của giáo viên cơ hữu, chuyên viên và nhân viên làm việc theo hợp đồng trọn thời gian trong hệ thống trường Hữu Nghị Quốc Tế, Trường Đại học Quản lý và Công nghệ Hải Phòng",
    percent: 0.25,
    start_date: "23/10/2023",
    end_date: "23/10/2023",
  },
  {
    id: 5,
    code: "GCS5",
    description:
      "Cháu nội (ngoại) của giáo viên cơ hữu, chuyên viên và nhân viên làm việc theo hợp đồng trọn thời gian trong hệ thống trường Hữu Nghị Quốc Tế, Trường Đại học Quản lý và Công nghệ Hải Phòng",
    percent: 0.15,
    start_date: "23/10/2023",
    end_date: "23/10/2023",
  },
  {
    id: 6,
    code: "GCS6",
    description:
      "Con của cựu sinh viên, học viên Trường Đại học Quản lý và Công nghệ Hải Phòng",
    percent: 0.05,
    start_date: "23/10/2023",
    end_date: "23/10/2023",
  },
  {
    id: 7,
    code: "GCS7",
    description:
      "Trường hợp có nhiều con đang học trong hệ thống trường Hữu Nghị Quốc Tế thì mỗi con được giảm",
    percent: 0.05,
    start_date: "23/10/2023",
    end_date: "23/10/2023",
  },
];

const Content = () => {
  return (
    <div className="flex flex-col gap-[30px] p-[10px]">
      <button
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
        onClick={() => document.getElementById("modal_add").showModal()}
      >
        <IoMdAddCircleOutline size={20} />
        Thêm mới
      </button>
      <Add />
      <div className="overflow-x-auto">
        <table className="table table-pin-rows table-lg">
          <thead>
            <tr>
              <th></th>
              <th>Mã</th>
              <th>Tên</th>
              <th>Tỉ lệ giảm</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
            </tr>
          </thead>
          <tbody>
            {rawData.map((item, index) => (
              <Fragment key={item.id}>
                <Item data={item} index={index} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
