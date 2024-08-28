"use client";
import {
  meilisearchGetToken,
  meilisearchReportPaymentHistoryOneGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment-timezone";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const TableView = ({ data, config, isLoading }) => {
  const header = [
    ...new Map(
      data?.map((item) => [
        item["batch_id"],
        {
          batch_id: item.batch_id,
          batch: item.batch,
          school_year: item.school_year,
        },
      ])
    ).values(),
  ];

  let revenue_group;

  if (data) {
    revenue_group = data[0]?.payment_history.map((item) => ({
      id: item.id,
      name: item.name,
      position: item.position,
      revenue_type_id: item.revenue_type_id,
    }));
  }

  // const revenue_group = data[0]?.payment_history.map((item) => ({
  //   id: item.id,
  //   name: item.name,
  //   position: item.position,
  //   revenue_type_id: item.revenue_type_id,
  // }));

  return (
    // <div className="overflow-x-auto">
    <Table
      aria-label="one payment history Table"
      className="max-h-[450px]"
      isStriped
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Nội dung</TableColumn>

        {header
          .reduce(
            (total, curr) => [
              ...total,
              `Ưu đãi, miễn giảm kỳ ${curr.batch} năm ${curr.school_year}`,
              `Số phải nộp kỳ ${curr.batch} năm ${curr.school_year}`,
              `Đã điều chỉnh kỳ ${curr.batch} năm ${curr.school_year}`,
              `Đã hoàn trả kỳ ${curr.batch} năm ${curr.school_year}`,
              `Số đã nộp kỳ ${curr.batch} năm ${curr.school_year}`,
              `Công nợ cuối kỳ ${curr.batch} năm ${curr.school_year}`,
            ],
            []
          )
          .map((item, index) => (
            <TableColumn key={index}>{item}</TableColumn>
          ))}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner color="primary" />}
        emptyContent={"Không có dữ liệu!"}
      >
        {revenue_group
          ?.sort((a, b) => a.position - b.position)
          .map((element) => {
            let rowData = [element.position, element.name];
            header.forEach((el) => {
              const batchData = data.find(
                (item) => item.batch_id === el.batch_id
              );
              const rawData = batchData.payment_history.find(
                (item) => item.id === element.id
              );
              rowData = [
                ...rowData,
                numberWithCommas(rawData.discount, config),
                numberWithCommas(rawData.actual_amount_collected, config),
                numberWithCommas(rawData.amount_edited, config),
                numberWithCommas(rawData.amount_spend, config),
                numberWithCommas(rawData.amount_collected, config),
                numberWithCommas(rawData.next_batch_money, config),
              ];
            });
            return (
              <TableRow key={element.id}>
                {rowData.map((item, index) => {
                  if (index === 1)
                    return (
                      <TableCell key={index} className="whitespace-nowrap">
                        {item}
                      </TableCell>
                    );
                  return <TableCell key={index}>{item}</TableCell>;
                })}
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
    // </div>
  );
};

const Content = ({ student_code, config }) => {
  // const [filter, setFilter] = useState({ start_at: null, end_at: null });
  const data = useQuery({
    queryKey: ["report_payment_history_one"],
    queryFn: async () =>
      meilisearchReportPaymentHistoryOneGet(
        await meilisearchGetToken(),
        `student_code = ${student_code}`
      ),
  });

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("LICH SU THANH TOAN", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    worksheet.addRow(["", "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ"]);
    worksheet.mergeCells("B1:C1");
    const tentruong = worksheet.getCell("B1");
    tentruong.font = { name: "Times New Roman", size: 11 };
    tentruong.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow(["", "", "LỊCH SỬ THANH TOÁN"]);
    worksheet.mergeCells("C2:J2");
    const titleCell = worksheet.getCell("C2");
    titleCell.font = { name: "Times New Roman", size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow(["", "", "(Theo một học sinh)"]);
    worksheet.mergeCells("C3:J3");
    const Ghichu = worksheet.getCell("C3");
    Ghichu.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "FF0000" },
    };
    Ghichu.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([
      "",
      "",
      "Mã học sinh: ……      Họ tên học sinh: ………       Ngày sinh: ………...   Lớp: ……    Mã lớp: …..",
    ]);
    worksheet.mergeCells("C4:J4");
    const tths = worksheet.getCell("B4");
    tths.font = {
      name: "Times New Roman",
      size: 14,
      // color: { argb: "#CC0000" },
      horizontal: "center",
    };
    tths.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([
      "",
      "",
      `Tại ngày ${moment().date()} Tháng ${
        moment().month() + 1
      } Năm ${moment().year()}`,
    ]);
    worksheet.mergeCells("C5:J5");
    const Taingay = worksheet.getCell("C5");
    Taingay.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "#CC0000" },
    };
    Taingay.alignment = { vertical: "middle", horizontal: "center" };

    const header = [
      ...new Map(
        data.data.results.map((item) => [
          item["batch_id"],
          {
            batch_id: item.batch_id,
            batch: item.batch,
            school_year: item.school_year,
          },
        ])
      ).values(),
    ];

    const revenue_group = data?.data?.results[0].payment_history.map(
      (item) => ({
        id: item.id,
        name: item.name,
        position: item.position,
        revenue_type_id: item.revenue_type_id,
      })
    );

    worksheet.addRow([
      "STT",
      "Nội dung",
      ...header.reduce(
        (total, curr) => [
          ...total,
          `Ưu đãi, miễn giảm kỳ ${curr.batch} năm ${curr.school_year}`,
          `Số phải nộp kỳ ${curr.batch} năm ${curr.school_year}`,
          `Đã điều chỉnh kỳ ${curr.batch} năm ${curr.school_year}`,
          `Đã hoàn trả kỳ ${curr.batch} năm ${curr.school_year}`,
          `Số đã nộp kỳ ${curr.batch} năm ${curr.school_year}`,
          `Công nợ cuối kỳ ${curr.batch} năm ${curr.school_year}`,
        ],
        []
      ),
    ]);

    revenue_group
      .sort((a, b) => a.position - b.position)
      .forEach((element) => {
        let rowData = [element.position, element.name];
        header.forEach((el) => {
          const batchData = data.data.results.find(
            (item) => item.batch_id === el.batch_id
          );
          const rawData = batchData.payment_history.find(
            (item) => item.id === element.id
          );
          rowData = [
            ...rowData,
            rawData.discount,
            rawData.actual_amount_collected,
            rawData.amount_edited,
            rawData.amount_spend,
            rawData.amount_collected,
            rawData.next_batch_money,
          ];
        });
        worksheet.addRow(rowData);
      });

    worksheet.addRow([
      "I",
      "Tổng tiền phí, học phí",
      ...header.reduce((total, curr) => {
        const batchData = data.data.results.find(
          (item) => item.batch_id === curr.batch_id
        );
        const detailData = batchData.payment_history.filter(
          (item) => item.revenue_type_id === 1
        );
        return [
          ...total,
          detailData.reduce((total, curr) => total + curr.discount, 0),
          detailData.reduce(
            (total, curr) => total + curr.actual_amount_collected,
            0
          ),
          detailData.reduce((total, curr) => total + curr.amount_edited, 0),
          detailData.reduce((total, curr) => total + curr.amount_spend, 0),
          detailData.reduce((total, curr) => total + curr.amount_collected, 0),
          detailData.reduce((total, curr) => total + curr.next_batch_money, 0),
        ];
      }, []),
    ]);

    worksheet.addRow([
      "II",
      "Tổng tiền thu hộ",
      ...header.reduce((total, curr) => {
        const batchData = data.data.results.find(
          (item) => item.batch_id === curr.batch_id
        );
        const detailData = batchData.payment_history.filter(
          (item) => item.revenue_type_id === 2
        );
        return [
          ...total,
          detailData.reduce((total, curr) => total + curr.discount, 0),
          detailData.reduce(
            (total, curr) => total + curr.actual_amount_collected,
            0
          ),
          detailData.reduce((total, curr) => total + curr.amount_edited, 0),
          detailData.reduce((total, curr) => total + curr.amount_spend, 0),
          detailData.reduce((total, curr) => total + curr.amount_collected, 0),
          detailData.reduce((total, curr) => total + curr.next_batch_money, 0),
        ];
      }, []),
    ]);

    worksheet.addRow([
      "III",
      "Tổng cộng (=I+II)",
      ...header.reduce((total, curr) => {
        const batchData = data.data.results.find(
          (item) => item.batch_id === curr.batch_id
        );
        // const detailData = batchData.payment_history.filter(
        //   (item) => item.revenue_type_id === 2
        // );
        return [
          ...total,
          batchData.payment_history.reduce(
            (total, curr) => total + curr.discount,
            0
          ),
          batchData.payment_history.reduce(
            (total, curr) => total + curr.actual_amount_collected,
            0
          ),
          batchData.payment_history.reduce(
            (total, curr) => total + curr.amount_edited,
            0
          ),
          batchData.payment_history.reduce(
            (total, curr) => total + curr.amount_spend,
            0
          ),
          batchData.payment_history.reduce(
            (total, curr) => total + curr.amount_collected,
            0
          ),
          batchData.payment_history.reduce(
            (total, curr) => total + curr.next_batch_money,
            0
          ),
        ];
      }, []),
    ]);

    // header.forEach((item) => {
    //   let detailData = data.data.results.find(el => el.batch_id === item.batch_id);
    //   worksheet.addRow([de])
    // })

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "Tong-hop-da-thu-1-hs.xlsx");
  };

  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Lịch sử thanh toán theo một học sinh</h5>
      {/* <button className="self-end btn w-fit" onClick={() => handleExcel()}>
        Xuất Excel
      </button> */}
      <button
        className="self-end btn w-fit"
        onClick={() => handleExcel()}
        disabled={data.isLoading && data.isFetching}
      >
        Xuất Excel
      </button>
      <TableView
        data={data?.data?.results}
        config={config}
        isLoading={data.isLoading && data.isFetching}
      />
    </div>
  );
};

export default Content;
