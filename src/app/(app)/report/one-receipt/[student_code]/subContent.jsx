import {
  meilisearchGetToken,
  meilisearchReportReceiptOneGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import moment from "moment";

function sumArrayObjectsById(arr) {
  const sumMap = {};

  // Iterate through the array
  arr.forEach((obj) => {
    // Check if the object has an 'id' property
    if (obj.hasOwnProperty("id")) {
      const id = obj.id;

      // If the id is already in the sumMap, add the value to it
      if (sumMap.hasOwnProperty(id)) {
        sumMap[id].amount_collected += obj.amount_collected; // Assuming the property to be summed is 'amount_collected'
      } else {
        // If the id is not in the sumMap, create a new entry with the amount_collected
        sumMap[id] = { ...obj };
      }
    }
  });

  // Convert the sumMap back to an array of objects
  const result = Object.values(sumMap);

  return result;
}

const handleExcel = async (selectedFilter, data, revenueGroup, student) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("TH da thu mot hs", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  const header = revenueGroup.sort((a, b) => a.position - b.position);

  // sheet.addRow([]);
  // sheet.addRow(["Tổng hợp các khoản đã thu"]);
  // sheet.addRow(["(Theo 1 học sinh)"]);
  // sheet.addRow([
  //   `Mã học sinh: ${student.code}`,
  //   `Họ tên học sinh: ${student.first_name} ${student.last_name}`,
  //   `Ngày sinh: ${student.date_of_birth.split("-").reverse().join("-")}`,
  //   `Lớp: ${student.class_level_code}`,
  //   `Mã lớp: ${student.class_code}`,
  // ]);
  // sheet.addRow([
  //   "Từ ngày ... tháng ... năm ... đến ngày ... tháng ... năm ...",
  // ]);

  sheet.mergeCells("B1:C1");
  const tentruong = sheet.getCell("B1");
  tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
  tentruong.font = { name: "Times New Roman", size: 11 };
  tentruong.alignment = { vertical: "middle", horizontal: "center" };

  sheet.mergeCells("C2:J2");
  const titleCell = sheet.getCell("G2");
  titleCell.value = "TỔNG HỢP CÁC KHOẢN ĐÃ THU";
  titleCell.font = { name: "Times New Roman", size: 16, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  sheet.mergeCells("C3:J3");
  const Ghichu = sheet.getCell("G3");
  Ghichu.value = "(Theo học sinh)";
  Ghichu.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "FF0000" },
  };
  Ghichu.alignment = { vertical: "middle", horizontal: "center" };

  sheet.mergeCells("C4:J4");
  const tths = sheet.getCell("G4");
  tths.value = `Mã học sinh: ${student.code}      Họ tên học sinh: ${
    student.first_name
  } ${student.last_name}       Ngày sinh: ${student.date_of_birth
    .split("-")
    .reverse()
    .join("-")}   Lớp: ${student.class_level_code}      Mã lớp: ${
    student.class_code
  }`;
  tths.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "#CC0000" },
  };
  tths.alignment = { vertical: "middle", horizontal: "center" };
  sheet.mergeCells("C5:J5");
  const Taingay = sheet.getCell("G5");
  Taingay.value =
    "Từ ngày ….. tháng ….. năm …. đến ngày …. tháng ….. năm ….    ";
  Taingay.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "#CC0000" },
  };
  Taingay.alignment = { vertical: "middle", horizontal: "center" };
  // Thêm dữ liệu vào bảng tính
  sheet.addRow([]);
  sheet.addRow([
    "STT",
    "Số biên lai",
    "Ngày BL",
    ...header.map((item) => item.name),
    "Tổng tiền phí, học phí thu",
    "Tổng tiền thu hộ thu",
    "Tổng tiền thu",
  ]);

  data?.results.forEach((item, index) => {
    sheet.addRow([
      ++index,
      item.receipt_code,
      moment.unix(item.start_at).format("DD-MM-yyyy"),
      ...sumArrayObjectsById(item.receipt_details)
        .sort((a, b) => a.position - b.position)
        .map((item) =>
          item.amount_collected != null ? item.amount_collected : 0
        ),
      sumArrayObjectsById(item.receipt_details)
        .filter((item) => item.amount_collected != null)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 1 ? total + curr.amount_collected : total,
          0
        ),
      sumArrayObjectsById(item.receipt_details)
        .filter((item) => item.amount_collected != null)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 2 ? total + curr.amount_collected : total,
          0
        ),
      item.amount_collected,
    ]);
  });

  let lastRow = new Array(sheet.columnCount);
  lastRow[2] = "Tổng cộng";

  for (let i = 4; i <= sheet.columnCount; i++) {
    let col = sheet.getColumn(i);
    let sum = 0;
    col.eachCell((cell, rowNumber) => {
      if (rowNumber >= 8) sum = sum + parseInt(cell.text);
    });
    lastRow[i] = sum;
  }

  sheet.addRow(lastRow);

  sheet.columns = [
    { key: "col1", width: 5 },
    { key: "col2", width: 20 },
    { key: "col3", width: 30 },
    { key: "col4", width: 20 },
    { key: "col5", width: 20 },
    { key: "col6", width: 20 },
    { key: "col7", width: 20 },
    { key: "col8", width: 20 },
    { key: "col9", width: 20 },
    { key: "col10", width: 20 },
    { key: "col11", width: 20 },
    { key: "col12", width: 20 },
    { key: "col13", width: 20 },
    { key: "col14", width: 20 },
    { key: "col15", width: 20 },
    { key: "col16", width: 20 },
    { key: "col17", width: 20 },
    { key: "col18", width: 20 },
    { key: "col19", width: 20 },
    { key: "col20", width: 20 },
    { key: "col21", width: 20 },
    { key: "col22", width: 20 },
    { key: "col23", width: 20 },
    { key: "col24", width: 20 },
  ];

  sheet.getCell(7, 1).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 2).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 3).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 4).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 5).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 6).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 7).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 8).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 9).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 10).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 11).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 12).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 13).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 14).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 15).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 16).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 17).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 18).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 19).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 20).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 21).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 22).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 23).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(7, 24).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };

  sheet.getCell(7, 1).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 2).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 3).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 4).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 5).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 6).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 7).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 8).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 9).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 10).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 11).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 12).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 13).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 14).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 15).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 16).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 17).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 18).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 19).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 20).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 21).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 22).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 23).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(7, 24).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  sheet.getCell(7, 1).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 2).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 3).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 4).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 5).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 6).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 7).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 8).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 9).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 10).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 11).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF00FF" },
  };
  sheet.getCell(7, 12).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF00FF" },
  };
  sheet.getCell(7, 13).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 14).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 15).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 16).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "3366FF" },
  };
  sheet.getCell(7, 17).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 18).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 19).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 20).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 21).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 22).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(7, 23).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "3366FF" },
  };
  sheet.getCell(7, 24).font = { bold: true, name: "Times New Roman" };

  const buf = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buf]), "Tong-hop-da-thu-mot-hs.xlsx");
};

const TableView = ({ isLoading, data, revenueGroup }) => {
  return (
    <Table
      aria-label="One Receipt Table"
      //   removeWrapper
      className="max-h-[450px]"
      isStriped
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Số biên lai</TableColumn>
        <TableColumn>Ngày biên lai</TableColumn>
        {revenueGroup
          .sort((a, b) => a.position - b.position)
          .map((item) => (
            <TableColumn key={item.id}>{item.name}</TableColumn>
          ))}
      </TableHeader>
      <TableBody
        emptyContent={"Không tìm thấy kết quả"}
        loadingContent={<Spinner color="primary" />}
        isLoading={isLoading}
      >
        {data?.results.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{++index}</TableCell>
            <TableCell>{item.receipt_code}</TableCell>
            <TableCell className="whitespace-nowrap">
              {moment.unix(item.start_at).format("DD-MM-yyyy")}
            </TableCell>
            {sumArrayObjectsById(item.receipt_details)
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                <TableCell key={item.id}>
                  {item.amount_collected != null ? item.amount_collected : 0}
                </TableCell>
              ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const SubContent = ({
  revenueGroup,
  condition,
  config,
  selectedFilter,
  student,
}) => {
  //   console.log(revenueGroup);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["report_receipt_one", condition],
    queryFn: async () =>
      meilisearchReportReceiptOneGet(await meilisearchGetToken(), condition),
  });

  return (
    <>
      <button
        disabled={data?.results.length === 0}
        className="self-end btn w-fit"
        onClick={() => handleExcel(selectedFilter, data, revenueGroup, student)}
      >
        Xuất Excel
      </button>
      <TableView
        isLoading={isLoading && isFetching}
        data={data}
        revenueGroup={revenueGroup}
        config={config}
      />
    </>
  );
};

export default SubContent;
