"use client";
import React, { useState } from "react";
import Add from "./add";
import { GoPersonAdd } from "react-icons/go";
import TextInput from "@/app/component/textInput";

const Content = () => {
  const [code, setCode] = useState("");
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
      <form className="flex flex-row justify-around">
        <TextInput
          className={"!w-[70%]"}
          label={"Tìm kiếm bằng mã sinh viên"}
          value={code}
          action={setCode}
        />
        <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

export default Content;
