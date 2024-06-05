"use client";
import Link from "next/link";
import Add from "./add";
import AddExcel from "./addExcel";
import { GoPersonAdd } from "react-icons/go";
import { Fragment, useState, useEffect } from "react";
import { CiCircleMore } from "react-icons/ci";
import {
  meilisearchGetToken,
  meilisearchStudentSearch,
} from "@/utils/funtionApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CiImport } from "react-icons/ci";
import "react-toastify/dist/ReactToastify.css";
import StudentFilter from "@/app/_component/studentFilter";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSubscription, gql } from "@apollo/client";
import { CiExport } from "react-icons/ci";

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
              <div className="tooltip" data-tip="Cập nhật">
                <Link href={`add-update-student/${hit.code}`}>
                  <CiCircleMore size={25} />
                </Link>
              </div>
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

const Content = (props) => {
  // const countStudent = useQuery({
  //   queryKey: ["count_student"],
  //   queryFn: async () => getCountStudent(),
  //   initialData: () => ({
  //     data: props.countStudent,
  //   }),
  // });

  // console.log(countStudent.data);

  const countStudent = useSubscription(
    gql`
      subscription MySubscription {
        result: count_student {
          count
          school_level_code
        }
      }
    `
  );

  // if (data) console.log(data);

  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
    code: "",
  });

  const handleExcelClick = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Danh sach hoc sinh", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet.addRow([
      "MaBoGiaoDuc",
      "Lop",
      "MaLop",
      "HoDem",
      "Ten",
      "NgaySinh",
      "MaGioiTinh",
      "NgayNhapHoc",
      "MaTrangThai",
      "DiaChi",
    ]);

    for (let i = 1; i <= sheet.columnCount; i++) {
      sheet.getColumn(i).numFmt = "@";
    }

    // sheet.getCell('F1').note('Đổi định dạng cột sang TEXT trước khi nhập!!')
    // sheet.getCell('H1').note('Đổi định dạng cột sang TEXT trước khi nhập!!')

    const sheet1 = workbook.addWorksheet("Danh muc lop hoc", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet1.addRow(["lớp học"]);

    props.catalogStudent.classes.forEach((item) => sheet1.addRow([item.name]));

    const sheet2 = workbook.addWorksheet("Danh muc gioi tinh", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet2.addRow(["Mã", "Giới tính"]);

    props.catalogStudent.gender.forEach((item) =>
      sheet2.addRow([item.id, item.description])
    );

    const sheet3 = workbook.addWorksheet("Danh muc trang thai", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet3.addRow(["Mã", "Trạng thái"]);

    props.catalogStudent.status.forEach((item) =>
      sheet3.addRow([item.id, item.name])
    );

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "danh-sach-hoc-sinh.xlsx");
  };

  // if (countStudent.error)
  //   throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <>
      <div className="flex flex-col gap-[30px]">
        <div className="flex justify-start gap-2">
          {props.permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
            countStudent.loading ? (
              <div>loading...</div>
            ) : (
              <>
                <button
                  className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                  onClick={() =>
                    document.getElementById("modal_add").showModal()
                  }
                >
                  <GoPersonAdd size={20} />
                  Thêm mới
                </button>
                <button
                  className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                  onClick={() =>
                    document.getElementById("modal_add_excel").showModal()
                  }
                >
                  <CiImport size={20} />
                  Nhập Excel
                </button>
                <button
                  className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                  onClick={() => handleExcelClick()}
                >
                  <CiExport size={20} />
                  Xuất File mẫu
                </button>
              </>
            )
          ) : (
            <></>
          )}
        </div>
        {countStudent.data && (
          <>
            <Add
              catalogStudent={props.catalogStudent}
              countStudent={countStudent.data}
              present={props.present}
              queryObject={selected}
            />
            <AddExcel
              catalogStudent={props.catalogStudent}
              countStudent={countStudent.data}
              present={props.present}
              queryObject={selected}
            />
          </>
        )}
        <StudentFilter
          selected={selected}
          setSelected={setSelected}
          listSearch={props.listSearch}
        />
        <Search queryObject={selected} />
        {/* <div className="flex flex-col p-[20px]">
          <Update query={query} selected={selected} />
        </div> */}
      </div>
    </>
  );
};

export default Content;
