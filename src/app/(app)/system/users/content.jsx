"use client";
import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
import TextInput from "@/app/component/textInput";
import Add from "./add";

const Content = ({provinces, districts, jwt}) => {
  
  const [query, setQuery] = useState("");


  
  return (
    <div className="flex flex-col gap-[30px]">
      <button
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
        onClick={() => document.getElementById("modal_add").showModal()}
      >
        <GoPersonAdd size={20} />
        Thêm mới
      </button>
      <Add provinces={provinces} districts={districts} jwt={jwt}/>
      <form className="flex flex-row justify-around">
        <TextInput
          className={"!w-[70%]"}
          label={"Tìm kiếm người dùng"}
          value={query}
          id={"query"}
          action={setQuery}
        />
        <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

export default Content;
