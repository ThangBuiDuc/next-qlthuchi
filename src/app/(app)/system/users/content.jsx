"use client";
import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
import TextInput from "@/app/_component/textInput";
import Add from "./add";
import Update from "./update";

// import { motion } from "framer-motion";

const Content = ({ provinces, districts, usersData, jwt }) => {
  const [query, setQuery] = useState("");
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[30px]">
      <label
        htmlFor={`modal_add`}
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
      >
        <GoPersonAdd size={20} />
        Thêm mới
      </label>
      <Add provinces={provinces} districts={districts} jwt={jwt} />
      <form className="flex flex-row justify-around mt-[10px] p-[20px]">
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
      {/* {usersData ? (
        usersData.result.map((item) => <Update key={item.id} data={item} />)
      ) : (
        <></>
      )} */}
      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Địa chỉ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usersData.result.map((item, index) => (
              <Fragment key={item.id}>
                <Update data={item} index={index} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
