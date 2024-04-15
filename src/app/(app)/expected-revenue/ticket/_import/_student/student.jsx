"use client";
import StudentFilter from "@/app/_component/studentFilter";
import { listContext } from "../../content";
import { useContext, Fragment, useState, useEffect, useCallback } from "react";
import {
  meilisearchGetToken,
  meilisearchStudentSearch,
} from "@/utils/funtionApi";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { CiCircleMore } from "react-icons/ci";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { createTicketExpectedRevenueRouter } from "@/utils/funtionApi";
import moment from "moment";
import "moment/locale/vi";
import Link from "next/link";

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
            <>
              <Link
                className="tooltip cursor-pointer"
                data-tip="Nhập vé ăn"
                href={`ticket/${hit.code}`}
              >
                <CiCircleMore size={25} />
              </Link>
            </>
          )}
        </td>
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
        </div>
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
      </>
    )
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
