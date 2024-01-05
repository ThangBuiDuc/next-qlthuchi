"use client";
import Link from "next/link";
import { useContext, Fragment, useState, useEffect, useMemo } from "react";
import { meilisearchGetToken, meilisearchSearch } from "@/utils/funtionApi";
import Select from "react-select";
import Datepicker from "react-tailwindcss-datepicker";
import { createContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
import { CiCircleMore } from "react-icons/ci";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export const listContext = createContext();

const namehoc = [
  {
    value: 1,
    label: "2023-2024",
  },
  {
    value: 2,
    label: "2024-2025",
  },
  {
    value: 3,
    label: "2025-2026",
  },
];

const kyhoc = [
  {
    value: 1,
    label: "Kỳ 1",
  },
  {
    value: 2,
    label: "Kỳ 2",
  },
  {
    value: 3,
    label: "Cả 2",
  },
];

function Filter() {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const queryClient = useQueryClient();
  const { listSearch } = useContext(listContext);
  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
    query: "",
  });

  return (
    <div className="flex flex-col items-center w-full h-1/3">
      <p>Bộ lọc</p>
      <div className="">
        <div>
          <Select
            placeholder="Năm học"
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={namehoc}
          />
          <Select
            placeholder="Kỳ học"
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={kyhoc}
          />
          <Datepicker
            i18n="vi"
            inputClassName="w-full border-solid border-slate-200 border-2 rounded-md focus:ring-0 p-[10px]"
            // toggleClassName="absolute bg-blue-300 rounded-md text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            useRange={true}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            displayFormat={"DD-MM-YYYY"}
          />
        </div>

        {/* ========================================================================== */}

        <div className="flex flex-col gap-3">
          <h5>Tìm kiếm học sinh:</h5>
          <div className="grid grid-cols-2 auto-rows-auto gap-2">
            <div className="">
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

              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Khối lớp!"
                isClearable
                options={
                  selected.school
                    ? listSearch.class_level
                        .filter(
                          (item) =>
                            item.school_level_id === selected.school.value
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
                      setSelected((pre) => ({
                        ...pre,
                        class_level: e,
                        class: null,
                      }))
                    : setSelected((pre) => ({
                        ...pre,
                        class_level: null,
                        class: null,
                      }))
                }
                className="text-black w-full"
              />

              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Lớp!"
                isClearable
                options={
                  selected.class_level
                    ? listSearch.classes
                        .filter(
                          (item) =>
                            item.class_level_id === selected.class_level.value
                        )
                        .sort((a, b) => a.class_level_id - b.class_level_id)
                        .map((item) => ({
                          ...item,
                          value: item.id,
                          label: item.name,
                        }))
                    : listSearch.classes
                        .sort((a, b) => a.class_level_id - b.class_level_id)
                        .map((item) => ({
                          ...item,
                          value: item.id,
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

              <div className={`w-full relative col-span-2`}>
                <input
                  autoComplete="off"
                  type={"text"}
                  id={`query`}
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                  placeholder="Tìm kiếm"
                  value={selected.query}
                  onChange={(e) => {
                    setSelected((pre) => ({ ...pre, query: e.target.value }));
                  }}
                />
                <label
                  htmlFor={`query`}
                  className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                >
                  Tìm kiếm
                </label>
              </div>
              <div
                className="tooltip items-center flex cursor-pointer w-fit"
                data-tip="Tải lại danh sách tìm kiếm"
                onClick={() =>
                  queryClient.invalidateQueries({
                    queryKey: ["search", selected],
                  })
                }
              >
                <TbReload size={30} />
              </div>
            </div>
            <Search queryObject={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}

const HitItem = ({ hit, isRefetching }) => {
  return (
    <>
      <tr className="hover">
        <td
          // className="w-[20%] self-center"
          dangerouslySetInnerHTML={{ __html: hit._formatted.code }}
        />
        <td
          // className="w-[40%] self-center"
          dangerouslySetInnerHTML={{
            __html: `${hit._formatted.first_name} ${hit._formatted.last_name}`,
          }}
        />
        <td
          // className="w-[20%] self-center"
          dangerouslySetInnerHTML={{ __html: hit._formatted.class_name }}
        />
        {/* <td className="self-center">
          {isRefetching ? (
            <span className="loading loading-spinner loading-md self-center"></span>
          ) : (
            <>
              <div className="tooltip" data-tip="Chi tiết">
                <Link href={`create-receipt/${hit.code}`}>
                  <CiCircleMore size={25} />
                </Link>
              </div>
            </>
          )}
        </td> */}
      </tr>
    </>
  );
};

const Search = ({ queryObject }) => {
  const [result, setResult] = useState();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [`search`, queryObject],
    queryFn: async ({ pageParam = 1 }) =>
      meilisearchSearch(queryObject, await meilisearchGetToken(), pageParam),
    getNextPageParam: (res) => {
      if (res.page < res.totalPages) return res.page + 1;
      else return undefined;
    },
  });

  useEffect(() => {
    if (Array.isArray(data?.pages))
      setResult(
        data?.pages
          .reduce((total, curr) => [...total, ...curr.hits], [])
          .map((item) => ({ ...item, isOpen: false }))
      );
  }, [data]);

  return status === "loading" ? (
    <span className="loading loading-spinner loading-lg self-center"></span>
  ) : status === "error" ? (
    <p className="self-center">Error: {error.message}</p>
  ) : (
    result && (
      <>
        <div className="overflow-y-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                {/* <th></th> */}
                <th>Mã học sinh</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {result.length === 0 ? (
                <tr>
                  <td colSpan={4} className=" text-center">
                    Không tìm thấy kết quả
                  </td>
                </tr>
              ) : (
                result.map((el) => (
                  <Fragment key={el.code}>
                    <HitItem
                      hit={el}
                      isRefetching={isRefetching}
                      setResult={setResult}
                    />
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-center">
            <button
              className="btn"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : hasNextPage ? (
                "Xem thêm"
              ) : (
                "Đã hết kết quả tìm kiếm!"
              )}
            </button>
          </div>
        </div>
      </>
    )
  );
};

const Content = ({ listSearch }) => {
  return (
    <listContext.Provider value={{ listSearch }}>
      <div className="flex flex-col items-center gap-[20px]">
        <h4>Lịch sử thanh toán theo học sinh</h4>
        <Filter />
      </div>
    </listContext.Provider>
  );
};

export default Content;
