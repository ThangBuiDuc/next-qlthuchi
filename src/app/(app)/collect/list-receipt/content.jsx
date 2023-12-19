"use client";
import { createContext, useState } from "react";
import Select from "react-select";

export const listContext = createContext();
const Content = ({ listSearch }) => {
  const [selected, setSelected] = useState({});
  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
        }}
      >
        <div className="flex flex-col  gap-[15px]">
          <div className="flex gap-1 justify-center items-center w-full">
            <h4 className="text-center">Bảng kê biên lai thu</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 auto-rows-auto">
            <Select
              placeholder="Hình thức thu"
              isMulti
              options={listSearch.formality.map((item) => ({
                ...item,
                value: item.id,
                label: item.name,
              }))}
              value={selected.formality}
              onChange={(e) => setSelected((pre) => ({ ...pre, formality: e }))}
            />
            <div className="flex col-span-2 gap-2 divide-x divide-black">
              <Select
                placeholder="Hình thức thu"
                isMulti
                options={listSearch.formality.map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.name,
                }))}
                value={selected.formality}
                onChange={(e) =>
                  setSelected((pre) => ({ ...pre, formality: e }))
                }
              />

              <Select
                placeholder="Hình thức thu"
                isMulti
                options={listSearch.formality.map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.name,
                }))}
                value={selected.formality}
                onChange={(e) =>
                  setSelected((pre) => ({ ...pre, formality: e }))
                }
              />
            </div>
          </div>
          {/* <SubContent student={student} selectPresent={selectPresent} /> */}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
