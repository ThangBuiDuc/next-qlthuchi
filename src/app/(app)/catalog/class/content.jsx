"use client";
import { Fragment , useState} from "react";
import Add from "./add";
import { GoPersonAdd } from "react-icons/go";
import UpdateDelete from "./updateDelete";


const rawData = [
  {
    level_id: "1",
    title: "Mầm non",
  },
  {
    level_id: "2",
    title: "Tiểu học",
  },
  {
    level_id: "3",
    title: "Trung học cơ sở",
  },
  {
    level_id: "4",
    title: "Trung học phổ thông",
  },
];

const Content = () => {


  const [data, setData] = useState(rawData);
  return (
    <div className="flex flex-col gap-[30px]">
      <button
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
        onClick={() => document.getElementById("modal_add").showModal()}
      >
        <GoPersonAdd size={20} />
        Thêm mới
      </button>
      <Add />
      <div className="flex flex-col p-[20px] self-center w-1/2">
        <div className="flex">
          <p className="w-[20%]">Mã cấp</p>
          <p className="w-[80%]">Tên cấp</p>
        </div>
        {data.map((item) => (
          <Fragment key={item.level_id}>
            <UpdateDelete data={item} setData={setData}/>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Content;
