"use client";

import Select from "react-select";
import { listContext } from "../../content";
import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import LeftPanel from "./leftPanel";
import RightPanel from "./rightPanel";

const School = () => {
  const { listSearch, permission } = useContext(listContext);
  const [selected, setSelected] = useState();

  return (
    <>
      <div className="flex gap-1 items-center w-full">
        <h6>Cấp học: </h6>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearch.school_level
            .sort((a, b) => a.code - b.code)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
          classNames={{
            menu: () => "!z-[11]",
          }}
        />
      </div>
      {selected && (
        <div className="flex w-full divide-x divide-black h-full">
          {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
            <LeftPanel selected={selected} />
          )}
          <RightPanel selected={selected} />
        </div>
      )}
    </>
  );
};

export default School;
