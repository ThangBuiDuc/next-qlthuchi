"use client";
import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "moment/locale/vi";
import { CiCircleMore } from "react-icons/ci";
import StudentFilter from "@/app/_component/studentFilter";
import Search from "@/app/_component/tableStudent";
import { listContext } from "../content";

const Student = () => {
  const { listSearch, config } = useContext(listContext);
  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
    query: "",
  });

  return (
    <div className="flex flex-col gap-3">
      <h5>Tìm kiếm học sinh:</h5>
      <StudentFilter
        selected={selected}
        setSelected={setSelected}
        listSearch={listSearch}
      />
      <Search
        queryObject={selected}
        config={config}
        dataTip={"Chi tiết"}
        redirect={"create-bill-refund"}
      >
        <CiCircleMore size={25} />
      </Search>
    </div>
  );
};

export default Student;
