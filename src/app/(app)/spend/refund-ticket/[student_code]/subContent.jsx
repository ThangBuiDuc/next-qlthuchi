"use client";
// import Select from "react-select";
import {
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  Fragment,
  useMemo,
} from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createRefund,
  getTicketStudent,
  getHistoryReceipt,
} from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
import LoadingCustom from "@/app/_component/loadingCustom";
// import { getText } from "number-to-text-vietnamese";
import { useReactToPrint } from "react-to-print";

function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// const Skeleton = () => {
//   return (
//     <>
//       {[...Array(4).keys()].map((item) => (
//         <tr key={item}>
//           {[...Array(13).keys()].map((el) => (
//             <td key={el}>
//               <>
//                 <div className="skeleton h-4 w-full"></div>
//               </>
//             </td>
//           ))}
//         </tr>
//       ))}
//     </>
//   );
// };

const Modal = ({ data, student }) => {
  console.log(data);
  const queryClient = useQueryClient();
  //   const { getToken } = useAuth();
  const { getToken, userId } = useAuth();
  const [mutating, setMutating] = useState(false);

  const money =
    (data.ticket_remain -
      data.ticket.reduce((total, curr) => curr.ticket_count + total, 0)) *
    data.unit_price;
  return (
    <div className="flex flex-col p-2 gap-2">
      <h6 className="col-span-3 text-center">Lập biên lai hoàn trả</h6>
      <>
        <div className="flex flex-col relative justify-center items-center gap-1 mb-5">
          <h5 className="text-center uppercase text-[16px]">
            Bảng kê hoàn trả tiền thừa
          </h5>
          <p className="text-center  text-[14px]">{`(Theo 1 học sinh)`}</p>
          <div className="flex justify-center gap-4 text-[12px]">
            <p>Mã học sinh: {student.code}</p>
            <p>
              Họ và tên học sinh: {`${student.first_name} ${student.last_name}`}
            </p>
            <p>
              Ngày sinh: {student.date_of_birth.split("-").reverse().join("/")}
            </p>
            <p>Lớp: {student.class_name}</p>
          </div>
          <p className="text-[14px]">
            Tại Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
            {moment().year()}
          </p>
          <div className="grid grid-cols-1 w-full border border-black divide-y divide-black">
            <div className="flex   divide-x border-black divide-black">
              <p className=" font-semibold text-[14px] w-[5%] flex justify-center items-center h-full  ">
                TT
              </p>
              <p className=" font-semibold text-[14px] w-[35%] flex justify-center items-center h-full ">
                Nội dung
              </p>
              <p className=" font-semibold text-[12px] w-[20%] flex justify-center items-center h-full ">
                Loại khoản thu
              </p>
              <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center  text-center">{`Số tiền hoàn trả (đồng)`}</p>
              <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full ">
                Ký nhận
              </p>
            </div>
            <div className="grid grid-cols-1 w-full divide-y divide-black divide-dotted">
              <div className="flex   divide-x border-black divide-black">
                <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  I
                </p>
                <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                  Tổng tiền phí, học phí hoàn trả
                </p>
                <p className=" text-[12px] w-[20%] flex justify-center items-center h-full "></p>
                <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                  0
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
              </div>
              <div className="flex   divide-x border-black divide-black">
                <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  1
                </p>
                <p className=" text-[14px] w-[35%] flex  items-center h-full pl-1">
                  Tiền ăn bán trú
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
                  Thu hộ
                </p>
                <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                  {money}
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
              </div>
              <div className="flex   divide-x border-black divide-black">
                <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  II
                </p>
                <p className=" font-semibold  text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                  Tổng tiền thu hộ hoàn trả
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                  {money}
                </p>
                <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
              </div>
              <div className="flex   divide-x divide-black">
                <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  III
                </p>
                <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                  Tổng tiền hoàn trả (=I+II)
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                  {money}
                </p>
                <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
        {mutating ? (
          <span className="loading loading-spinner loading-md self-center"></span>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => handleOnClick()}
          >
            Lưu và in
          </button>
        )}
      </>
    </div>
  );
};

const Item = ({ ticketData, data, ticketAte, ticketCollected }) => {
  return (
    <tr className="hover">
      <td>{data.student_code}</td>
      <td>{`${data.first_name} ${data.last_name}`}</td>
      <td>{data.ticket_remain}</td>
      {ticketCollected.map((item) => (
        <td key={`${data.student_code}${item.code}_thu`}>
          {item.position === data.position ? data.amount : 0}
        </td>
      ))}
      {ticketAte.map((item) => {
        const ticketCount = ticketData
          .filter((el) => el.student_code === data.student_code)
          .find((el) => item.position === el.position);
        return (
          <td key={`${data.student_code}${item.revenue_code}_an`}>
            {ticketCount ? ticketCount.ticket_count : 0}
          </td>
        );
      })}
    </tr>
  );
};

const SubContent = ({ student, selectPresent }) => {
  const { preReceiptIsRefetch, permission } = useContext(listContext);
  const ref = useRef();
  //   const [data, setData] = useState();
  const { getToken } = useAuth();
  const [ticketData, setTicketData] = useState();
  // const { user } = useUser();

  const { data, isFetching, isRefetching } = useQuery({
    queryFn: async () =>
      getTicketStudent(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        {
          student_code: { _eq: student.code },
          batch_id: { _eq: selectPresent.id },
        }
      ),
    queryKey: ["ticket_student", student.code],
  });

  useEffect(() => {
    if (data?.data?.results.length)
      setTicketData(
        data.data.results.reduce(
          (total, curr) => [...total, ...curr.ticket],
          []
        )
      );
  }, [data?.data]);

  if (isFetching || !ticketData) return <LoadingCustom />;

  if (
    data.data.results.length === 0 &&
    data.data.results[0].ticket_remain >
      data.data.results[0].ticket.reduce(
        (total, curr) => total + curr.ticket_count,
        0
      )
  )
    return (
      <div className="flex flex-col">
        <h6 className="text-center">Hiện tại chưa có dữ liệu</h6>
      </div>
    );

  return (
    <div className="flex flex-col p-[20px] gap-[15px]">
      <div className="flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Mã học sinh</th>
                <th>Họ tên học sinh</th>
                <th>Số vé ăn đầu kỳ</th>
                {[
                  ...new Map(
                    data.data.results.map((item) => [item.position, item])
                  ).values(),
                ]
                  .sort((a, b) => a.position - b.position)
                  .map((item) => {
                    return (
                      <th key={`${item.code}_thu`}>
                        Vé ăn đã thu tháng {item.position}
                      </th>
                    );
                  })}
                {[
                  ...new Map(
                    data.data.results
                      .reduce((total, curr) => [...total, ...curr.ticket], [])
                      .map((item) => [item.position, item])
                  ).values(),
                ]
                  .sort((a, b) => a.position - b.position)
                  .map((item) => {
                    return (
                      <th key={`${item.revenue_code}_an`}>
                        Vé ăn đã ăn tháng {item.position}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody>
              {data.data?.results.map((item) => (
                <Fragment key={item.student_code}>
                  <Item
                    ticketData={ticketData}
                    setTicketData={setTicketData}
                    data={item}
                    ticketCollected={[
                      ...new Map(
                        data.data.results.map((item) => [item.position, item])
                      ).values(),
                    ].sort((a, b) => a.position - b.position)}
                    ticketAte={[
                      ...new Map(
                        data.data.results
                          .reduce(
                            (total, curr) => [...total, ...curr.ticket],
                            []
                          )
                          .map((item) => [item.position, item])
                      ).values(),
                    ].sort((a, b) => a.position - b.position)}
                  />
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
          !isFetching || !isRefetching ? (
            <>
              <button
                className="btn w-fit self-center"
                onClick={() => document.getElementById("refund").showModal()}
              >
                Hoàn trả
              </button>
              <dialog id="refund" className="modal">
                <div className="modal-box !min-h-[500px] !max-h-[500px] overflow-y-auto !max-w-4xl">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <Modal data={data.data.results[0]} student={student} />
                </div>
              </dialog>
            </>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SubContent;
