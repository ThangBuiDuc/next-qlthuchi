"use client";
import { useState } from "react";
import Select from "react-select";
import SubContent from "./subContent";

const Content = ({ student_code, student, schoolYear }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Tổng hợp công nợ theo một học sinh</h5>
      <div className={`justify-center items-center flex gap-1 `}>
        <h6>Học kỳ:</h6>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Học kỳ"
          options={schoolYear.result
            .map((item) => ({
              ...item,
              batchs: item.batchs.map((el) => ({
                ...el,
                school_year: item.school_year,
                value: el.id,
                label: `HK${el.batch} năm ${item.school_year}`,
              })),
            }))
            .reduce((total, curr) => [...total, ...curr.batchs], [])}
          value={selected}
          onChange={setSelected}
          className="text-black text-sm w-[220px]"
          classNames={{
            control: () => "!rounded-[5px]",
            input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
        />
      </div>
      {selected && (
        <SubContent
          selected={selected}
          student_code={student_code}
          student={student}
        />
      )}
    </div>
  );
};

export default Content;
