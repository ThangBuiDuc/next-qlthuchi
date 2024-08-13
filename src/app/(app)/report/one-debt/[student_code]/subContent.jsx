"use client";
import {
  meilisearchGetToken,
  meilisearchReportDebtGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import localFont from "next/font/local";
import { useRef } from "react";
import { getText } from "number-to-text-vietnamese";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";

const times = localFont({ src: "../../../../times.ttf" });

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const ExportNotice = ({ data, student, school_year, disabled }) => {
  // console.log(student, selectPresent, data);
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // console.log(data.data.results.sub);

  return (
    <>
      <button
        className="btn w-fit"
        onClick={() => handlePrint()}
        disabled={disabled}
      >
        Xuất giấy báo
      </button>
      {/* PRINT DIV */}
      <div className="hidden">
        <div
          ref={printRef}
          className={`flex flex-col relative justify-center items-center  mb-5 ${times.className}`}
        >
          <style type="text/css" media="print">
            {"@page {size: landscape; margin: 10px;}"}
          </style>
          <div className="grid grid-cols-3">
            <p className="text-[8px]">
              TRƯỜNG TIỂU HỌC VÀ TRUNG HỌC CƠ SỞ HỮU NGHỊ QUỐC TẾ
            </p>
            <p className="uppercase font-semibold text-[20px] text-center">
              giấy báo công nợ
            </p>
          </div>
          <p className="text-[12px] text-center">
            Học kỳ{" "}
            {
              school_year.result
                .find((item) => item.is_active)
                .batchs.find((item) => item.is_active).batch
            }{" "}
            năm học{" "}
            {school_year.result.find((item) => item.is_active).school_year}
          </p>
          <p className="text-[12px] text-center">
            Tại ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
            {moment().year()}
          </p>
          <div className="grid grid-cols-2 p-5 w-full gap-1">
            <p className="text-[12px] text-center">
              Mã học sinh: {student.code}
            </p>
            <p className="text-[12px] text-center">
              Họ và tên học sinh: {student.first_name} {student.last_name}
            </p>
            <p className="text-[12px] text-center">Lớp: {student.class_code}</p>
            <p className="text-[12px] text-center">
              Ngày sinh: {student.date_of_birth.split("-").reverse().join("/")}
            </p>
            <div className="w-full flex flex-col col-span-2">
              <div className="w-full flex">
                <p className="text-[12px] text-center w-[10%] border-t border-l border-black font-semibold">
                  TT
                </p>
                <p className="text-[12px] text-center w-[60%] border-l border-r border-t border-black font-semibold">
                  Nội dung
                </p>
                <p className="text-[12px] text-center w-[30%] border-r border-t border-black font-semibold">
                  Số tiền (đồng)
                </p>
              </div>
              <div className="w-full flex">
                <p className="text-[12px] text-center w-[10%] border-t border-l border-black ">
                  1
                </p>
                <p className="text-[12px] w-[60%] border-l border-r border-t border-black  pl-1">
                  Công nợ đầu kỳ
                </p>
                <p className="text-[12px] text-end w-[30%] border-r border-t border-black pr-1">
                  {data.data?.results[0].sub.reduce(
                    (total, curr) =>
                      curr.previous_batch_money !== null
                        ? total + curr.previous_batch_money
                        : total,
                    0
                  )}{" "}
                  đ
                </p>
              </div>
              <div className="w-full flex">
                <p className="text-[12px] text-center w-[10%] border-t border-l border-black ">
                  2
                </p>
                <p className="text-[12px] w-[60%] border-l border-r border-t border-black  pl-1">
                  Ưu đãi, miễn giảm
                </p>
                <p className="text-[12px] text-end w-[30%] border-r border-t border-black pr-1">
                  {data.data?.results[0].sub.reduce(
                    (total, curr) =>
                      curr.discount !== null ? total + curr.discount : total,
                    0
                  )}{" "}
                  đ
                </p>
              </div>
              <div className="w-full flex">
                <p className="text-[12px] text-center w-[10%] border-t border-l border-black ">
                  3
                </p>
                <p className="text-[12px] w-[60%] border-l border-r border-t border-black  pl-1">
                  Số phải nộp kỳ này
                </p>
                <p className="text-[12px] text-end w-[30%] border-r border-t border-black pr-1">
                  {data.data?.results[0].sub.reduce(
                    (total, curr) =>
                      curr.actual_amount_collected !== null
                        ? total + curr.actual_amount_collected
                        : total,
                    0
                  )}{" "}
                  đ
                </p>
              </div>
              <div className="w-full flex">
                <p className="text-[12px] text-center w-[10%] border-t border-l border-black ">
                  4
                </p>
                <p className="text-[12px] w-[60%] border-l border-r border-t border-black  pl-1">
                  Số đã điều chỉnh
                </p>
                <p className="text-[12px] text-end w-[30%] border-r border-t border-black pr-1">
                  {data.data?.results[0].sub.reduce(
                    (total, curr) =>
                      curr.amount_edited !== null
                        ? total + curr.amount_edited
                        : total,
                    0
                  )}{" "}
                  đ
                </p>
              </div>
              <div className="w-full flex">
                <p className="text-[12px] text-center w-[10%] border-t border-l border-black ">
                  5
                </p>
                <p className="text-[12px] w-[60%] border-l border-r border-t border-black pl-1">
                  Số đã hoàn trả
                </p>
                <p className="text-[12px] text-end w-[30%] border-r border-t border-black pr-1">
                  {data.data?.results[0].sub.reduce(
                    (total, curr) =>
                      curr.amount_spend !== null
                        ? total + curr.amount_spend
                        : total,
                    0
                  )}{" "}
                  đ
                </p>
              </div>
              <div className="w-full flex">
                <p className="text-[12px] text-center w-[10%] border-t border-l border-black ">
                  6
                </p>
                <p className="text-[12px] w-[60%] border-l border-r border-t border-black  pl-1">
                  Số đã nộp trong kỳ
                </p>
                <p className="text-[12px] text-end w-[30%] border-r border-t border-black font-semibold pr-1">
                  {data.data?.results[0].sub.reduce(
                    (total, curr) =>
                      curr.amount_collected !== null
                        ? total + curr.amount_collected
                        : total,
                    0
                  )}{" "}
                  đ
                </p>
              </div>
              <div className=" grid grid-cols-[10%_60%_30%] ">
                <div className="flex items-center justify-center col-span-1 row-span-2 border-t border-l border-b border-black ">
                  <p className="text-[12px] text-center font-semibold">7</p>
                </div>
                <p className="text-[12px]  border-r border-t border-l border-black font-semibold pl-1">
                  Công nợ còn phải nộp
                </p>
                <p className="text-[12px] text-end  border-r border-t  border-black font-semibold pr-1">
                  {data.data?.results[0].sub.reduce(
                    (total, curr) =>
                      curr.next_batch_money !== null
                        ? total + curr.next_batch_money
                        : total,
                    0
                  )}{" "}
                  đ
                </p>
                <p className="text-[12px] text-start col-span-2 border border-black italic pl-1">
                  Bằng chữ:{" "}
                  {getText(
                    data.data?.results[0].sub.reduce(
                      (total, curr) =>
                        curr.next_batch_money !== null
                          ? total + curr.next_batch_money
                          : total,
                      0
                    )
                  )
                    ?.charAt(0)
                    .toUpperCase() +
                    getText(
                      data.data?.results[0].sub.reduce(
                        (total, curr) =>
                          curr.next_batch_money !== null
                            ? total + curr.next_batch_money
                            : total,
                        0
                      )
                    )?.slice(1)}
                </p>
              </div>
              <div className="grid grid-cols-2 mt-4">
                <p className="text-[12px]   text-center font-semibold">
                  Kế toán
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SubContent = ({
  present,
  student_code,
  student,
  school_year,
  config,
}) => {
  // console.log(school_year);
  // console.log(student);
  const data = useQuery({
    queryKey: ["report_debt_one", student_code, present],
    queryFn: async () =>
      meilisearchReportDebtGet(
        await meilisearchGetToken(),
        `primary_code = ${student_code}${present.id}`
      ),
  });

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TỔNG HỢP CÔNG NỢ");

    worksheet.mergeCells("B1:C1");
    const tentruong = worksheet.getCell("B1");
    tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
    tentruong.font = { name: "Times New Roman", size: 11 };
    tentruong.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("B2:I2");
    const titleCell = worksheet.getCell("F2");
    titleCell.value = "TỔNG HỢP CÔNG NỢ";
    titleCell.font = { name: "Times New Roman", size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("B3:I3");
    const Ghichu = worksheet.getCell("F3");
    Ghichu.value = "(Theo một học sinh)";
    Ghichu.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "FF0000" },
    };
    Ghichu.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("B4:I4");
    const tths = worksheet.getCell("F4");
    tths.value = `Mã học sinh: ${student_code}     Họ tên học sinh: ${
      student.first_name
    } ${student.last_name}       Ngày sinh: ${student.date_of_birth
      .split("-")
      .reverse()
      .join("-")}    Lớp: ${
      student.class_code[0]
    }      Mã lớp: ${student.class_code.substring(1)}`;
    tths.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "#CC0000" },
    };
    tths.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("B5:I5");
    const Taingay = worksheet.getCell("G5");
    Taingay.value = `Tại ngày ${moment().date()} Tháng ${
      moment().month() + 1
    } Năm ${moment().year()}`;
    Taingay.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "#CC0000" },
    };
    Taingay.alignment = { vertical: "middle", horizontal: "center" };
    // Thêm dữ liệu vào bảng tính
    worksheet.columns = [
      { key: "col1", width: 5 },
      { key: "col2", width: 30 },
      { key: "col3", width: 20 },
      { key: "col4", width: 20 },
      { key: "col5", width: 20 },
      { key: "col6", width: 20 },
      { key: "col7", width: 30 },
      { key: "col8", width: 30 },
      { key: "col9", width: 30 },
    ];
    worksheet.getCell(7, 1).value = "TT";
    worksheet.getCell(7, 2).value = "Nội dung";
    worksheet.getCell(
      7,
      3
    ).value = `Công nợ đầu kỳ ${present.batch} năm ${school_year.result[0].school_year}`;
    worksheet.getCell(
      7,
      4
    ).value = `Ưu đãi, miễn giảm kỳ ${present.batch} năm ${school_year.result[0].school_year}`;
    worksheet.getCell(
      7,
      5
    ).value = `Số phải nộp ${present.batch} năm ${school_year.result[0].school_year}`;
    worksheet.getCell(
      7,
      6
    ).value = `Đã điều chỉnh ${present.batch} năm ${school_year.result[0].school_year}`;
    worksheet.getCell(
      7,
      7
    ).value = `Đã hoàn trả kỳ ${present.batch} năm ${school_year.result[0].school_year}`;
    worksheet.getCell(
      7,
      8
    ).value = `Số đã nộp kỳ ${present.batch} năm ${school_year.result[0].school_year}`;
    worksheet.getCell(
      7,
      9
    ).value = `Công nợ cuối kỳ ${present.batch} năm ${school_year.result[0].school_year}`;
    data?.data?.results[0].sub
      .sort((a, b) => a.position - b.position)
      .map((item, index) => {
        worksheet.addRow([
          ++index,
          item.name,
          item.previous_batch_money ? item.previous_batch_money : 0,
          item.discount ? item.discount : 0,
          item.actual_amount_collected ? item.actual_amount_collected : 0,
          item.amount_edited ? item.amount_edited : 0,
          item.amount_spend ? item.amount_spend : 0,
          item.amount_collected ? item.amount_collected : 0,
          item.next_batch_money ? item.next_batch_money : 0,
        ]);
      });

    worksheet.addRow([
      "I",
      "Tổng tiền phí, học phí",
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 1
            ? total + curr.previous_batch_money
            : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 1 ? total + curr.discount : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 1
            ? total + curr.actual_amount_collected
            : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 1 ? total + curr.amount_edited : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 1 ? total + curr.amount_spend : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 1 ? total + curr.amount_collected : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 1 ? total + curr.next_batch_money : total,
        0
      ),
    ]);

    worksheet.addRow([
      "II",
      "Tổng tiền thu hộ",
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 2
            ? total + curr.previous_batch_money
            : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 2 ? total + curr.discount : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 2
            ? total + curr.actual_amount_collected
            : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 2 ? total + curr.amount_edited : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 2 ? total + curr.amount_spend : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 2 ? total + curr.amount_collected : total,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) =>
          curr.revenue_type_id === 2 ? total + curr.next_batch_money : total,
        0
      ),
    ]);

    worksheet.addRow([
      "III",
      "Tổng cộng (=I+II)",
      data?.data?.results[0].sub.reduce(
        (total, curr) => total + curr.previous_batch_money,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) => total + curr.discount,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) => total + curr.actual_amount_collected,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) => total + curr.amount_edited,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) => total + curr.amount_spend,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) => total + curr.amount_collected,
        0
      ),
      data?.data?.results[0].sub.reduce(
        (total, curr) => total + curr.next_batch_money,
        0
      ),
    ]);

    worksheet.getCell(7, 1).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 2).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 3).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 4).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 5).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 6).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 7).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 8).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(7, 9).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.getCell(7, 1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 2).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 3).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 4).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 5).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 6).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 7).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 8).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(7, 9).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell(7, 1).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 2).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 3).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 4).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 5).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 6).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 7).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 8).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 9).font = { bold: true, name: "Times New Roman" };

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "Tong-hop-cong-no-mot-hs.xlsx");
  };

  if (data.isFetching && data.isLoading) {
    <div className="flex flex-col gap-5 justify-center">
      <span className="loading loading-spinner loading-sm bg-primary self-end"></span>
    </div>;
  }
  return (
    <div className="flex flex-col gap-5 justify-center">
      <>
        <div className="flex justify-end gap-1">
          <ExportNotice
            data={data}
            school_year={school_year}
            student={student}
            disabled={data.isFetching && data.isLoading}
          />
          <button
            className=" btn w-fit"
            onClick={() => handleExcel()}
            disabled={data.isFetching && data.isLoading}
          >
            Xuất Excel
          </button>
        </div>
        {/* <div className="overflow-x-auto"> */}
        <Table
          aria-label="one debt Table"
          className="max-h-[450px]"
          isStriped
          isHeaderSticky
        >
          <TableHeader>
            <TableColumn>STT</TableColumn>
            <TableColumn>Khoản thu</TableColumn>
            <TableColumn>Công nợ đầu kỳ</TableColumn>
            <TableColumn>Ưu đãi miễn giảm</TableColumn>
            <TableColumn>Số phải nộp</TableColumn>
            <TableColumn>Đã điều chỉnh</TableColumn>
            <TableColumn>Đã hoàn trả</TableColumn>
            <TableColumn>Số đã nộp</TableColumn>
            <TableColumn>Công nợ cuối kỳ</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={data.isFetching && data.isLoading}
            loadingContent={<Spinner color="primary" />}
            emptyContent={"Không có dữ liệu!"}
          >
            {data.data?.results[0].sub.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{++index}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {item.previous_batch_money
                    ? numberWithCommas(item.previous_batch_money, config)
                    : 0}
                </TableCell>
                <TableCell>
                  {item.discount ? numberWithCommas(item.discount, config) : 0}
                </TableCell>
                <TableCell>
                  {item.actual_amount_collected
                    ? numberWithCommas(item.actual_amount_collected, config)
                    : 0}
                </TableCell>
                <TableCell>
                  {item.amount_edited
                    ? numberWithCommas(item.amount_collected, config)
                    : 0}
                </TableCell>
                <TableCell>
                  {item.amount_spend
                    ? numberWithCommas(item.amount_spend, config)
                    : 0}
                </TableCell>
                <TableCell>
                  {item.amount_collected
                    ? numberWithCommas(item.amount_collected, config)
                    : 0}
                </TableCell>
                <TableCell>
                  {item.next_batch_money
                    ? numberWithCommas(item.next_batch_money, config)
                    : 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* </div> */}
      </>
    </div>
  );
};

export default SubContent;
