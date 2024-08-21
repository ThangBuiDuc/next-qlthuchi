"use client";
import { meilisearchGetToken, meilisearchNoticeGet } from "@/utils/funtionApi";
// import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { saveAs } from "file-saver";
import {
  AlignmentType,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  SectionType,
  TextRun,
  Table as TableDoc,
  TableRow as TableRowDoc,
  TableCell as TableCellDoc,
  WidthType,
  BorderStyle,
} from "docx";

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const TableView = ({
  notice,
  isLoading,
  config,
  selectedKeys,
  setSelectedKeys,
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = Number(config?.result[0].config.page.value);

  const pages = Math.ceil(notice?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return notice?.slice(start, end);
  }, [page, notice]);

  useEffect(() => {
    setPage(1);
  }, [notice]);

  return (
    <Table
      aria-label="notice table"
      selectionMode="multiple"
      className="h-[450px]"
      // removeWrapper
      isStriped
      isHeaderSticky
      color="primary"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      bottomContent={
        !isLoading &&
        items && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              // showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )
      }
    >
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Mã học sinh</TableColumn>
        <TableColumn>Họ và tên</TableColumn>
        <TableColumn>Ngày sinh</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Không tìm thấy kết quả tìm kiếm!"
        loadingContent={<Spinner color="primary" />}
        isLoading={isLoading}
      >
        {items?.map((item, index) => {
          return (
            <TableRow key={item.student_code}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.student_code}</TableCell>
              <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
              <TableCell>
                {item.date_of_birth.split("-").reverse().join("-")}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const handleExportDoc = (data, present, school_year, config) => {
  const doc = new Document({
    sections: data.map((item) => ({
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: {
            orientation: PageOrientation.PORTRAIT,
            width: 11906, // 210mm in twips (1mm = 56.7 twips)
            height: 16838, // 297mm in twips
          },
          margin: {
            top: 340.2,
            left: 340.2,
            right: 340.2,
            bottom: 567,
          },
        },
      },
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "giấy báo đóng tiền",
              allCaps: true,
              bold: true,
              font: "Times New Roman",
              size: 30,
            }),
            new TextRun({
              text: `Học kỳ ${present.batch} năm học ${school_year}`,
              break: 1,
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            line: 1.5 * 240,
          },
        }),
        new TableDoc({
          rows: [
            new TableRowDoc({
              children: [
                new TableCellDoc({
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Họ và tên: ${item.first_name} ${item.last_name}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                        new TextRun({
                          text: `Mã học sinh: ${item.student_code}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                          break: 1,
                        }),
                      ],
                      spacing: {
                        before: 40,
                        after: 40,
                      },
                    }),
                  ],
                }),
                new TableCellDoc({
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      spacing: {
                        before: 40,
                        after: 40,
                      },
                      children: [
                        new TextRun({
                          text: `Ngày sinh: ${item.date_of_birth
                            .split("-")
                            .reverse()
                            .join("-")}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                        new TextRun({
                          text: `Lớp ${item.class_code}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                          break: 1,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              children: [
                new TableCellDoc({
                  columnSpan: 2,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      spacing: {
                        before: 40,
                      },
                      children: [
                        new TextRun({
                          text: `I. Công nợ đầu kỳ: ${numberWithCommas(
                            item.expected_revenues.reduce(
                              (t, c) =>
                                t + c.previous_batch_money
                                  ? c.previous_batch_money
                                  : 0,
                              0
                            ),
                            config
                          )} đồng`,
                          bold: true,
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              children: [
                new TableCellDoc({
                  borders: {
                    bottom: { style: BorderStyle.DOTTED },
                  },
                  columnSpan: 2,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      spacing: {
                        before: 40,
                      },
                      children: [
                        new TextRun({
                          text: `II. Số phải nộp kỳ này: ${numberWithCommas(
                            item.expected_revenues.reduce(
                              (t, c) =>
                                t + c.next_batch_money
                                  ? t + c.next_batch_money
                                  : 0,
                              0
                            ),
                            config
                          )} đồng, chi tiết`,
                          bold: true,
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            ...item.expected_revenues
              .sort((a, b) => a.position - b.position)
              .map(
                (el) =>
                  new TableRowDoc({
                    children: [
                      new TableCellDoc({
                        borders: {
                          top: {
                            style: BorderStyle.DOTTED,
                          },
                          bottom: {
                            style:
                              el.position === item.expected_revenues.length
                                ? BorderStyle.SINGLE
                                : BorderStyle.DOTTED,
                          },
                        },
                        margins: {
                          left: 50,
                          right: 50,
                        },
                        children: [
                          new Paragraph({
                            spacing: {
                              before: 40,
                            },
                            children: [
                              new TextRun({
                                text: `${el.position}. ${el.name}:`,

                                size: 24,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCellDoc({
                        borders: {
                          top: {
                            style: BorderStyle.DOTTED,
                          },
                          bottom: {
                            style:
                              el.position === item.expected_revenues.length
                                ? BorderStyle.SINGLE
                                : BorderStyle.DOTTED,
                          },
                        },

                        margins: {
                          left: 50,
                          right: 50,
                        },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            spacing: {
                              before: 40,
                            },
                            children: [
                              new TextRun({
                                text: `${numberWithCommas(
                                  el.next_batch_money ? el.next_batch_money : 0,
                                  config
                                )} đ`,

                                size: 24,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            new TableRowDoc({
              children: [
                new TableCellDoc({
                  columnSpan: 2,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      spacing: {
                        before: 40,
                      },
                      children: [
                        new TextRun({
                          text: `III. Số đã nộp trong kỳ: ${numberWithCommas(
                            item.expected_revenues.reduce(
                              (t, c) =>
                                t + c.amount_collected
                                  ? t + c.amount_collected
                                  : 0,
                              0
                            ),
                            config
                          )} đồng`,
                          bold: true,
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              children: [
                new TableCellDoc({
                  columnSpan: 2,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      spacing: {
                        before: 40,
                      },
                      children: [
                        new TextRun({
                          text: `IV. Công nợ còn phải nộp: ${numberWithCommas(
                            item.expected_revenues.reduce(
                              (t, c) =>
                                t + c.next_batch_money
                                  ? t + c.next_batch_money
                                  : 0,
                              0
                            ),
                            config
                          )} đồng`,
                          bold: true,
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              children: [
                new TableCellDoc({
                  borders: {
                    bottom: { style: BorderStyle.NIL },
                    top: { style: BorderStyle.NIL },
                    left: { style: BorderStyle.NIL },
                    right: { style: BorderStyle.NIL },
                  },
                  // columnSpan: 2,
                  margins: {
                    left: 50,
                    right: 50,
                    bottom: 50,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: {
                        before: 40,
                      },
                      children: [
                        new TextRun({
                          text: `Người lập`,
                          bold: true,
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        }),
      ],
    })),
  });
  // data.forEach((el) => {
  //   doc.addSection({
  //     properties: {
  //       type: SectionType.CONTINUOUS,
  //       page: {
  //         size: {
  //           orientation: PageOrientation.PORTRAIT,
  //           width: 11906, // 210mm in twips (1mm = 56.7 twips)
  //           height: 16838, // 297mm in twips
  //         },
  //         margin: {
  //           top: 340.2,
  //           left: 340.2,
  //           right: 340.2,
  //           bottom: 567,
  //         },
  //       },
  //     },
  //     children: [
  //       new Paragraph({
  //         children: [
  //           new TextRun({
  //             text: "giấy báo đóng tiền",
  //             allCaps: true,
  //             bold: true,
  //             font: "Times New Roman",
  //             size: 30,
  //           }),
  //           new TextRun({
  //             text: "Học kỳ ... năm học 202... - 202...",
  //             break: 1,
  //             size: 24,
  //           }),
  //         ],
  //         alignment: AlignmentType.CENTER,
  //         spacing: {
  //           line: 1.5 * 240,
  //         },
  //       }),
  //       new TableDoc({
  //         rows: [
  //           new TableRowDoc({
  //             children: [
  //               new TableCellDoc({
  //                 children: [
  //                   new TextRun({
  //                     text: "Họ và tên học sinh ",
  //                     bold: true,
  //                     font: "Times New Roman",
  //                     size: 24,
  //                   }),
  //                 ],
  //               }),
  //               new TableCellDoc({
  //                 children: [
  //                   new TextRun({
  //                     text: "Ngày sinh ",
  //                     bold: true,
  //                     font: "Times New Roman",
  //                     size: 24,
  //                   }),
  //                 ],
  //               }),
  //             ],
  //           }),
  //         ],
  //         width: {
  //           size: 100,
  //           type: WidthType.PERCENTAGE,
  //         },
  //       }),
  //     ],
  //   });
  // });

  Packer.toBuffer(doc).then((buffer) => {
    saveAs(new Blob([buffer]), "giay-bao-dong-tien.docx");
  });
};

const Content = ({ listSearch, present, config, revenueGroup }) => {
  // console.log(config);
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelectedKeys(new Set([]));
  }, [selected]);
  // console.log(selectedKeys === "all");
  // const { getToken } = useAuth();
  const {
    data: notice,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: async () =>
      meilisearchNoticeGet(
        await meilisearchGetToken(),
        `batch_id = ${selectPresent.id} AND class_code = ${selected.value}`
      ),
    queryKey: ["notice", selectPresent.id, selected],
    enabled: selected ? true : false,
  });

  // console.log(selectedKeys);
  // console.log(notice);

  return (
    <div className="flex flex-col gap-5 justify-center">
      <div className={`justify-center items-center flex gap-1 `}>
        <h6>
          Học kỳ {selectPresent.batch} - Năm học {present.result[0].school_year}
        </h6>
      </div>
      <div className={`w-[50%] flex flex-col gap-1`}>
        <p className="text-xs font-semibold">Lớp:</p>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Lớp!"
          isClearable
          options={listSearch.classes
            .sort(
              (a, b) =>
                a.class_level_code - b.class_level_code ||
                a.code.localeCompare(b.code)
            )
            .map((item) => ({
              ...item,
              value: item.name,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => setSelected(e)}
          className="text-black w-full"
          classNames={{
            // control: () => "!rounded-[5px]",
            // input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            // valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[21]",
          }}
        />
      </div>

      <button
        disabled={selectedKeys.size === 0}
        className="btn w-fit self-end"
        onClick={() =>
          handleExportDoc(
            selectedKeys === "all"
              ? notice
              : notice.reduce(
                  (total, curr) =>
                    selectedKeys.has(curr.student_code)
                      ? [...total, curr]
                      : total,
                  []
                ),
            selectPresent,
            present.result[0].school_year,
            config
          )
        }
      >
        Xuất giấy báo
      </button>

      <TableView
        notice={notice}
        isLoading={isFetching && isLoading}
        config={config}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />
    </div>
  );
};

export default Content;
