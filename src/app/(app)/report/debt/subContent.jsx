"use client";
import {
  meilisearchGetToken,
  meilisearchReportDebtGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import { useMemo, useState } from "react";
import { Pagination } from "@nextui-org/pagination";
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
  VerticalAlign,
  HeightRule,
} from "docx";
import { getText } from "number-to-text-vietnamese";

// const times = localFont({ src: "../../../../times.ttf" });

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const handleExportDoc = (data, present, school_year, config) => {
  console.log(data);
  const doc = new Document({
    sections: data?.map((item) => ({
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: {
            orientation: PageOrientation.LANDSCAPE,
            width: 8391.6, // 210mm in twips (1mm = 56.7 twips)
            height: 11907, // 297mm in twips
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
              text: "giấy báo công nợ",
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
            new TextRun({
              text: `Tại ngày ${moment().date()} tháng ${
                moment().month() + 1
              } năm ${moment().year()}`,
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
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    type: WidthType.PERCENTAGE,
                    size: 50,
                  },
                  borders: {
                    bottom: {
                      size: 0,
                      color: "ffffff",
                    },
                    top: {
                      size: 0,
                      color: "ffffff",
                    },
                    left: {
                      size: 0,
                      color: "ffffff",
                    },
                    right: {
                      size: 0,
                      color: "ffffff",
                    },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Họ và tên: ${item.first_name} ${item.last_name}`,
                          font: "Times New Roman",
                          size: 24,
                        }),
                        new TextRun({
                          text: `Mã học sinh: ${item.code}`,
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
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    type: WidthType.PERCENTAGE,
                    size: 50,
                  },
                  borders: {
                    bottom: {
                      size: 0,
                      color: "ffffff",
                    },
                    top: {
                      size: 0,
                      color: "ffffff",
                    },
                    left: {
                      size: 0,
                      color: "ffffff",
                    },
                    right: {
                      size: 0,
                      color: "ffffff",
                    },
                  },
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
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
                          font: "Times New Roman",
                          size: 24,
                        }),
                        new TextRun({
                          text: `Lớp ${item.class_code}`,
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
          ],
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "",
            }),
          ],
        }),
        new TableDoc({
          rows: [
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `TT`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Nội dung`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Số tiền (đồng)`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `1`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Công nợ đầu kỳ`,
                          //bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${numberWithCommas(
                            item.sub.reduce(
                              (total, curr) =>
                                total + curr.previous_batch_money,
                              0
                            ),
                            config
                          )}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `2`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Ưu đãi, miễn giảm`,
                          //bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${numberWithCommas(
                            item.sub.reduce(
                              (total, curr) => total + curr.discount,
                              0
                            ),
                            config
                          )}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `3`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Số phải nộp kỳ này`,
                          //bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${numberWithCommas(
                            item.sub.reduce(
                              (total, curr) =>
                                total + curr.actual_amount_collected,
                              0
                            ),
                            config
                          )}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `4`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Số đã điều chỉnh`,
                          //bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${numberWithCommas(
                            item.sub.reduce(
                              (total, curr) => total + curr.amount_edited,
                              0
                            ),
                            config
                          )}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `5`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Số đã hoàn trả`,
                          //bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${numberWithCommas(
                            item.sub.reduce(
                              (total, curr) => total + curr.amount_spend,
                              0
                            ),
                            config
                          )}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `6`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Số đã nộp trong kỳ`,
                          //bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${numberWithCommas(
                            item.sub.reduce(
                              (total, curr) => total + curr.amount_collected,
                              0
                            ),
                            config
                          )}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  rowSpan: 2,
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 10,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `7`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Công nợ còn phải nộp`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCellDoc({
                  verticalAlign: AlignmentType.CENTER,
                  // margins: {
                  //   left: 50,
                  //   right: 50,
                  // },
                  width: {
                    size: 30,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `${numberWithCommas(
                            item.sub.reduce(
                              (total, curr) => total + curr.next_batch_money,
                              0
                            ),
                            config
                          )}`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRowDoc({
              height: {
                value: 350,
                rule: HeightRule.EXACT,
              },
              children: [
                new TableCellDoc({
                  columnSpan: 2,
                  verticalAlign: AlignmentType.CENTER,
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  width: {
                    size: 60,
                    type: WidthType.PERCENTAGE,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.START,
                      children: [
                        new TextRun({
                          text: `Bằng chữ: ${
                            getText(
                              item.sub.reduce(
                                (total, curr) => total + curr.next_batch_money,
                                0
                              )
                            )
                              .charAt(0)
                              .toUpperCase() +
                            getText(
                              item.sub.reduce(
                                (total, curr) => total + curr.next_batch_money,
                                0
                              )
                            ).slice(1)
                          } đồng`,
                          italics: true,
                          font: "Times New Roman",
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
        new Paragraph({
          children: [
            new TextRun({
              text: "",
            }),
          ],
        }),
        new TableDoc({
          rows: [
            new TableRowDoc({
              children: [
                new TableCellDoc({
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    type: WidthType.PERCENTAGE,
                    size: 50,
                  },
                  borders: {
                    bottom: {
                      size: 0,
                      color: "ffffff",
                    },
                    top: {
                      size: 0,
                      color: "ffffff",
                    },
                    left: {
                      size: 0,
                      color: "ffffff",
                    },
                    right: {
                      size: 0,
                      color: "ffffff",
                    },
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Kế toán`,
                          bold: true,
                          font: "Times New Roman",
                          size: 24,
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
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    type: WidthType.PERCENTAGE,
                    size: 50,
                  },
                  borders: {
                    bottom: {
                      size: 0,
                      color: "ffffff",
                    },
                    top: {
                      size: 0,
                      color: "ffffff",
                    },
                    left: {
                      size: 0,
                      color: "ffffff",
                    },
                    right: {
                      size: 0,
                      color: "ffffff",
                    },
                  },
                  margins: {
                    left: 50,
                    right: 50,
                  },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: {
                        before: 40,
                        after: 40,
                      },
                      children: [
                        new TextRun({
                          text: `Hình thức đóng tiền: `,
                          bold: true,
                          font: "Times New Roman",
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
    saveAs(new Blob([buffer]), "giay-bao-cong-no.docx");
  });
};

const TableView = ({ data, config, isLoading }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = Number(config.result[0].config.page.value);

  const pages = Math.ceil(data.data?.results.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.data?.results.slice(start, end);
  }, [page, data]);

  return (
    <Table
      aria-label="debt Table"
      className="max-h-[450px]"
      isStriped
      isHeaderSticky
      bottomContent={
        !isLoading && (
          <div className="flex w-full justify-center">
            <Pagination
              color="primary"
              isCompact
              showControls
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
        <TableColumn>Mã sinh viên</TableColumn>
        <TableColumn>Họ tên sinh viên</TableColumn>
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
        {items?.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{++index}</TableCell>
            <TableCell>{item.code}</TableCell>
            <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
            <TableCell>
              {numberWithCommas(
                item.sub.reduce(
                  (total, curr) => total + curr.previous_batch_money,
                  0
                ),
                config
              )}
            </TableCell>
            <TableCell>
              {numberWithCommas(
                item.sub.reduce((total, curr) => total + curr.discount, 0),
                config
              )}
            </TableCell>
            <TableCell>
              {numberWithCommas(
                item.sub.reduce(
                  (total, curr) => total + curr.actual_amount_collected,
                  0
                ),
                config
              )}
            </TableCell>
            <TableCell>
              {numberWithCommas(
                item.sub.reduce((total, curr) => total + curr.amount_edited, 0),
                config
              )}
            </TableCell>
            <TableCell>
              {numberWithCommas(
                item.sub.reduce((total, curr) => total + curr.amount_spend, 0),
                config
              )}
            </TableCell>
            <TableCell>
              {numberWithCommas(
                item.sub.reduce(
                  (total, curr) => total + curr.amount_collected,
                  0
                ),
                config
              )}
            </TableCell>
            <TableCell>
              {numberWithCommas(
                item.sub.reduce(
                  (total, curr) => total + curr.next_batch_money,
                  0
                ),
                config
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
const SubContent = ({ present, config, school_year }) => {
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
      <>
        <div className="flex justify-end gap-2">
          <button
            className="btn w-fit"
            disabled={data.isFetching && data.isLoading}
            onClick={() =>
              handleExportDoc(data.data?.results, present, school_year, config)
            }
          >
            Xuất Giấy báo
          </button>
          <button
            className="btn w-fit"
            onClick={() => handleExcel()}
            disabled={data.isFetching && data.isLoading}
          >
            Xuất Excel
          </button>
        </div>
        {/* <div className="overflow-x-auto"> */}
        {/* </div> */}
        <TableView
          data={data}
          isLoading={data.isFetching && data.isLoading}
          config={config}
        />
      </>
    </div>
  );
};

export default SubContent;
