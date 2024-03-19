"use client";
import {
  meilisearchGetToken,
  meilisearchReportDebtGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const SubContent = ({ present }) => {
  const data = useQuery({
    queryKey: ["report_debt", present],
    queryFn: async () =>
      meilisearchReportDebtGet(
        await meilisearchGetToken(),
        `batch_id = ${present.id}`
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

    worksheet.mergeCells("C2:J2");
    const titleCell = worksheet.getCell("G2");
    titleCell.value = "TỔNG HỢP CÔNG NỢ";
    titleCell.font = { name: "Times New Roman", size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C3:J3");
    const Ghichu = worksheet.getCell("G3");
    Ghichu.value = "(Theo nhiều học sinh)";
    Ghichu.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "FF0000" },
    };
    Ghichu.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C4:J4");
    const Taingay = worksheet.getCell("G4");
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
      { key: "col2", width: 20 },
      { key: "col3", width: 30 },
      { key: "col4", width: 20 },
      { key: "col5", width: 20 },
      { key: "col6", width: 20 },
      { key: "col7", width: 30 },
      { key: "col8", width: 30 },
      { key: "col9", width: 30 },
      { key: "col10", width: 30 },
      { key: "col11", width: 30 },
      { key: "col12", width: 30 },
      { key: "col13", width: 30 },
    ];
    worksheet.getCell(6, 1).value = "STT";
    worksheet.getCell(6, 2).value = "Mã học sinh";
    worksheet.getCell(6, 3).value = "Họ và tên học sinh";
    worksheet.getCell(6, 4).value = "Ngày sinh";
    worksheet.getCell(6, 5).value = "Lớp";
    worksheet.getCell(6, 6).value = "Mã lớp";
    worksheet.getCell(6, 7).value = "Công nợ đầu kỳ ... năm 202…-202…";
    worksheet.getCell(6, 8).value = "Ưu đãi, miễn giảm kỳ ... năm 202…-202…";
    worksheet.getCell(6, 9).value = "Số phải nộp kỳ... năm 202…-202…";
    worksheet.getCell(6, 10).value = "Đã điều chỉnh kỳ ... năm 202…-202…";
    worksheet.getCell(6, 11).value = "Đã hoàn trả kỳ ... năm 202…-202…";
    worksheet.getCell(6, 12).value = "Số đã nộp kỳ ... năm 202…-202…";
    worksheet.getCell(6, 13).value = "Công nợ cuối kỳ ... năm 202…-202…";

    data?.data?.results.map((item, index) => {
      worksheet.addRow([
        ++index,
        item.code,
        `${item.first_name} ${item.last_name}`,
        item.date_of_birth.split("-").reverse().join("-"),
        "",
        "",
        item.sub.reduce((total, curr) => total + curr.previous_batch_money, 0),
        item.sub.reduce((total, curr) => total + curr.discount, 0),
        item.sub.reduce(
          (total, curr) => total + curr.actual_amount_collected,
          0
        ),
        item.sub.reduce((total, curr) => total + curr.amount_edited, 0),
        item.sub.reduce((total, curr) => total + curr.amount_of_spend, 0),
        item.sub.reduce((total, curr) => total + curr.amount_collected, 0),
        item.sub.reduce((total, curr) => total + curr.next_batch_money, 0),
      ]);
    });

    let lastRow = ["", "", "Tổng cộng", "", "", ""];

    for (let i = 7; i <= worksheet.columnCount; i++) {
      let total = 0;
      let column = worksheet.getColumn(i);
      column.eachCell((cell, rowNumber) => {
        if (rowNumber >= 7) total = total + parseInt(cell.text);
      });
      lastRow[i - 1] = total;
    }

    worksheet.addRow(lastRow);

    worksheet.getCell(6, 1).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 2).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 3).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 4).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 5).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 6).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 7).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 8).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 9).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 10).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 11).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 12).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(6, 13).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.getCell(6, 1).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 2).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 3).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 4).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 5).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 6).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 7).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 8).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 9).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 10).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 11).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 12).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getCell(6, 13).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.getCell(6, 1).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 2).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 3).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 4).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 5).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 6).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 7).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 8).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 9).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 10).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 11).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 12).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 13).font = { bold: true, name: "Times New Roman" };

    // worksheet.addRow({
    //   col3: "Họ và tên học sinh",
    // });

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "Tong-hop-cong-no.xlsx");
  };

  if (data.isFetching && data.isLoading) {
    <div className="flex flex-col gap-5 justify-center">
      <span className="loading loading-spinner loading-sm bg-primary self-end"></span>
    </div>;
  }
  return (
    <div className="flex flex-col gap-5 justify-center">
      {data.data?.results?.length ? (
        <>
          <button className="self-end btn w-fit" onClick={() => handleExcel()}>
            Xuất Excel
          </button>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã sinh viên</th>
                  <th>Họ tên sinh viên</th>
                  <th>Công nợ đầu kỳ</th>
                  <th>Ưu đãi miễn giảm</th>
                  <th>Số phải nộp</th>
                  <th>Đã điều chỉnh</th>
                  <th>Đã hoàn trả</th>
                  <th>Số đã nộp</th>
                  <th>Công nợ cuối kỳ</th>
                </tr>
              </thead>
              <tbody>
                {data.data.results.length ? (
                  data.data.results.map((item, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{item.code}</td>
                      <td>{`${item.first_name} ${item.last_name}`}</td>
                      <td>
                        {numberWithCommas(
                          item.sub.reduce(
                            (total, curr) => total + curr.previous_batch_money,
                            0
                          )
                        )}
                      </td>
                      <td>
                        {numberWithCommas(
                          item.sub.reduce(
                            (total, curr) => total + curr.discount,
                            0
                          )
                        )}
                      </td>
                      <td>
                        {numberWithCommas(
                          item.sub.reduce(
                            (total, curr) =>
                              total + curr.actual_amount_collected,
                            0
                          )
                        )}
                      </td>
                      <td>
                        {numberWithCommas(
                          item.sub.reduce(
                            (total, curr) => total + curr.amount_edited,
                            0
                          )
                        )}
                      </td>
                      <td>
                        {numberWithCommas(
                          item.sub.reduce(
                            (total, curr) => total + curr.amount_of_spend,
                            0
                          )
                        )}
                      </td>
                      <td>
                        {numberWithCommas(
                          item.sub.reduce(
                            (total, curr) => total + curr.amount_collected,
                            0
                          )
                        )}
                      </td>
                      <td>
                        {numberWithCommas(
                          item.sub.reduce(
                            (total, curr) => total + curr.next_batch_money,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h6 className="text-center">Hiện tại chưa có dữ liệu!!</h6>
      )}
    </div>
  );
};

export default SubContent;
