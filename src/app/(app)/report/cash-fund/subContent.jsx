import { getReportCashFund } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import LoadingCustom from "@/app/_component/loadingCustom";
import moment from "moment";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const ExportExcel = ({ data, query }) => {
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BÁO CÁO QUỸ TIỀN MẶT");

    worksheet.mergeCells("A1:C1");
    const tentruong = worksheet.getCell("A1");
    tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
    tentruong.font = {
      name: "Times New Roman",
      size: 11,
      color: { argb: "FF0000" },
    };
    tentruong.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C2:E2");
    const titleCell = worksheet.getCell("C2");
    titleCell.value = "BÁO CÁO QUỸ TIỀN MẶT";
    titleCell.font = { name: "Times New Roman", size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C3:E3");
    const Ghichu = worksheet.getCell("C3");
    Ghichu.value = "Loại Quỹ: Đồng Việt Nam";
    Ghichu.font = { name: "Times New Roman", size: 12 };
    Ghichu.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C4:E4");
    const Taingay = worksheet.getCell("C4");
    // Taingay.value = `Từ ngày ${query.start_date?.spilt("-")[2]} tháng ${
    //   query.start_date?.spilt("-")[1]
    // } năm ${query.start_date?.spilt("-")[0]} đến ngày ${
    //   query.end_date?.spilt("-")[2]
    // } tháng ${query.end_date?.spilt("-")[1]} năm ${
    //   query.end_date?.spilt("-")[0]
    // }`;
    Taingay.font = {
      name: "Times New Roman",
      size: 12,
    };
    Taingay.alignment = { vertical: "middle", horizontal: "center" };
    // Thêm dữ liệu vào bảng tính
    worksheet.columns = [
      { key: "col1", width: 15 },
      { key: "col2", width: 15 },
      { key: "col3", width: 15 },
      { key: "col4", width: 60 },
      { key: "col5", width: 20 },
      { key: "col6", width: 20 },
      { key: "col7", width: 20 },
    ];

    worksheet.mergeCells("B6:C6");
    worksheet.mergeCells("E6:G6");
    worksheet.getCell(6, 1).value = "Ngày tháng";
    worksheet.getCell(7, 1).value = "chứng từ";
    worksheet.getCell(6, 2).value = "Số hiệu";
    worksheet.getCell(7, 2).value = "Thu";
    worksheet.getCell(7, 3).value = "Chi";
    worksheet.getCell(6, 4).value = "Diễn giải";
    worksheet.getCell(6, 5).value = "Diễn giải";
    worksheet.getCell(7, 5).value = "Thu";
    worksheet.getCell(7, 6).value = "Chi";
    worksheet.getCell(7, 7).value = "Tồn";

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

    // worksheet.getCell('A5').border = {
    //   top: {style:'thin'},
    //   left: {style:'thin'},
    //   bottom: {style:'thin'},
    //   right: {style:'thin'}
    // };

    worksheet.getCell(6, 1).border = {
      top: { style: "thin" },
      left: { style: "thin" },

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
    worksheet.getCell(7, 1).border = {
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

    worksheet.getCell(6, 1).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 2).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 3).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 4).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 5).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 6).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(6, 7).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 1).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 2).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 3).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 4).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 5).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 6).font = { bold: true, name: "Times New Roman" };
    worksheet.getCell(7, 7).font = { bold: true, name: "Times New Roman" };

    worksheet.addRow([
      "",
      "",
      "",
      `Tồn quỹ đầu ngày ${numberWithCommas(data[0].old_data.fund)}`,
    ]);

    data.forEach((element) => {
      if (element.new_data.note === "bill_receipt")
        worksheet.addRow([
          element.date.split("-").reverse().join("-"),
          element.new_data.note_json.code,
          "",
          element.new_data.note_json.name,
          numberWithCommas(element.new_data.note_json.amount_collected),
          "",
          numberWithCommas(element.new_data.fund),
        ]);

      if (element.new_data.note === "bill_refund")
        worksheet.addRow([
          element.date.split("-").reverse().join("-"),
          element.new_data.note_json.code,
          "",
          element.new_data.note_json.name,
          numberWithCommas(element.new_data.note_json.amount_spend),
          "",
          numberWithCommas(element.new_data.fund),
        ]);
    });

    worksheet.addRow([
      "",
      "",
      "",
      `Tồn quỹ cuối ngày ${numberWithCommas(
        data[data.length - 1].new_data.fund
      )}`,
    ]);

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "Bao-cao-quy-tien-mat.xlsx");
  };
  return (
    <button className="btn w-fit self-end" onClick={() => handleExport()}>
      Xuất Excel
    </button>
  );
};

const SubContent = ({ query }) => {
  const { getToken } = useAuth();
  const { data, isFetching } = useQuery({
    queryFn: async () =>
      getReportCashFund(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        query.start_date && query.end_date
          ? {
              date: {
                _gte: moment(query.start_date).format("yyyy-MM-DD"),
                _lte: moment(query.end_date).format("yyyy-MM-DD"),
              },
            }
          : query.start_date
          ? {
              date: {
                _gte: moment(query.start_date).format("yyyy-MM-DD"),
              },
            }
          : query.end_date
          ? {
              date: {
                _lte: moment(query.end_date).format("yyyy-MM-DD"),
              },
            }
          : null
      ),
    queryKey: ["report_cash_fund", query],
  });

  if (isFetching)
    return (
      <div className="flex justify-center">
        <LoadingCustom />
      </div>
    );

  if (data.data.results.length === 0)
    return (
      <h6 className="text-center">Hiện tại chưa có dữ liệu để hiển thị!</h6>
    );

  return (
    <div className="flex flex-col gap-2 p-2">
      <ExportExcel data={data.data.results} query={query} />
      <h6 className="text-center">
        Tồn quỹ đầu ngày: {numberWithCommas(data.data.results[0].old_data.fund)}{" "}
        đồng
      </h6>
      <h6 className="text-center">
        Tồn quỹ cuối ngày:{" "}
        {numberWithCommas(
          data.data.results[data.data.results.length - 1].new_data.fund
        )}{" "}
        đồng
      </h6>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Ngày tháng chứng từ</th>
              <th>Số hiệu thu</th>
              <th>Số hiệu chi</th>
              <th>Diễn giải</th>
              <th>Số tiền thu</th>
              <th>Số tiền chi</th>
              <th>Số tiền tồn</th>
            </tr>
          </thead>
          <tbody>
            {data.data.results.map((item) => {
              if (item.new_data.note === "bill_receipt")
                return (
                  <tr key={item.id}>
                    <td>{item.date.split("-").reverse().join("-")}</td>
                    <td>{item.new_data.note_json.code}</td>
                    <td></td>
                    <td>{item.new_data.note_json.name}</td>
                    <td>
                      {numberWithCommas(
                        item.new_data.note_json.amount_collected
                      )}
                    </td>
                    <td></td>
                    <td>{numberWithCommas(item.new_data.fund)}</td>
                  </tr>
                );

              if (item.new_data.note === "bill_refund")
                return (
                  <tr key={item.id}>
                    <td>{item.date.split("-").reverse().join("-")}</td>
                    <td>{item.new_data.note_json.code}</td>
                    <td></td>
                    <td>{item.new_data.note_json.name}</td>
                    <td>
                      {numberWithCommas(item.new_data.note_json.amount_spend)}
                    </td>
                    <td></td>
                    <td>{numberWithCommas(item.new_data.fund)}</td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubContent;
