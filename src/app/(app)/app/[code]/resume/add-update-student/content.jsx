"use client";
import { useState, Fragment } from "react";
import Add from "./add";
import { GoPersonAdd } from "react-icons/go";
import TextInput from "@/app/component/textInput";
import Update from "./update";

const rawData = [
  {
    isEddit: false,
    code: "123",
    class: "1A1",
    first_name: "Bùi Đức",
    last_name: "Thắng",
    parents: [
      {
        first_name: "",
        last_name: "",
        relation: "",
        phoneNumber: "",
      },
    ],
  },
  {
    isEddit: false,
    code: "1234",
    class: "1A1",
    first_name: "Bùi Đức",
    last_name: "Thắng",
    parents: [],
  },
];

const Content = ({ catalogStudent, code }) => {
  const [query, setQuery] = useState("");
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
      <Add catalogStudent={catalogStudent} code={code} />
      <form className="flex flex-row justify-around">
        <TextInput
          className={"!w-[70%]"}
          label={"Tìm kiếm bằng mã sinh viên"}
          value={query}
          id={"query"}
          action={setQuery}
        />
        <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
          Tìm kiếm
        </button>
      </form>
      <div className="flex flex-col p-[20px]">
        {data.map((item) => (
          <Fragment key={item.code}>
            <Update data={item} setData={setData} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Content;
