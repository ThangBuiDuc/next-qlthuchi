"use client";
import Select from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import { TbReload } from "react-icons/tb";
const StudentFilter = ({ selected, setSelected, listSearch }) => {
  const queryClient = useQueryClient();
  return (
    <div className="grid grid-cols-3 auto-rows-auto gap-2 justify-center items-center">
      <div className={`w-full flex flex-col gap-1`}>
        <p className="text-xs">Cấp học:</p>
        <Select
          isClearable
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Cấp học!"
          classNames={{
            // control: () => "!rounded-[5px]",
            // input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            // valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
          options={listSearch.school_level
            .sort((a, b) => a.code - b.code)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected.school}
          onChange={(e) =>
            e
              ? e.value !== selected.school?.value &&
                setSelected((pre) => ({
                  ...pre,
                  school: e,
                  class_level: null,
                  class: null,
                }))
              : setSelected((pre) => ({
                  ...pre,
                  school: null,
                  class_level: null,
                  class: null,
                }))
          }
          className="text-black w-full"
        />
      </div>

      <div className={`w-full flex flex-col gap-1`}>
        <p className="text-xs">Khối lớp:</p>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Khối lớp!"
          isClearable
          options={
            selected.school
              ? listSearch.class_level
                  .filter(
                    (item) => item.school_level_code === selected.school.value
                  )
                  .sort((a, b) => a.code - b.code)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
              : listSearch.class_level
                  .sort((a, b) => a.code - b.code)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
          }
          value={selected.class_level}
          onChange={(e) =>
            e
              ? e.value !== selected.class_level?.value &&
                setSelected((pre) => ({ ...pre, class_level: e, class: null }))
              : setSelected((pre) => ({
                  ...pre,
                  class_level: null,
                  class: null,
                }))
          }
          className="text-black w-full"
        />
      </div>

      <div className={`w-full flex flex-col gap-1`}>
        <p className="text-xs">Lớp:</p>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Lớp!"
          isClearable
          options={
            selected.class_level
              ? listSearch.classes
                  .filter(
                    (item) =>
                      item.class_level_code === selected.class_level.value
                  )
                  .sort((a, b) => a.class_level_code - b.class_level_code)
                  .map((item) => ({
                    ...item,
                    value: item.code,
                    label: item.name,
                  }))
              : listSearch.classes
                  .sort((a, b) => a.class_level_code - b.class_level_code)
                  .map((item) => ({
                    ...item,
                    value: item.code,
                    label: item.name,
                  }))
          }
          value={selected.class}
          onChange={(e) =>
            e
              ? e.value !== selected.class?.value &&
                setSelected((pre) => ({ ...pre, class: e }))
              : setSelected((pre) => ({ ...pre, class: null }))
          }
          className="text-black w-full"
        />
      </div>

      <div className={`w-full flex flex-col gap-1 col-span-2`}>
        <p className="text-xs">Thông tin tìm kiếm:</p>
        <input
          autoComplete="off"
          type={"text"}
          id={`query`}
          className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
          placeholder="Thông tin tìm kiếm"
          value={selected.query}
          onChange={(e) => {
            setSelected((pre) => ({ ...pre, query: e.target.value }));
          }}
        />
      </div>
      <div
        className="tooltip  flex cursor-pointer  w-fit h-full items-end"
        data-tip="Tải lại danh sách tìm kiếm"
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: ["search", selected] })
        }
      >
        <TbReload size={45} />
      </div>
    </div>
  );
};

export default StudentFilter;
