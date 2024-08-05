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

const handleExcel = async (selectedFilter) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("TH da thu mot hs", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  const header = revenueGroup.sort((a, b) => a.position - b.position);

  sheet.addRow([]);
  sheet.addRow(["Tổng hợp các khoản đã thu"]);
  sheet.addRow(["(Theo 1 học sinh)"]);
  sheet.addRow([
    `Mã học sinh: ${student_code}`,
    `Họ tên học sinh: ${student.first_name} ${student.last_name}`,
    `Ngày sinh:`,
    `Lớp`,
    `Mã lớp`,
  ]);
  sheet.addRow([
    "Từ ngày ... tháng ... năm ... đến ngày ... tháng ... năm ...",
  ]);

  sheet.addRow([
    "STT",
    "Số biên lai",
    "Ngày BL",
    ...header.map((item) => item.name),
    "Tổng tiền phí, học phí thu",
    "Tổng tiền thu hộ thu",
    "Tổng tiền thu",
  ]);

  data?.data?.results.forEach((item, index) => {
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
      if (rowNumber >= 7) sum = sum + parseInt(cell.text);
    });
    lastRow[i] = sum;
  }

  sheet.addRow(lastRow);

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
        <TableColumn>Ngày thao tác thu</TableColumn>
        <TableColumn>Nội dung thu</TableColumn>
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
            <TableCell>
              {moment.unix(item.start_at).format("DD-MM-yyyy")}
            </TableCell>
            <TableCell></TableCell>
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

const SubContent = ({ revenueGroup, condition, config, selectedFilter }) => {
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
        onClick={() => handleExcel(selectedFilter)}
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
