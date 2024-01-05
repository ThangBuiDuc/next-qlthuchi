"use client";

import Link from "next/link";
import Select from "react-select";
import { useContext, Fragment, useState } from "react";
import {
  meilisearchGetToken,
  meilisearchStudentSearch,
} from "@/utils/funtionApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { IoCreateOutline } from "react-icons/io5";
import { listContext } from "../content";
import { useQueryClient } from "@tanstack/react-query";
import { TbReload } from "react-icons/tb";

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
        <td className="self-center">
          {isRefetching ? (
            <span className="loading loading-spinner loading-md self-center"></span>
          ) : (
            <Link href={`create/${hit.code}`}>
              <div className="tooltip" data-tip="Lập định mức">
                <IoCreateOutline size={35} />
              </div>
            </Link>
          )}
        </td>
      </tr>
    </>
  );
};

const Search = ({ queryObject }) => {
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
      meilisearchStudentSearch(
        queryObject,
        await meilisearchGetToken(),
        pageParam
      ),
    getNextPageParam: (res) => {
      if (res.page < res.totalPages) return res.page + 1;
      else return undefined;
    },
  });

  // toast.success("Tạo mới định mức thu cho cấp học thành công!", {
  //   position: "top-center",
  //   autoClose: 2000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   theme: "light",
  // });

  return status === "loading" ? (
    <span className="loading loading-spinner loading-lg self-center"></span>
  ) : status === "error" ? (
    <p className="self-center">Error: {error.message}</p>
  ) : (
    // <div className="flex flex-col gap-[10px] w-full">
    //   {data.pages[0].hits.length === 0 ? (
    //     <h5 className="text-center">Không tìm thấy kết quả</h5>
    //   ) : (
    //     <>
    //       <div className="flex flex-col">
    //         <div className="flex gap-3">
    //           <p className="font-semibold w-[20%]">Mã học sinh</p>
    //           <p className="font-semibold w-[40%]">Họ tên</p>
    //           <p className="font-semibold w-[20%]">Lớp</p>
    //         </div>
    //         {data.pages.map((item, index) => {
    //           return (
    //             <Fragment key={index}>
    //               {item.hits.map((el) => (
    //                 <Fragment key={el._ab_pk}>
    //                   <HitItem hit={el} isRefetching={isRefetching} />
    //                 </Fragment>
    //               ))}
    //             </Fragment>
    //           );
    //         })}
    //       </div>

    //       <div className="flex justify-center">
    //         <button
    //           className="btn"
    //           onClick={() => fetchNextPage()}
    //           disabled={!hasNextPage || isFetchingNextPage}
    //         >
    //           {isFetchingNextPage ? (
    //             <span className="loading loading-spinner loading-lg"></span>
    //           ) : hasNextPage ? (
    //             "Xem thêm"
    //           ) : (
    //             "Đã hết kết quả tìm kiếm!"
    //           )}
    //         </button>
    //       </div>
    //     </>
    //   )}
    //   {/* <div className="flex justify-center">
    //     {isFetching && !isFetchingNextPage ? (
    //       <span className="loading loading-infinity loading-lg"></span>
    //     ) : null}
    //   </div> */}
    // </div>
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              {/* <th></th> */}
              <th>Mã học sinh</th>
              <th>Họ tên</th>
              <th>Lớp</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.pages[0].hits.length === 0 ? (
              <tr>
                <td colSpan={4} className=" text-center">
                  Không tìm thấy kết quả
                </td>
              </tr>
            ) : (
              data.pages.map((item, index) => {
                return (
                  <Fragment key={index}>
                    {item.hits.map((el) => (
                      <Fragment key={el.code}>
                        <HitItem hit={el} isRefetching={isRefetching} />
                      </Fragment>
                    ))}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center pb-1">
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
    </>
  );
};

const Student = () => {
  const queryClient = useQueryClient();
  const { listSearch } = useContext(listContext);
  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
    query: "",
  });

  return (
    <div className="flex flex-col gap-3">
      <h6>Tìm kiếm học sinh:</h6>
      <div className="grid grid-cols-3 auto-rows-auto gap-2">
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Cấp học!"
          isClearable
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
                    (item) => item.school_level_code === selected.school.code
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

        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Lớp!"
          isClearable
          options={
            selected.class_level
              ? listSearch.classes
                  .filter(
                    (item) =>
                      item.class_level_code === selected.class_level.code
                  )
                  .sort((a, b) => a.class_level_code - b.class_level_code)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
              : selected.school
              ? listSearch.classes
                  .filter(
                    (item) => item.school_level_code === selected.school.code
                  )
                  .sort((a, b) => a.class_level_code - b.class_level_code)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
              : listSearch.classes
                  .sort((a, b) => a.class_level_code - b.class_level_code)
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
            queryClient.invalidateQueries({ queryKey: ["search", selected] })
          }
        >
          <TbReload size={30} />
        </div>

        {/* <button className="btn w-fit">Tìm kiếm</button> */}
      </div>
      <Search queryObject={selected} />
    </div>
  );
};

export default Student;
