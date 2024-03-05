"use client";

import Link from "next/link";
// import Select from "react-select";
import { useContext, Fragment, useState } from "react";
import {
  meilisearchGetToken,
  meilisearchStudentSearch,
} from "@/utils/funtionApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { IoCreateOutline } from "react-icons/io5";
import { listContext } from "../content";
// import { useQueryClient } from "@tanstack/react-query";
// import { TbReload } from "react-icons/tb";
import StudentFilter from "@/app/_component/studentFilter";

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
      <StudentFilter
        selected={selected}
        setSelected={setSelected}
        listSearch={listSearch}
      />
      <Search queryObject={selected} />
    </div>
  );
};

export default Student;
