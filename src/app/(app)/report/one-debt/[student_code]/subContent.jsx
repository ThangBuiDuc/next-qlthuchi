"use client";
import {
  meilisearchGetToken,
  meilisearchReportDebtGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";

const SubContent = ({ selected, student_code, student }) => {
  const data = useQuery({
    queryKey: ["report_debt_one", student_code, selected],
    queryFn: async () =>
      meilisearchReportDebtGet(
        await meilisearchGetToken(),
        `primary_code = ${student_code}${selected.value}`
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
      .join("-")}    Lớp: ……      Mã lớp: …..`;
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
    worksheet.getCell(7, 3).value = "Công nợ đầu kỳ ... năm 202…-202…";
    worksheet.getCell(7, 4).value = "Ưu đãi, miễn giảm kỳ ... năm 202…-202…";
    worksheet.getCell(7, 5).value = "Số phải nộp kỳ... năm 202…-202…";
    worksheet.getCell(7, 6).value = "Đã điều chỉnh kỳ ... năm 202…-202…";
    worksheet.getCell(7, 7).value = "Đã hoàn trả kỳ ... năm 202…-202…";
    worksheet.getCell(7, 8).value = "Số đã nộp kỳ ... năm 202…-202…";
    worksheet.getCell(7, 9).value = "Công nợ cuối kỳ ... năm 202…-202…";
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
          item.amount_of_spend ? item.amount_of_spend : 0,
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
          curr.revenue_type_id === 1 ? total + curr.amount_of_spend : total,
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
          curr.revenue_type_id === 2 ? total + curr.amount_of_spend : total,
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
        (total, curr) => total + curr.amount_of_spend,
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
                  <th>Khoản thu</th>
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
                  data.data.results[0].sub.map((item, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{item.name}</td>
                      <td>
                        {item.previous_batch_money
                          ? item.previous_batch_money
                          : 0}
                      </td>
                      <td>{item.discount ? item.discount : 0}</td>
                      <td>
                        {item.actual_amount_collected
                          ? item.actual_amount_collected
                          : 0}
                      </td>
                      <td>{item.amount_edited ? item.amount_collected : 0}</td>
                      <td>{item.amount_of_spend ? item.amount_of_spend : 0}</td>
                      <td>
                        {item.amount_collected ? item.amount_collected : 0}
                      </td>
                      <td>
                        {item.next_batch_money ? item.next_batch_money : 0}
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
