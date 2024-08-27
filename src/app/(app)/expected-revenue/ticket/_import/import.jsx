"use client";
import { useState } from "react";
import Select from "react-select";
import Class from "./_class/class";
import Student from "./_student/student";
const options = [
  {
    value: 1,
    label: "Lớp học",
  },
  {
    value: 2,
    label: "Học sinh",
  },
];

const Import = () => {
  const [selected, setSelected] = useState(null);
  return (
    <>
      {/* <div className="flex gap-1 items-center w-full justify-center">
        <h6>Lập dự kiến vé ăn cho tháng {moment().month() + 2}</h6>
      </div> */}
      <div className="flex gap-1 items-center w-full">
        <h6>Nhập vé ăn theo: </h6>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={options}
          value={selected}
          onChange={setSelected}
          className="text-black w-[30%]"
          classNames={{
            menu: () => "!z-[11]",
          }}
        />
      </div>
      {selected?.value === 1 && <Class />}
      {selected?.value === 2 && <Student />}
    </>
  );
};

export default Import;
