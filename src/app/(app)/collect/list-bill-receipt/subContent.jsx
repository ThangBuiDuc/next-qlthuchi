"use client";
import {
  meilisearchGetToken,
  meilisearchBillReceiptGet,
  updateBillReceipt,
} from "@/utils/funtionApi";
// import { listContext } from "./content";
import { useState, useRef } from "react";
import moment from "moment";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TbReload } from "react-icons/tb";
// import { IoMdPrint } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
// import { useReactToPrint } from "react-to-print";
// import { getText } from "number-to-text-vietnamese";
import { useMutation } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function findIndexInArray(arrayOfArrays, targetObject) {
  for (let i = 0; i < arrayOfArrays.length; i++) {
    let innerArray = arrayOfArrays[i].data.results;

    for (let j = 0; j < innerArray.length; j++) {
      if (innerArray[j].code === targetObject.code) {
        return i;
      }
    }
  }

  // If the target object is not found
  return -1;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// function sumDuplicated(arr) {
//   return arr.reduce((acc, curr) => {
//     const objInAcc = acc.find(
//       (o) =>
//         o.expected_revenue.revenue.revenue_group.id ===
//         curr.expected_revenue.revenue.revenue_group.id
//     );
//     if (objInAcc)
//       return [
//         ...acc.map((item) =>
//           item.expected_revenue.revenue.revenue_group.id ===
//           curr.expected_revenue.revenue.revenue_group.id
//             ? {
//                 ...item,
//                 amount_collected: item.amount_collected + curr.amount_collected,
//               }
//             : item
//         ),
//       ];
//     else return [...acc, curr];
//   }, []);
// }

// const ModalPrint = ({ data }) => {
//   const receipt_details = useMemo(
//     () => sumDuplicated(data.receipt_details),
//     []
//   );
//   const { preReceipt } = useContext(listContext);
//   // console.log(receipt_details);
//   const ref = useRef();
//   const middleIndex = Math.round(receipt_details.length / 2);
//   const firstPart = receipt_details.slice(0, middleIndex);
//   const secondPart = receipt_details.slice(middleIndex);

//   const handlePrint = useReactToPrint({
//     content: () => ref.current,
//   });

//   return (
//     <div className="flex flex-col p-2 gap-2">
//       <h6 className="col-span-3 text-center">In lại biên lai thu</h6>
//       <>
//         {/* <div className="border border-black p-1"> */}
//         <div className="flex flex-col relative justify-center items-center gap-1 mb-5">
//           <h5 className="text-center">
//             {(data.formality.value === 2 && "BIÊN LAI THU TIỀN MẶT") ||
//               (data.formality.value === 1 && "BIÊN LAI THU CHUYỂN KHOẢN")}
//           </h5>
//           <div className="flex justify-center gap-4">
//             <p>Số BL: {data.code}</p>
//             {data.formality.value === 1 && (
//               <p>Ngân hàng thu: {preReceipt.schools[0].bank_name}</p>
//             )}
//           </div>
//           <p>
//             Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
//             {moment().year()}
//           </p>
//           <div className="grid grid-cols-2 auto-rows-auto border border-black w-full divide-y divide-black">
//             <div className="flex divide-x divide-black col-span-2">
//               <div className="pl-1   w-[50%]">
//                 <p className="font-semibold">
//                   Họ và tên học sinh:{" "}
//                   {`${data.student.first_name} ${data.student.last_name}`}
//                 </p>
//                 <p className="font-semibold">
//                   Mã học sinh: {data.student.code}
//                 </p>
//               </div>
//               <div className="pl-1   w-[50%]">
//                 <p className="font-semibold">
//                   Ngày sinh:{" "}
//                   {data.student.date_of_birth.split("-").reverse().join("/")}
//                 </p>

//                 <p className="font-semibold">
//                   Lớp: {data.schoolyear_student.class_code}
//                 </p>
//               </div>
//             </div>
//             <div className="col-span-2 grid grid-cols-2 auto-rows-auto divide-x divide-black">
//               <div className="flex flex-col divide-y divide-black">
//                 {firstPart.map((item, index) => (
//                   <p
//                     key={item.index}
//                     className="pl-1 pr-1 flex justify-between"
//                   >
//                     {index + 1}.{" "}
//                     {item.expected_revenue.revenue.revenue_group.name}:{" "}
//                     {numberWithCommas(item.amount_collected)} <span>₫</span>
//                   </p>
//                 ))}
//               </div>
//               <div className="flex flex-col divide-y divide-black">
//                 {secondPart.map((item, index) => (
//                   <p
//                     key={item.index}
//                     className="pl-1 pr-1 flex justify-between"
//                   >
//                     {middleIndex + index + 1}.{" "}
//                     {item.expected_revenue.revenue.revenue_group.name}:{" "}
//                     {numberWithCommas(item.amount_collected)} <span>₫</span>
//                   </p>
//                 ))}
//               </div>
//             </div>
//             <div className="flex flex-col col-span-2 p-2 gap-2">
//               <p className=" flex justify-end gap-1 font-semibold">
//                 Tổng các khoản thu ={" "}
//                 {numberWithCommas(
//                   receipt_details.reduce(
//                     (total, item) => total + item.amount_collected,
//                     0
//                   )
//                 )}{" "}
//                 <span>₫</span>
//               </p>
//               <p className="text-center font-semibold">
//                 Bằng chữ:{" "}
//                 <span className="italic first-letter:uppercase">
//                   {getText(
//                     receipt_details.reduce(
//                       (total, item) => total + item.amount_collected,
//                       0
//                     )
//                   )
//                     .charAt(0)
//                     .toUpperCase() +
//                     getText(
//                       receipt_details.reduce(
//                         (total, item) => total + item.amount_collected,
//                         0
//                       )
//                     ).slice(1)}{" "}
//                   đồng
//                 </span>
//               </p>
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
//             <h5 className="text-center">
//               {(data.formality.value === 2 && "BIÊN LAI THU TIỀN MẶT") ||
//                 (data.formality.value === 1 && "BIÊN LAI THU CHUYỂN KHOẢN")}
//             </h5>
//             <div className="flex justify-center gap-4">
//               <p>Số BL: {data.code}</p>
//               {data.formality.value === 1 && (
//                 <p>Ngân hàng thu: {preReceipt.schools[0].bank_name}</p>
//               )}
//             </div>
//             <p>
//               Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
//               {moment().year()}
//             </p>
//             <div className="grid grid-cols-2 auto-rows-auto border border-black w-full divide-y divide-black">
//               <div className="flex divide-x divide-black col-span-2">
//                 <div className="pl-1   w-[50%]">
//                   <p className="font-semibold">
//                     Họ và tên học sinh:{" "}
//                     {`${data.student.first_name} ${data.student.last_name}`}
//                   </p>
//                   <p className="font-semibold">
//                     Mã học sinh: {data.student.code}
//                   </p>
//                 </div>
//                 <div className="pl-1   w-[50%]">
//                   <p className="font-semibold">
//                     Ngày sinh:{" "}
//                     {data.student.date_of_birth.split("-").reverse().join("/")}
//                   </p>

//                   <p className="font-semibold">
//                     Lớp: {data.schoolyear_student.class_code}
//                   </p>
//                 </div>
//               </div>
//               <div className="col-span-2 grid grid-cols-2 auto-rows-auto divide-x divide-black">
//                 <div className="flex flex-col divide-y divide-black">
//                   {firstPart.map((item, index) => (
//                     <p
//                       key={item.index}
//                       className="pl-1 pr-1 flex justify-between"
//                     >
//                       {index + 1}.{" "}
//                       {item.expected_revenue.revenue.revenue_group.name}:{" "}
//                       {numberWithCommas(item.amount_collected)} <span>₫</span>
//                     </p>
//                   ))}
//                 </div>
//                 <div className="flex flex-col divide-y divide-black">
//                   {secondPart.map((item, index) => (
//                     <p
//                       key={item.index}
//                       className="pl-1 pr-1 flex justify-between"
//                     >
//                       {middleIndex + index + 1}.{" "}
//                       {item.expected_revenue.revenue.revenue_group.name}:{" "}
//                       {numberWithCommas(item.amount_collected)} <span>₫</span>
//                     </p>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex flex-col col-span-2 p-2 gap-2">
//                 <p className=" flex justify-end gap-1 font-semibold">
//                   Tổng các khoản thu ={" "}
//                   {numberWithCommas(
//                     receipt_details.reduce(
//                       (total, item) => total + item.amount_collected,
//                       0
//                     )
//                   )}{" "}
//                   <span>₫</span>
//                 </p>
//                 <p className="text-center font-semibold">
//                   Bằng chữ:{" "}
//                   <span className="italic first-letter:uppercase">
//                     {getText(
//                       receipt_details.reduce(
//                         (total, item) => total + item.amount_collected,
//                         0
//                       )
//                     )
//                       .charAt(0)
//                       .toUpperCase() +
//                       getText(
//                         receipt_details.reduce(
//                           (total, item) => total + item.amount_collected,
//                           0
//                         )
//                       ).slice(1)}{" "}
//                     đồng
//                   </span>
//                 </p>
//               </div>
//             </div>
//             <div
//               className={`grid ${
//                 (data.formality.value === 2 && "grid-cols-3") ||
//                 (data.formality.value === 1 && "grid-cols-2")
//               } auto-rows-auto w-full`}
//             >
//               <p className="text-center font-semibold ">Người lập</p>
//               {data.formality.value === 2 && (
//                 <>
//                   <p className="text-center font-semibold">Người nộp tiền</p>
//                   <p className="text-center font-semibold">Người thu tiền</p>
//                 </>
//               )}
//               {data.formality.value === 1 && (
//                 <>
//                   <p className="text-center font-semibold">Ngân hàng thu</p>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <button className="btn w-fit self-center" onClick={() => handlePrint()}>
//           In lại
//         </button>
//       </>
//     </div>
//   );
// };

const CancelModal = ({ bill_receipt_code, cancelRef, pageIndex, refetch }) => {
  const [note, setNote] = useState("");
  const { getToken } = useAuth();
  const { user } = useUser();
  const [mutating, setMutating] = useState(false);

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const time = moment().format();
      const updates = {
        _set: {
          updated_by: user.id,
          updated_at: time,
          canceled: true,
          amount_collected: 0,
          note,
        },
        where: {
          code: { _eq: bill_receipt_code },
        },
      };
      return updateBillReceipt(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        updates
      );
    },
    onSuccess: () => {
      cancelRef.current.close();
      refetch({ refetchPage: (_, index) => index === pageIndex });
      setMutating(false);
      toast.success("Huỷ biên lai thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      cancelRef.current.close();
      setMutating(false);
      toast.error("Huỷ biên lai thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  return (
    <div className="flex flex-col p-2 gap-2">
      <h5 className="text-center">
        Huỷ phiếu thu tiền mặt: {bill_receipt_code}
      </h5>

      <label className="form-control">
        <textarea
          className="textarea textarea-bordered h-24 resize-none"
          placeholder="Ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </label>

      {mutating ? (
        <span className="loading loading-spinner loading-md self-center"></span>
      ) : (
        note.trim().length > 0 && (
          <button
            className="btn w-fit self-center"
            onClick={() => {
              setMutating(true);
              cancelMutation.mutate();
            }}
          >
            Huỷ
          </button>
        )
      )}
    </div>
  );
};

const RowTable = ({ data, pageIndex, isRefetching, refetch, permission }) => {
  const printRef = useRef();
  const cancelRef = useRef();
  return (
    <tr className="hover">
      <td>{data.bill_formality.name}</td>
      <td>{data.code}</td>
      <td>{data.payer}</td>
      <td>{data.name}</td>
      <td>{data.description}</td>
      <td>{numberWithCommas(data.amount_collected)}</td>
      <td>{moment(data.start_at).format("DD/MM/yyyy HH:mm:ss")}</td>
      <td>{data.canceled && "✓"}</td>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        isRefetching ? (
          <>
            <span className="loading loading-spinner loading-md self-center"></span>
          </>
        ) : (
          <td>
            <>
              <div
                className="tooltip items-center flex cursor-pointer w-fit"
                data-tip="Huỷ biên lai"
                onClick={() => cancelRef.current.showModal()}
              >
                <IoTrashBinOutline size={25} />
              </div>

              {/* MODAL CANCEL */}
              <dialog ref={cancelRef} className="modal">
                <div
                  className="modal-box h-fit !max-h-[500px] overflow-y-auto !max-w-2xl"
                  // style={{ overflowY: "unset" }}
                >
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <CancelModal
                    bill_receipt_code={data.code}
                    cancelRef={cancelRef}
                    pageIndex={pageIndex}
                    refetch={refetch}
                  />
                </div>
              </dialog>
            </>
          </td>
        )
      ) : (
        <></>
      )}
    </tr>
  );
};

const SubContent = ({ condition, permission }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: [`searchBillReceipt`, condition],
    queryFn: async ({ pageParam = 1 }) =>
      meilisearchBillReceiptGet(
        condition,
        await meilisearchGetToken(),
        pageParam
      ),
    getNextPageParam: (res) => {
      if ((res.nextPage - 1) * 10 < res.data.total) return res.nextPage;
      else return undefined;
    },
  });

  return status === "loading" ? (
    <span className="loading loading-spinner loading-lg self-center"></span>
  ) : status === "error" ? (
    <p className="self-center">Error: {error.message}</p>
  ) : (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              {/* <th></th> */}
              <th>Hình thức thu</th>
              <th>Mã phiếu thu</th>
              <th>Người nộp</th>
              <th>Lý do nộp</th>
              <th>Kèm theo</th>
              <th>Số tiền thu</th>
              <th>Ngày thu</th>
              <th>Đã huỷ</th>
              <th>
                <>
                  <div
                    className="tooltip items-center flex cursor-pointer w-fit tooltip-left"
                    data-tip="Tải lại danh sách tìm kiếm"
                    onClick={() => refetch()}
                  >
                    <TbReload size={30} />
                  </div>
                </>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.pages[0].data.results.length === 0 ? (
              <tr>
                <td colSpan={9} className=" text-center">
                  Không tìm thấy kết quả
                </td>
              </tr>
            ) : (
              data.pages.map((item) =>
                item.data.results.map((item) => (
                  <RowTable
                    key={item.code}
                    data={item}
                    pageIndex={findIndexInArray(data.pages, item)}
                    isRefetching={isRefetching}
                    refetch={refetch}
                    permission={permission}
                  />
                ))
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <button
          className="btn"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <span className="loading loading-spinner loading-lg"></span>
          ) : hasNextPage ? (
            "Xem thêm"
          ) : (
            "Đã hết kết quả tìm kiếm!"
          )}
        </button>
      </div>
    </>
  );
};

export default SubContent;
