"use client";
import { listContext } from "../content";
import { useState, useContext } from "react";
import Select from "react-select";
import Batch from "./batch";

const filter = [
  { value: 1, label: "Năm học - Học kỳ" },
  {
    value: 2,
    label: "Năm dương lịch",
  },
  { value: 3, label: "Khoảng thời gian" },
  { value: 4, label: "Số biên lai" },
  { value: 5, label: "Cấp - Khối - Lớp - HS" },
];

const Main = ({ selected }) => {
  const [filtered, setFiltered] = useState();
  return (
    <div className="flex flex-col gap-3">
      <Select
        placeholder="Điều kiện lọc"
        options={filter}
        value={filtered}
        onChange={(e) => (e.value !== filtered?.value) & setFiltered(e)}
      />
      {/* <div className="grid grid-cols-4 auto-rows-auto"> */}
      {filtered?.value === 1 && <Batch />}
      {/* </div> */}
    </div>
  );
};

export default Main;
