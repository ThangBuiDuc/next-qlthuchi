"use client";
import Add from "./add";
import AddExcel from "./addExcel";
import { GoPersonAdd } from "react-icons/go";
import { useState } from "react";
import { CiCircleMore } from "react-icons/ci";
import { CiImport } from "react-icons/ci";
import "react-toastify/dist/ReactToastify.css";
import StudentFilter from "@/app/_component/studentFilter";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useSubscription, gql } from "@apollo/client";
import { CiExport } from "react-icons/ci";
import { Spinner } from "@nextui-org/spinner";
import Search from "@/app/_component/tableStudent";

// const HitItem = ({ hit, isRefetching }) => {
//   return (
//     <>
//       {/* <tr className="hover"> */}
//       <TableCell>
//         A{/* {parse(hit._formatted.code)} */}
//         {/* <div
//           // className="w-[20%] self-center"
//           dangerouslySetInnerHTML={{ __html: hit._formatted.code }}
//         /> */}
//       </TableCell>

//       <TableCell>
//         A{/* {parse(hit._formatted.code)} */}
//         {/* <div
//           // className="w-[20%] self-center"
//           dangerouslySetInnerHTML={{ __html: hit._formatted.code }}
//         /> */}
//       </TableCell>
//       <TableCell>
//         A{/* {parse(hit._formatted.code)} */}
//         {/* <div
//           // className="w-[20%] self-center"
//           dangerouslySetInnerHTML={{ __html: hit._formatted.code }}
//         /> */}
//       </TableCell>

//       <TableCell>
//         <div
//           // className="w-[40%] self-center"
//           dangerouslySetInnerHTML={{
//             __html: `${hit._formatted.first_name} ${hit._formatted.last_name}`,
//           }}
//         />
//       </TableCell>

//       <TableCell>
//         <div
//           // className="w-[40%] self-center"
//           dangerouslySetInnerHTML={{
//             __html: `${hit._formatted.first_name} ${hit._formatted.last_name}`,
//           }}
//         />
//       </TableCell>
//       <TableCell>
//         <div
//           // className="w-[20%] self-center"
//           dangerouslySetInnerHTML={{ __html: hit._formatted.class_name }}
//         />
//       </TableCell>

//       <TableCell>
//         <p className="self-center">
//           {isRefetching ? (
//             <span className="loading loading-spinner loading-md self-center"></span>
//           ) : (
//             <>
//               <div className="tooltip" data-tip="Cập nhật">
//                 <Link href={`add-update-student/${hit.code}`}>
//                   <CiCircleMore size={25} />
//                 </Link>
//               </div>
//             </>
//           )}
//         </p>
//       </TableCell>

//       {/* </tr> */}
//     </>
//   );
// };

// const Search = ({ queryObject, config }) => {
//   // const [result, setResult] = useState(null);
//   const { data, isRefetching, isLoading } = useQuery({
//     queryKey: [`search`, queryObject],
//     queryFn: async () =>
//       meilisearchStudentSearch(queryObject, await meilisearchGetToken(), 1),
//   });

//   const [page, setPage] = useState(1);
//   const rowsPerPage = Number(config.result[0].config.page.value);

//   const pages = Math.ceil(data?.hits?.length / rowsPerPage);

//   const items = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return data?.hits?.slice(start, end);
//   }, [page, data]);

//   useEffect(() => {
//     setPage(1);
//   }, [queryObject]);

//   // useEffect(() => {
//   //   setResult(
//   //     data?.hits
//   //       .reduce((total, curr) => [...total, ...curr.hits], [])
//   //       .map((item) => ({ ...item, isOpen: false }))
//   //   );
//   // }, [data]);

//   return (
//     <Table
//       aria-label="Student Table"
//       removeWrapper
//       isStriped
//       isHeaderSticky
//       bottomContent={
//         !isLoading && (
//           <div className="flex w-full justify-center">
//             <Pagination
//               isCompact
//               showControls
//               // showShadow
//               // color="secondary"
//               page={page}
//               total={pages}
//               onChange={(page) => setPage(page)}
//             />
//           </div>
//         )
//       }
//     >
//       <TableHeader>
//         <TableColumn>STT</TableColumn>
//         <TableColumn>Mã học sinh</TableColumn>
//         <TableColumn>Họ tên</TableColumn>
//         <TableColumn>Lớp</TableColumn>
//         <TableColumn></TableColumn>
//       </TableHeader>

//       <TableBody
//         emptyContent={"Không tìm thấy kết quả"}
//         loadingContent={<Spinner />}
//         isLoading={isLoading}
//       >
//         {items?.map((el, index) => (
//           <TableRow key={el.code}>
//             <TableCell>
//               {/* <div
//                       dangerouslySetInnerHTML={{ __html: el._formatted.code }}
//                     /> */}
//               {index + 1}
//             </TableCell>
//             <TableCell>
//               {/* <div
//                       dangerouslySetInnerHTML={{ __html: el._formatted.code }}
//                     /> */}
//               {parse(el._formatted.code)}
//             </TableCell>
//             <TableCell>
//               <div
//                 dangerouslySetInnerHTML={{
//                   __html: `${el._formatted.first_name} ${el._formatted.last_name}`,
//                 }}
//               />
//             </TableCell>
//             <TableCell>
//               <div
//                 dangerouslySetInnerHTML={{
//                   __html: el._formatted.class_name,
//                 }}
//               />
//             </TableCell>
//             <TableCell>
//               <p className="self-center">
//                 {isRefetching ? (
//                   <Spinner size="sm" />
//                 ) : (
//                   <>
//                     {/* <div className="tooltip" data-tip="Cập nhật">
//                       <Link href={`add-update-student/${el.code}`}>
//                         <CiCircleMore size={25} />
//                       </Link>
//                     </div> */}

//                     <Tooltip content="Cập nhật" showArrow>
//                       <Link
//                         className="flex w-fit"
//                         href={`add-update-student/${el.code}`}
//                       >
//                         <CiCircleMore size={25} />
//                       </Link>
//                     </Tooltip>
//                   </>
//                 )}
//               </p>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

const Content = (props) => {
  const countStudent = useSubscription(
    gql`
      subscription student_count {
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
    query: "",
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
              <Spinner />
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
        <Search
          queryObject={selected}
          config={props.config}
          redirect={"add-update-student"}
          dataTip={"Cập nhật"}
        >
          <CiCircleMore size={25} />
        </Search>
        {/* <div className="flex flex-col p-[20px]">
          <Update query={query} selected={selected} />
        </div> */}
      </div>
    </>
  );
};

export default Content;
