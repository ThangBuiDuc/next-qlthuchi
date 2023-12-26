"use client";
import { createContext, useState } from "react";
import Select from "react-select";
import Main from "./_filter/main";

export const listContext = createContext();
const Content = ({ listSearch, preReceipt }) => {
  const [selected, setSelected] = useState({});
  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
          selected,
          preReceipt,
        }}
      >
        <div className="flex flex-col  gap-3">
          <div className="flex gap-1 justify-center items-center w-full">
            <h4 className="text-center">Bảng kê biên lai thu</h4>
          </div>
          <div className="flex flex-col w-full border-opacity-50">
            <div className="grid grid-cols-2 gap-2 auto-rows-auto">
              <Select
                placeholder="Hình thức thu"
                isMulti
                // isDisabled
                options={[
                  ...listSearch.formality.map((item) =>
                    selected.formality?.some((item) => item.value === "all")
                      ? {
                          value: item.id,
                          label: item.name,
                          isDisabled: true,
                        }
                      : {
                          value: item.id,
                          label: item.name,
                        }
                  ),
                  { value: "all", label: "Chọn tất cả" },
                ]}
                value={selected.formality}
                onChange={(e) => {
                  JSON.stringify(e) ===
                    JSON.stringify(
                      listSearch.formality.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))
                    ) || e.some((item) => item.value === "all")
                    ? setSelected((pre) => ({
                        ...pre,
                        formality: [{ label: "Chọn tất cả", value: "all" }],
                      }))
                    : setSelected((pre) => ({ ...pre, formality: e }));
                }}
              />
              <Select
                placeholder="Người thu"
                isMulti
                options={[
                  ...listSearch.users.map((item) =>
                    selected.formality?.some((item) => item.value === "all")
                      ? {
                          ...item,
                          isDisabled: true,
                          value: item.clerk_user_id,
                          label: `${item.first_name} ${item.last_name}`,
                        }
                      : {
                          ...item,
                          value: item.clerk_user_id,
                          label: `${item.first_name} ${item.last_name}`,
                        }
                  ),
                  { value: "all", label: "Chọn tất cả" },
                ]}
                value={selected.users}
                onChange={(e) =>
                  JSON.stringify(e) ===
                    JSON.stringify(
                      listSearch.users.map((item) => ({
                        ...item,
                        value: item.clerk_user_id,
                        label: `${item.first_name} ${item.last_name}`,
                      }))
                    ) || e.some((item) => item.value === "all")
                    ? setSelected((pre) => ({
                        ...pre,
                        users: [{ label: "Chọn tất cả", value: "all" }],
                      }))
                    : setSelected((pre) => ({ ...pre, users: e }))
                }
              />
            </div>
            <div className="divider">Và</div>
          </div>
          {selected?.formality?.length > 0 && <Main selected={selected} />}
          {/* <SubContent student={student} selectPresent={selectPresent} /> */}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
