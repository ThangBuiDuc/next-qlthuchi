"use client";
import { IoMdAddCircleOutline } from "react-icons/io";
import Add from "./add";
import { Fragment } from "react";
import Item from "./item";

const rawData = [
  {
    id: 1,
    description: "Đang học",
  },
  {
    id: 2,
    description: "Tạm dừng học",
  },
  {
    id: 3,
    description: "Thôi học",
  },
];

const Content = ({ permission }) => {
  return (
    <div className="flex flex-col gap-[30px] p-[10px]">
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
        <>
          <button
            className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
            onClick={() => document.getElementById("modal_add").showModal()}
          >
            <IoMdAddCircleOutline size={20} />
            Thêm mới
          </button>
          <Add />
        </>
      )}

      {/* <div className="grid grid-cols-2 gap-[20px]">
        {rawData.map((item) => (
          <Item data={item} />
        ))}
      </div> */}
      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th></th>
              <th>Mã</th>
              <th>Tình trạng</th>
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
