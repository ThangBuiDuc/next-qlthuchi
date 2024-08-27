"use client";
import { listContext } from "./content";
import { Fragment, useContext, useEffect, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
// import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import {
  getTicketStudent,
  updateExpectedRevenue,
  //   updateTicket,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import LoadingCustom from "@/app/_component/loadingCustom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Item = ({ ticketData, data, ticketAte, ticketCollected }) => {
  return (
    <tr className="hover">
      <td>{data.student_code}</td>
      <th className="whitespace-nowrap">{`${data.first_name} ${data.last_name}`}</th>
      <td>{data.ticket_remain}</td>
      {ticketCollected.map((item) => (
        <td key={`${data.student_code}${item.code}_thu`}>
          {item.month === data.month ? data.amount : 0}
        </td>
      ))}
      {ticketAte.map((item) => {
        const ticketCount = ticketData
          .filter((el) => el.student_code === data.student_code)
          .find((el) => item.month === el.month);
        return (
          <td key={`${data.student_code}${item.revenue_code}_an`}>
            {ticketCount.ticket_count}
          </td>
        );
      })}
    </tr>
  );
};

const SubContent = ({ selected }) => {
  const queryClient = useQueryClient();
  const [mutating, setMutating] = useState(false);
  const [ticketData, setTicketData] = useState();
  // const { user } = useUser();
  const { selectPresent, permission, school_year } = useContext(listContext);
  const { getToken, userId } = useAuth();
  //   const [error, setError] = useState([]);
  // console.log(selected);
  const { data, isFetching, isRefetching } = useQuery({
    queryFn: async () =>
      getTicketStudent(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        {
          class_code: { _eq: selected.name },
          batch_id: { _eq: selectPresent.id },
          ticket_remain: { _gt: 0 },
          ticket_refund: { _eq: false },
          next_batch_money: { _eq: 0 },
        }
      ),
    queryKey: ["ticket_student", selected],
  });

  //   useEffect(() => {
  //     if (data?.data?.results.length && ticketData) {
  //       setError(
  //         data.data.results.reduce(
  //           (total, curr) =>
  //             curr.amount <
  //             ticketData
  //               .filter((item) => item.student_code === curr.student_code)
  //               .reduce((t, c) => t + c.ticket_count, 0)
  //               ? [...total, curr.student_code]
  //               : total,
  //           []
  //         )
  //       );
  //     }
  //   }, [ticketData]);

  useEffect(() => {
    if (data?.data?.results.length)
      setTicketData(
        data.data.results.reduce(
          (total, curr) => [...total, ...curr.ticket],
          []
        )
      );
  }, [data?.data]);

  const mutation = useMutation({
    mutationFn: async ({ data, time }) =>
      updateExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        data.map((item) => ({
          _set: {
            ticket_remain: 0,
            updated_by: userId,
            updated_at: time,
            amount_edited: item.ticket_remain * item.unit_price * -1,
            amount_spend: item.ticket_remain * item.unit_price,
            next_batch_money: 0,
            ticket_refund: true,
          },
          where: { id: { _eq: item.id } },
        }))
      ),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["get_revenue_norms", selected],
      // });
      queryClient.invalidateQueries({ queryKey: ["ticket_student", selected] });
      toast.success("Hoàn trả vé ăn cho lớp học thành công!", {
        month: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setMutating(false);
      handleExcel();
    },
    onError: () => {
      toast.error("Hoàn trả vé ăn cho lớp học không thành công!", {
        month: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      }),
        setMutating(false);
    },
  });

  const handleOnclick = useCallback(async () => {
    setMutating(true);
    let time = moment().format();

    mutation.mutate({ data: data.data.results, time });
  }, [data]);

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(selected.name);

    worksheet.mergeCells("B1:C1");
    const tentruong = worksheet.getCell("B1");
    tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
    tentruong.font = { name: "Times New Roman", size: 11 };
    tentruong.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C2:J2");
    const titleCell = worksheet.getCell("G2");
    titleCell.value = "QUYẾT TOÁN TIỀN ĂN HỌC SINH";
    titleCell.font = { name: "Times New Roman", size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C3:J3");
    const Ghichu = worksheet.getCell("G3");
    Ghichu.value = `Học kỳ ${selectPresent.batch} Năm học ${school_year}`;
    Ghichu.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "FF0000" },
    };
    Ghichu.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("C4:J4");
    const Taingay = worksheet.getCell("G4");
    Taingay.value = `Tại ngày ${moment().days()} Tháng ${
      moment().month() + 1
    } Năm ${moment().year()}`;
    Taingay.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "#CC0000" },
    };
    Taingay.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([]);
    worksheet.addRow([
      "STT",
      "Mã học sinh",
      "Họ và tên học sinh",
      "Ngày sinh",
      "Lớp",
      "Mã lớp",
      ...[
        ...new Map(
          data.data.results.map((item) => [item.month, item])
        ).values(),
      ]
        .sort((a, b) => a.month - b.month)
        .map((item) => `Số Vé ăn đã thu tháng ${item.month}`),
      ...[
        ...new Map(
          data.data.results
            .reduce((total, curr) => [...total, ...curr.ticket], [])
            .map((item) => [item.month, item])
        ).values(),
      ]
        .sort((a, b) => a.month - b.month)
        .map((item) => `Số Vé ăn đã ăn tháng ${item.month}`),
      "Số vé còn thừa cuối kỳ",
      "Đơn giá ăn",
      "Tiền ăn thừa trả lại",
    ]);

    const ticketCollected = [
      ...new Map(data.data.results.map((item) => [item.month, item])).values(),
    ].sort((a, b) => a.month - b.month);

    const ticketAte = [
      ...new Map(
        data.data.results
          .reduce((total, curr) => [...total, ...curr.ticket], [])
          .map((item) => [item.month, item])
      ).values(),
    ].sort((a, b) => a.month - b.month);

    data?.data?.results.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.student_code,
        `${item.first_name} ${item.last_name}`,
        item.date_of_birth.split("-").reverse().join("-"),
        selected.name[0],
        selected.name.substring(1),
        ...ticketCollected.map(
          (el) => `${el.month === item.month ? item.amount : 0}`
        ),
        ...ticketAte.map((el) => {
          const ticketCount = ticketData
            .filter((el1) => el1.student_code === item.student_code)
            .find((el1) => el1.month === el.month);
          return `${ticketCount.ticket_count}`;
        }),
        item.ticket_remain,
        item.unit_price,
        item.ticket_remain * item.unit_price,
      ]);
    });

    const blob = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([blob]), "Quyet-toan-tien-an.xlsx");
  };

  if (isFetching) return <LoadingCustom />;

  if (data.data.results.length === 0)
    return (
      <div className="flex flex-col">
        <h6 className="text-center">Hiện tại chưa có dữ liệu</h6>
      </div>
    );

  if (!ticketData) return <LoadingCustom />;

  // console.log(data.data.results);
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto !max-h-[450px]">
        <table className="table  table-pin-cols table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <td>Mã học sinh</td>
              <th>Họ tên học sinh</th>
              <td>Số vé ăn còn lại</td>
              {[
                ...new Map(
                  data.data.results.map((item) => [item.month, item])
                ).values(),
              ]
                .sort((a, b) => a.month - b.month)
                .map((item) => {
                  return (
                    <td key={`${item.code}_thu`}>
                      Số Vé ăn đã thu tháng {item.month}
                    </td>
                  );
                })}
              {[
                ...new Map(
                  data.data.results
                    .reduce((total, curr) => [...total, ...curr.ticket], [])
                    .map((item) => [item.month, item])
                ).values(),
              ]
                .sort((a, b) => a.month - b.month)
                .map((item) => {
                  return (
                    <td key={`${item.revenue_code}_an`}>
                      Số Vé ăn đã ăn tháng {item.month}
                    </td>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {data.data?.results.map((item) => (
              <Fragment key={item.student_code}>
                <Item
                  ticketData={ticketData}
                  data={item}
                  ticketCollected={[
                    ...new Map(
                      data.data.results.map((item) => [item.month, item])
                    ).values(),
                  ].sort((a, b) => a.month - b.month)}
                  ticketAte={[
                    ...new Map(
                      data.data.results
                        .reduce((total, curr) => [...total, ...curr.ticket], [])
                        .map((item) => [item.month, item])
                    ).values(),
                  ].sort((a, b) => a.month - b.month)}
                />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {!isFetching || !isRefetching ? (
        mutating ? (
          <LoadingCustom style={"loading-xs"} />
        ) : permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
          <>
            <button
              className="btn w-fit self-center"
              onClick={() => handleOnclick()}
            >
              Hoàn trả
            </button>
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubContent;
