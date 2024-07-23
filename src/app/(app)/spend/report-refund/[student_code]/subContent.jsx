"use client";
// import Select from "react-select";
import {
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  Fragment,
  // useMemo,
} from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import { useQueryClient, useQuery } from "@tanstack/react-query";
// import { toast } from "react-toastify";
import {
  // createRefund,
  getExpectedRevenue,
  // getHistoryReceipt,
} from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
// import { getText } from "number-to-text-vietnamese";
// import { useReactToPrint } from "react-to-print";
import { LiaFileExportSolid } from "react-icons/lia";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4).keys()].map((item) => (
        <tr key={item}>
          {[...Array(13).keys()].map((el) => (
            <td key={el}>
              <>
                <div className="skeleton h-4 w-full"></div>
              </>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// const Modal = ({ data, modalRef }) => {
//   const ref = useRef();
//   const { selectPresent, student, config } = useContext(listContext);
//   const { getToken } = useAuth();
//   const queryClient = useQueryClient();
//   const { user } = useUser();
//   const showData = {
//     part1: data.filter((item) => item.revenue_type.id === 1),
//     part2: data.filter((item) => item.revenue_type.id === 2),
//     totalPart1: data
//       .filter((item) => item.revenue_type.id === 1)
//       .reduce((total, curr) => total + curr.nowMoney, 0),
//     totalPart2: data
//       .filter((item) => item.revenue_type.id === 2)
//       .reduce((total, curr) => total + curr.nowMoney, 0),
//     total:
//       data
//         .filter((item) => item.revenue_type.id === 1)
//         .reduce((total, curr) => total + curr.nowMoney, 0) +
//       data
//         .filter((item) => item.revenue_type.id === 2)
//         .reduce((total, curr) => total + curr.nowMoney, 0),
//   };

//   const [mutating, setMutating] = useState(false);
//   const handlePrint = useReactToPrint({
//     content: () => ref.current,
//   });

//   const mutation = useMutation({
//     mutationFn: async (objects) =>
//       createRefund(
//         await getToken({
//           template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
//         }),
//         objects
//       ),
//     onSuccess: () => {
//       setMutating(false);
//       modalRef.current.close();
//       toast.success("Lập biên lai hoàn trả thành công!", {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         theme: "light",
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["get_expected_revenue", student.code],
//       });

//       handlePrint();
//     },
//     onError: () => {
//       setMutating(false);
//       modalRef.current.close();
//       toast.error("Lập biên lai hoàn trả không thành công!", {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         theme: "light",
//       });
//     },
//   });

//   const handleOnClick = () => {
//     setMutating(true);
//     const time = moment().format();
//     const objects = {
//       amount_spend: data.reduce((total, item) => total + item.nowMoney, 0),
//       batch_id: selectPresent.id,
//       created_by: user.id,
//       start_at: time,
//       student_code: student.code,
//       schoolyear_student_id: student.schoolyear_student_id,
//       refund_details: {
//         data: data
//           .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
//           .map((item) => ({
//             amount_spend: item.nowMoney,
//             batch_id: selectPresent.id,
//             created_by: user.id,
//             expected_revenue_id: item.id,
//             start_at: time,
//           })),
//       },
//     };
//     mutation.mutate(objects);
//   };

//   return (
//     <div className="flex flex-col p-2 gap-2">
//       <h6 className="col-span-3 text-center">Lập biên lai hoàn trả</h6>
//       <>
//         <div className="flex flex-col relative justify-center items-center gap-1 mb-5">
//           <h5 className="text-center uppercase text-[16px]">
//             Bảng kê hoàn trả tiền thừa
//           </h5>
//           <p className="text-center  text-[14px]">{`(Theo 1 học sinh)`}</p>
//           <div className="flex justify-center gap-4 text-[12px]">
//             <p>Mã học sinh: {student.code}</p>
//             <p>
//               Họ và tên học sinh: {`${student.first_name} ${student.last_name}`}
//             </p>
//             <p>
//               Ngày sinh: {student.date_of_birth.split("-").reverse().join("/")}
//             </p>
//             <p>Lớp: {student.class_name}</p>
//           </div>
//           <p className="text-[14px]">
//             Tại Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
//             {moment().year()}
//           </p>
//           <div className="grid grid-cols-1 w-full border border-black divide-y divide-black">
//             <div className="flex   divide-x border-black divide-black">
//               <p className=" font-semibold text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                 TT
//               </p>
//               <p className=" font-semibold text-[14px] w-[35%] flex justify-center items-center h-full ">
//                 Nội dung
//               </p>
//               <p className=" font-semibold text-[12px] w-[20%] flex justify-center items-center h-full ">
//                 Loại khoản thu
//               </p>
//               <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center  text-center">{`Số tiền hoàn trả (đồng)`}</p>
//               <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full ">
//                 Ký nhận
//               </p>
//             </div>
//             <div className="grid grid-cols-1 w-full divide-y divide-black divide-dotted">
//               {showData.part1.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="flex  divide-x border-black divide-black"
//                 >
//                   <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                     {++index}
//                   </p>
//                   <p className=" text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                     {item.name}
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
//                     {item.revenue_type.name}
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                     {numberWithCommas(item.nowMoney, config)}
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                 </div>
//               ))}
//               <div className="flex   divide-x border-black divide-black">
//                 <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                   I
//                 </p>
//                 <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                   Tổng tiền phí, học phí hoàn trả
//                 </p>
//                 <p className=" text-[12px] w-[20%] flex justify-center items-center h-full "></p>
//                 <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                   {showData.totalPart1
//                     ? numberWithCommas(showData.totalPart1, config)
//                     : showData.totalPart1}
//                 </p>
//                 <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//               </div>
//               {showData.part2.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="flex   divide-x border-black divide-black"
//                 >
//                   <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                     {++index}
//                   </p>
//                   <p className=" text-[14px] w-[35%] flex justify-center items-center h-full pl-1">
//                     {item.name}
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
//                     {item.revenue_type.name}
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center  text-center pr-1">
//                     {numberWithCommas(item.nowMoney, config)}
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                 </div>
//               ))}
//               <div className="flex   divide-x border-black divide-black">
//                 <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                   II
//                 </p>
//                 <p className=" font-semibold  text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                   Tổng tiền thu hộ hoàn trả
//                 </p>
//                 <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                 <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                   {showData.totalPart2
//                     ? numberWithCommas(showData.totalPart2, config)
//                     : showData.totalPart2}
//                 </p>
//                 <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//               </div>
//               <div className="flex   divide-x divide-black">
//                 <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                   III
//                 </p>
//                 <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                   Tổng tiền hoàn trả (=I+II)
//                 </p>
//                 <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                 <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                   {showData.total
//                     ? numberWithCommas(showData.total, config)
//                     : showData.total}
//                 </p>
//                 <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//               </div>
//             </div>
//           </div>
//           {/* <div
//             className={`grid ${
//               (formality.value === 2 && "grid-cols-3") ||
//               (formality.value === 1 && "grid-cols-2")
//             } auto-rows-auto w-full hidden`}
//           >
//             <p className="text-center font-semibold ">Người lập</p>
//             {formality.value === 2 && (
//               <>
//                 <p className="text-center font-semibold">Người nộp tiền</p>
//                 <p className="text-center font-semibold">Người thu tiền</p>
//               </>
//             )}
//             {formality.value === 1 && (
//               <>
//                 <p className="text-center font-semibold">Ngân hàng thu</p>
//               </>
//             )}
//           </div> */}
//         </div>

//         {/* PRINT DIV */}
//         <div className="hidden">
//           <div
//             ref={ref}
//             className="flex flex-col relative justify-center items-center gap-1 mb-5"
//           >
//             <h5 className="text-center uppercase text-[16px]">
//               Bảng kê hoàn trả tiền thừa
//             </h5>
//             <p className="text-center  text-[14px]">{`(Theo 1 học sinh)`}</p>
//             <div className="flex justify-center gap-4 text-[12px]">
//               <p>Mã học sinh: {student.code}</p>
//               <p>
//                 Họ và tên học sinh:{" "}
//                 {`${student.first_name} ${student.last_name}`}
//               </p>
//               <p>
//                 Ngày sinh:{" "}
//                 {student.date_of_birth.split("-").reverse().join("/")}
//               </p>
//               <p>Lớp: {student.class_name}</p>
//             </div>
//             <p className="text-[14px]">
//               Tại Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
//               {moment().year()}
//             </p>
//             <div className="grid grid-cols-1 w-full border border-black divide-y divide-black">
//               <div className="flex   divide-x border-black divide-black">
//                 <p className=" font-semibold text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                   TT
//                 </p>
//                 <p className=" font-semibold text-[14px] w-[35%] flex justify-center items-center h-full ">
//                   Nội dung
//                 </p>
//                 <p className=" font-semibold text-[12px] w-[20%] flex justify-center items-center h-full ">
//                   Loại khoản thu
//                 </p>
//                 <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center  text-center">{`Số tiền hoàn trả (đồng)`}</p>
//                 <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full ">
//                   Ký nhận
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 w-full divide-y divide-black divide-dotted">
//                 {showData.part1.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className="flex  divide-x border-black divide-black"
//                   >
//                     <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                       {++index}
//                     </p>
//                     <p className=" text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                       {item.name}
//                     </p>
//                     <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
//                       {item.revenue_type.name}
//                     </p>
//                     <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                       {numberWithCommas(item.nowMoney, config)}
//                     </p>
//                     <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                   </div>
//                 ))}
//                 <div className="flex   divide-x border-black divide-black">
//                   <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                     I
//                   </p>
//                   <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                     Tổng tiền phí, học phí hoàn trả
//                   </p>
//                   <p className=" text-[12px] w-[20%] flex justify-center items-center h-full "></p>
//                   <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                     {showData.totalPart1
//                       ? numberWithCommas(showData.totalPart1, config)
//                       : showData.totalPart1}
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                 </div>
//                 {showData.part2.map((item, index) => (
//                   <div
//                     key={item.id}
//                     className="flex   divide-x border-black divide-black"
//                   >
//                     <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                       {++index}
//                     </p>
//                     <p className=" text-[14px] w-[35%] flex justify-center items-center h-full pl-1">
//                       {item.name}
//                     </p>
//                     <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
//                       {item.revenue_type.name}
//                     </p>
//                     <p className=" text-[14px] w-[20%] flex justify-center items-center  text-center pr-1">
//                       {numberWithCommas(item.nowMoney, config)}
//                     </p>
//                     <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                   </div>
//                 ))}
//                 <div className="flex   divide-x border-black divide-black">
//                   <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                     II
//                   </p>
//                   <p className=" font-semibold  text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                     Tổng tiền thu hộ hoàn trả
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                   <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                     {showData.totalPart2
//                       ? numberWithCommas(showData.totalPart2, config)
//                       : showData.totalPart2}
//                   </p>
//                   <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                 </div>
//                 <div className="flex   divide-x divide-black">
//                   <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
//                     III
//                   </p>
//                   <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
//                     Tổng tiền hoàn trả (=I+II)
//                   </p>
//                   <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                   <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
//                     {showData.total
//                       ? numberWithCommas(showData.total, config)
//                       : showData.total}
//                   </p>
//                   <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
//                 </div>
//               </div>
//             </div>
//             <p className="italic text-right">
//               Hải Phòng, ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
//               {moment().year()}
//             </p>
//             <div className="flex justify-center w-full">
//               <p className="font-semibold">Thủ trưởng</p>
//               <p className="font-semibold">Kế toán trưởng</p>
//               <p className="font-semibold">Người lập</p>
//             </div>
//           </div>
//         </div>

//         {/* </div> */}
//         {mutating ? (
//           <span className="loading loading-spinner loading-md self-center"></span>
//         ) : (
//           <button
//             className="btn w-fit self-center"
//             onClick={() => handleOnClick()}
//           >
//             Lưu và in
//           </button>
//         )}
//       </>
//     </div>
//   );
// };

const Item = ({ data, index, setData, revenue_type, i, group_id }) => {
  const { selectPresent, student, config } = useContext(listContext);
  // const { getToken } = useAuth();
  // const where = useMemo(
  //   () => ({
  //     where: {
  //       batch_id: { _eq: selectPresent.id },
  //       student_code: { _eq: student.code },
  //       receipt_details: { expected_revenue_id: { _eq: data.id } },
  //     },
  //     where1: {
  //       expected_revenue_id: { _eq: data.id },
  //     },
  //   }),
  //   []
  // );
  // const historyData = useQuery({
  //   queryFn: async () =>
  //     getHistoryReceipt(
  //       await getToken({
  //         template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
  //       }),
  //       where.where,
  //       where.where1
  //     ),
  //   queryKey: ["get_history_receipt", where],
  // });

  // const amount_collected_ref = useRef();
  return (
    <tr className="hover">
      <td className={`${typeof i === "number" ? "text-right" : ""}`}>
        {typeof i === "number" ? `${index + 1}.${i + 1}` : index + 1}
      </td>
      <td>{data.revenue.name}</td>
      <td>{revenue_type.name}</td>
      <td>{numberWithCommas(data.previous_batch_money, config)} ₫</td>
      {/* <td>{numberWithCommas(data.discount)} ₫</td> */}
      <td>{numberWithCommas(data.actual_amount_collected, config)} ₫</td>
      {/* <td className="text-center">{data.fullyear ? "✓" : "✗"}</td> */}
      <td>{numberWithCommas(data.amount_edited, config)} ₫</td>

      <td>
        <>
          <input
            type="checkbox"
            className="checkbox checkbox-xs"
            checked={data.isChecked}
            onChange={(e) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? {
                                ...item,
                                isChecked: e.target.checked,
                                nowMoney:
                                  e.target.checked === true
                                    ? Math.abs(item.next_batch_money)
                                    : 0,
                              }
                            : item
                        ),
                      }
                    : el
                )
              )
            }
          />
        </>
      </td>
      <td>
        <>
          <CurrencyInput
            autoComplete="off"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            className={`input input-xs`}
            value={data.nowMoney}
            groupSeparator={config.result[0].config.numberComma.value}
            onValueChange={(value) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? {
                                ...item,
                                nowMoney: parseInt(value),
                              }
                            : item
                        ),
                      }
                    : el
                )
              )
            }
            decimalsLimit={2}
          />
        </>
      </td>
      <td>{numberWithCommas(data.amount_collected, config)} ₫</td>
      {/* <td>
        <>
          <CurrencyInput
            autoComplete="off"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            className={`input input-xs`}
            value={data.nowMoney}
            onValueChange={(value) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? {
                                ...item,
                                nowMoney: parseInt(value),
                              }
                            : item
                        ),
                      }
                    : el
                )
              )
            }
            decimalsLimit={2}
          />
        </>
      </td> */}

      <td>
        {numberWithCommas(
          data.previous_batch_money +
            data.actual_amount_collected +
            data.amount_spend +
            data.amount_edited +
            data.nowMoney -
            data.amount_collected,
          config
        )}{" "}
        ₫
      </td>
      <td></td>
    </tr>
  );
};

const handleExport = async (data, student) => {
  // console.log(student);
  console.log(data);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("BK Hoàn trả ti");

  worksheet.mergeCells("A1:C1");
  const tentruong = worksheet.getCell("A1");
  tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
  tentruong.font = { name: "Times New Roman", size: 11 };
  tentruong.alignment = { vertical: "middle", horizontal: "left" };

  worksheet.mergeCells("A2:E2");
  const titleCell = worksheet.getCell("A2");
  titleCell.value = "BẢNG KÊ HOÀN TRẢ TIỀN THỪA";
  titleCell.font = { name: "Times New Roman", size: 14, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("A3:E3");
  const Ghichu = worksheet.getCell("B3");
  Ghichu.value = "(Theo 1 học sinh)";
  Ghichu.font = { name: "Times New Roman", size: 12 };
  Ghichu.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("B4:E4");
  const tths = worksheet.getCell("B4");
  tths.value = `Mã học sinh: ${student.code}      Họ tên học sinh: ${
    student.first_name
  } ${student.last_name}       Ngày sinh: ${student.date_of_birth
    .split("-")
    .reverse()
    .join("-")}   Lớp: ${
    student.class_level_code
  }    Mã lớp: ${student.class_name.substring(1)}`;
  tths.font = {
    name: "Times New Roman",
    size: 14,
    // color: { argb: "#CC0000" },
    horizontal: "center",
  };
  tths.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("B5:E5");
  const ngay = worksheet.getCell("B5");
  ngay.value = `Tại ngày ${moment().days()} tháng ${
    moment().month() + 1
  } năm ${moment().year()}`;
  ngay.font = {
    name: "Times New Roman",
    size: 12,
    color: { argb: "FF0000" },
  };
  ngay.alignment = { vertical: "middle", horizontal: "center" };

  // Thêm dữ liệu vào bảng tính
  worksheet.columns = [
    { key: "col1", width: 5 },
    { key: "col2", width: 45 },
    { key: "col3", width: 30 },
    { key: "col4", width: 30 },
    { key: "col5", width: 35 },
  ];

  //chỉnh chiều cao cho hàng excel
  // worksheet.properties.defaultRowHeight = 25;

  worksheet.getCell(7, 1).value = "TT";
  worksheet.getCell(7, 2).value = "Nội dung";
  worksheet.getCell(7, 3).value = "Loại khoản thu";
  worksheet.getCell(7, 4).value = "Số tiền hoàn trả (đồng)";
  worksheet.getCell(7, 5).value = "Ký nhận";

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

  worksheet.getCell(7, 1).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(7, 2).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(7, 3).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(7, 4).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(7, 5).font = { bold: true, name: "Times New Roman" };

  data
    .sort((a, b) => a.position - b.position)
    .map((item, index) => {
      worksheet.addRow([
        index + 1,
        item.name,
        item.revenue_type.name,
        item.expected_revenues.reduce(
          (total, curr) => total + curr.nowMoney,
          0
        ),
      ]);
    });

  worksheet.addRow([
    "I",
    "Tổng tiền phí, học phí hoàn trả",
    "",
    data.reduce(
      (total, curr) =>
        curr.revenue_type.id === 1
          ? total + curr.expected_revenues.reduce((t, c) => t + c.nowMoney, 0)
          : total,
      0
    ),
  ]);
  worksheet.addRow([
    "II",
    "Tổng tiền thu hộ hoàn trả",
    "",
    data.reduce(
      (total, curr) =>
        curr.revenue_type.id === 2
          ? total + curr.expected_revenues.reduce((t, c) => t + c.nowMoney, 0)
          : total,
      0
    ),
  ]);
  worksheet.addRow([
    "III",
    "Tổng tiền hoàn trả (=I+II)",
    "",
    data.reduce(
      (total, curr) =>
        total + curr.expected_revenues.reduce((t, c) => t + c.nowMoney, 0),
      0
    ),
  ]);

  worksheet.mergeCells("D30:E30");
  const ngaylap = worksheet.getCell("D30");
  ngaylap.value = "Hải Phòng, ngày ....... tháng ....... năm 202…";
  ngaylap.font = { name: "Times New Roman", size: 12, italic: true };
  ngaylap.alignment = { vertical: "middle", horizontal: "right" };

  worksheet.getCell(31, 2).value = "Thủ trưởng";
  worksheet.getCell(31, 2).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(31, 2).font = {
    name: "Times New Roman",
    size: 12,
    bold: true,
  };

  worksheet.getCell(31, 4).value = "Kế toán trưởng";
  worksheet.getCell(31, 4).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(31, 4).font = {
    name: "Times New Roman",
    size: 12,
    bold: true,
  };

  worksheet.getCell(31, 5).value = "Người lập";
  worksheet.getCell(31, 5).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(31, 5).font = {
    name: "Times New Roman",
    size: 12,
    bold: true,
  };

  const buf = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buf]), "Bang-ke-hoan-tra-tien-thua-1-HS.xlsx");
};

const SubContent = ({ student, selectPresent }) => {
  const { permission } = useContext(listContext);
  // const ref = useRef();
  const [data, setData] = useState();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const where = {
    batch_id: {
      _eq: selectPresent.id,
    },
    student_code: {
      _eq: student.code,
    },
    is_deleted: {
      _eq: false,
    },
    end_at: {
      _is_null: true,
    },
    next_batch_money: {
      _lt: 0,
    },
  };

  const expectedRevenue = useQuery({
    queryKey: ["get_expected_revenue", student.code],
    queryFn: async () =>
      getExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        where
      ),
  });

  useLayoutEffect(() => {
    if (expectedRevenue.data) {
      setData(
        expectedRevenue.data?.data?.result.map((item) =>
          item.expected_revenues.length === 0
            ? item
            : {
                ...item,
                expected_revenues: item.expected_revenues.map((el) => ({
                  ...el,
                  isChecked: false,
                  nowMoney: 0,
                })),
              }
        )
      );
    }
  }, [expectedRevenue.data]);

  // if (expectedRevenue.isFetching && expectedRevenue.isLoading) {
  //   return (
  //     <div className="w-full flex flex-col justify-center items-center">
  //       <span className="loading loading-spinner loading-lg"></span>
  //     </div>
  //   );
  // }

  if (expectedRevenue.isError) {
    throw new Error();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <Scrollbars universal autoHeight autoHeightMin={"450px"}> */}
      <div className="overflow-x-auto">
        <table className="table table-xs table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th>TT</th>
              <th>Khoản thu</th>
              <th>Loại khoản thu</th>
              <th>Công nợ đầu kỳ</th>
              <th>Số phải nộp kỳ này</th>
              {/* <th>Nộp cả năm</th> */}
              <th>Đã điều chỉnh</th>
              {/* <th>Đã hoàn trả</th> */}
              {data ? (
                <th
                  className="cursor-pointer"
                  onClick={() =>
                    setData((pre) =>
                      pre.map((item) =>
                        item.expected_revenues.length === 0
                          ? item
                          : {
                              ...item,
                              expected_revenues: item.expected_revenues.map(
                                (el) => ({
                                  ...el,
                                  isChecked: true,
                                  nowMoney: el.next_batch_money * -1,
                                })
                              ),
                            }
                      )
                    )
                  }
                >
                  <>
                    <div
                      data-tip={"Chọn tất cả"}
                      className="tooltip tooltip-left"
                    >
                      Tích chọn hoàn trả
                    </div>
                  </>
                </th>
              ) : (
                <th>Tích chọn hoàn trả</th>
              )}
              <th>Số tiền hoàn trả</th>
              <th>Số đã nộp trong kỳ</th>
              <th>Công nợ cuối kỳ</th>
              <th>
                <div className="flex gap-2">
                  <div
                    className="tooltip tooltip-left cursor-pointer"
                    data-tip="Tải lại"
                    onClick={() => {
                      queryClient.invalidateQueries({
                        queryKey: ["get_expected_revenue", student.code],
                      });
                    }}
                  >
                    <TbReload size={30} />
                  </div>
                  {/* <div
                    className="tooltip tooltip-left cursor-pointer"
                    data-tip="Xuất Excel"
                    onClick={() => handleExport(data)}
                  >
                    <LiaFileExportSolid size={30} />
                  </div> */}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {expectedRevenue.isRefetching ||
            (expectedRevenue.isFetching && expectedRevenue.isLoading) ? (
              <Skeleton />
            ) : data
                ?.filter((item) => item.id !== 12)
                ?.every((item) => item.expected_revenues.length === 0) ? (
              <tr>
                <td colSpan={11} className="text-center">
                  Không có kết quả!
                </td>
              </tr>
            ) : (
              data
                ?.sort((a, b) => {
                  if (a.position === null) return 1;
                  if (b.position === null) return -1;
                  return a.position - b.position;
                })
                .filter((item) =>
                  item.scope.some((el) => el === student.school_level_code)
                )
                .filter((item) => item.expected_revenues.length > 0)
                .filter((item) => item.id !== 12)
                .map((item, index) => {
                  // if (item.expected_revenues.length === 0) {
                  //   return (
                  //     <tr className="hover">
                  //       <td>{index + 1}</td>
                  //       <td>{item.name}</td>
                  //       <td>{item.revenue_type.name}</td>
                  //       <td className="text-center text-red-300" colSpan={10}>
                  //         Chưa có dự kiến thu
                  //       </td>
                  //     </tr>
                  //   );
                  // }
                  if (item.expected_revenues.length === 1) {
                    return (
                      <Item
                        key={item.id}
                        setData={setData}
                        group_id={item.id}
                        index={index}
                        data={item.expected_revenues[0]}
                        isRefetching={expectedRevenue.isRefetching}
                        student_code={student.code}
                        revenue_type={item.revenue_type}
                      />
                    );
                  }

                  if (item.expected_revenues.length > 1) {
                    return (
                      <Fragment key={item.id}>
                        <tr className="hover">
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.revenue_type.name}</td>
                          {/* <td className="text-center text-red-300" colSpan={8}>
                          Chưa có dự kiến thu
                        </td> */}
                        </tr>
                        {item.expected_revenues.map((el, i) => {
                          return (
                            <Item
                              group_id={item.id}
                              key={el.id}
                              setData={setData}
                              index={index}
                              i={i}
                              data={el}
                              isRefetching={expectedRevenue.isRefetching}
                              student_code={student.code}
                              revenue_type={item.revenue_type}
                            />
                          );
                        })}
                      </Fragment>
                    );
                  }
                })
            )}
          </tbody>
        </table>
      </div>
      {/* </Scrollbars> */}
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        data
          ?.filter((item) => item.expected_revenues.length > 0)
          .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
          .some((item) => item.isChecked && item.nowMoney) && (
          <>
            <button
              className="flex justify-center btn w-fit self-center"
              onClick={() => handleExport(data, student)}
            >
              <LiaFileExportSolid size={30} /> Xuất Excel
            </button>
          </>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubContent;
