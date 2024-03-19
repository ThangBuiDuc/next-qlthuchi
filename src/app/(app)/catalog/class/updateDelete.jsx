"use client";
import { BiEdit, BiMessageAltAdd } from "react-icons/bi";
// import { MdDeleteForever } from "react-icons/md";

const UpdateDelete = ({ data, setData }) => {
  return (
    <>
      <div key={data.level_id} className="flex">
        <p className="w-[20%]">{data.level_id}</p>
        <p className="w-[60%]">{data.title}</p>
        <span className="w-[20%] flex justify-end"><BiEdit size={30} className="text-black cursor-pointer" /></span>
        {/* <span className="w-[10%] flex justify-end"><MdDeleteForever size={30} className="text-black cursor-pointer" /></span> */}
      </div>
      
    </>
  );
};

export default UpdateDelete;
