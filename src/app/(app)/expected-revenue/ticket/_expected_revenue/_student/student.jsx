"use client";
import StudentFilter from "@/app/_component/studentFilter";
import { listContext } from "../../content";
import { useContext, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { CiCircleMore } from "react-icons/ci";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { createTicketExpectedRevenueRouter } from "@/utils/funtionApi";
import moment from "moment";
import "moment/locale/vi";
import Search from "@/app/_component/tableStudent";

function getMonthsBetween(startMonth, endMonth) {
  // Validate input months
  if (startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12) {
    return [];
  }

  if (startMonth === endMonth) {
    return [startMonth];
  }

  const startIndex = startMonth - 1; // Adjust index to start from 0
  const endIndex = endMonth - 1; // Adjust index to start from 0

  if (endIndex > startIndex) {
    return Array.from(
      { length: endIndex - startIndex + 1 },
      (_, i) => startIndex + i + 1
    );
  } else {
    const monthsBetween = Array.from(
      { length: 12 - startIndex + endIndex + 1 },
      (_, i) => ((startIndex + i) % 12) + 1
    );
    return monthsBetween;
  }
}

const Item = ({ norm, setNorm, school_level_code }) => {
  const { listRevenue, calculationUnit, selectPresent } =
    useContext(listContext);
  // useEffect(() => {
  //   if (norm.group) setNorm((pre) => ({ ...pre, type: null }));
  // }, [norm.group]);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-2 auto-rows-auto gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-left">Loại khoản thu:</p>
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Loại khoản thu"
            isDisabled
            options={listRevenue.revenue_types
              .sort((a, b) => a.id - b.id)
              .map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            value={norm.type}
            onChange={(e) => {
              if (norm.type?.value !== e.value)
                setNorm((pre) => ({
                  ...pre,
                  type: e,
                  group: null,
                  revenue: null,
                  calculation_unit: null,
                  price: 100000,
                  quantity: 1,
                  total: 100000,
                }));
            }}
            className="text-black text-sm text-left"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
          />
        </div>
        {norm.type && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-left">Nhóm khoản thu:</p>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Nhóm khoản thu"
              options={listRevenue.revenue_types
                .find((item) => item.id === norm.type.value)
                .revenue_groups.filter((item) =>
                  item.scope.some((el) => el === school_level_code)
                )
                .filter((item) => item.id === 12)
                .filter((item) => item.revenues.length > 0)
                .sort((a, b) => a.id - b.id)
                .map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              value={norm.group}
              onChange={(e) => {
                norm.group?.value !== e.value &&
                  setNorm((pre) => ({
                    ...pre,
                    group: e,
                    revenue: null,
                    calculation_unit: null,
                    price: 100000,
                    quantity: 1,
                    total: 100000,
                  }));
              }}
              className="text-black text-sm text-left"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />
          </div>
        )}

        {norm.group && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-left">Khoản thu:</p>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Khoản thu"
              options={listRevenue.revenue_types
                .find((item) => item.id === norm.type.value)
                .revenue_groups.find((item) => item.id === norm.group.value)
                .revenues // .revenues.filter((item) =>
                //   getMonthsBetween(
                //     parseInt(selectPresent.start_day.split("-")[1]),
                //     parseInt(selectPresent.end_day.split("-")[1])
                //   ).includes(item.position)
                // )
                .map((item) => {
                  return {
                    ...item,
                    value: item.id,
                    label: item.name,
                  };
                })}
              value={norm.revenue}
              onChange={(e) =>
                norm.revenue?.value !== e.value &&
                setNorm((pre) => ({
                  ...pre,
                  revenue: e,
                  calculation_unit: null,
                  price: 100000,
                  quantity: 1,
                  total: 100000,
                }))
              }
              className="text-black text-sm text-left"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />
          </div>
        )}
        {norm.revenue && (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-left">Đơn vị tính:</p>
              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Đơn vị tính"
                options={calculationUnit.calculation_units
                  .filter((item) => item.id === 1)
                  .map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                value={norm.calculation_unit}
                onChange={(e) =>
                  setNorm((pre) => ({ ...pre, calculation_unit: e }))
                }
                className="text-black text-sm text-left"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
              />
            </div>

            <div className={`w-full relative `}>
              <input
                autoComplete="off"
                id={`month_${norm.id}`}
                // intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`text-left block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Thu tại tháng"
                value={norm.month ? norm.month : 0}
                // decimalsLimit={2}
                type="number"
                onWheel={(e) => e.target.blur()}
                onChange={(e) =>
                  setNorm((pre) => ({
                    ...pre,
                    month:
                      parseInt(selectPresent.end_day.split("-")[1]) <
                        parseInt(e.target.value) ||
                      parseInt(selectPresent.start_day.split("-")[1]) >
                        parseInt(e.target.value)
                        ? moment().month() + 1
                        : parseInt(e.target.value),
                  }))
                }
              />
              <label
                htmlFor={`month_${norm.id}`}
                className={`text-left cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Thu tại tháng
              </label>
            </div>

            <div className={`w-full relative `}>
              <input
                autoComplete="off"
                type={"number"}
                id={`quantity_${norm.id}`}
                className={`text-left block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Số lượng"
                value={norm.quantity}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                onChange={(e) => {
                  setNorm((pre) => ({
                    ...pre,
                    quantity: parseInt(e.target.value).toString(),
                    total: parseInt(e.target.value) * parseInt(pre.price),
                  }));
                }}
              />
              <label
                htmlFor={`quantity_${norm.id}`}
                className={` text-left cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Số lượng
              </label>
            </div>
            <div className={`w-full relative `}>
              <CurrencyInput
                autoComplete="off"
                id={`price_${norm.id}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`text-left block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={norm.price ? norm.price : 0}
                decimalsLimit={2}
                onValueChange={(value) => {
                  setNorm((pre) => ({
                    ...pre,
                    price: parseInt(value),
                    total: parseInt(value) * parseInt(pre.quantity),
                  }));
                }}
              />
              <label
                htmlFor={`price_${norm.id}`}
                className={`text-left cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Đơn giá
              </label>
            </div>
            <div className={`w-full relative`}>
              <CurrencyInput
                autoComplete="off"
                disabled
                id={`total_${norm.id}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`text-left block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={typeof norm.total === "number" ? norm.total : "NaN"}
                decimalsLimit={2}
                onValueChange={(value) =>
                  setNorm((pre) => ({ ...pre, total: value }))
                }
              />
              <label
                htmlFor={`total_${norm.id}`}
                className={`text-left !cursor-not-allowed absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Tổng tiền
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Modal = ({ hit }) => {
  const { selectPresent, listRevenue, permission } = useContext(listContext);
  const [mutating, setMutating] = useState(false);

  const [norm, setNorm] = useState({
    group: null,
    type: {
      value: listRevenue.revenue_types.find((item) => item.id === 2).id,
      label: listRevenue.revenue_types.find((item) => item.id === 2).name,
    },
    revenue: null,
    calculation_unit: null,
    price: 100000,
    quantity: 1,
    total: 100000,
    month: moment().month() + 1,
  });

  const mutation = useMutation({
    mutationFn: ({ norm, time, selectPresent }) =>
      createTicketExpectedRevenueRouter({
        type: "STUDENT",
        data: [hit?.code],
        norm,
        batch_id: selectPresent.id,
        time,
        arrMonth: getMonthsBetween(
          norm.month,
          parseInt(selectPresent.end_day.split("-")[1])
        ),
      }),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["get_revenue_norms", selected],
      // });
      document.getElementById(`modal_${hit?.code}`).close();
      toast.success("Tạo mới dự kiến thu vé ăn cho học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setNorm({
        group: null,
        type: {
          value: listRevenue.revenue_types.find((item) => item.id === 2).id,
          label: listRevenue.revenue_types.find((item) => item.id === 2).name,
        },
        revenue: null,
        calculation_unit: null,
        price: 100000,
        quantity: 1,
        total: 100000,
      });
      setMutating(false);
    },
    onError: () => {
      toast.error("Tạo mới dự kiến thu vé ăn cho học sinh không thành công!", {
        position: "top-center",
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

    mutation.mutate({ norm, time, selectPresent });
  }, [norm]);

  return (
    <dialog id={`modal_${hit?.code}`} className="modal">
      <div className="modal-box" style={{ overflowY: "unset" }}>
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex flex-col pr-3 gap-2">
          <h6 className="text-center">Dự kiến thu</h6>
          <div className="flex flex-col gap-1">
            {norm && (
              <>
                <Item
                  norm={norm}
                  setNorm={setNorm}
                  school_level_code={hit?.school_level_code}
                />
              </>
            )}
            <div className="flex justify-center gap-2">
              {mutating ? (
                <span className="loading loading-spinner loading-sm bg-primary"></span>
              ) : (
                <>
                  {permission ===
                  process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
                    norm.group &&
                    norm.type &&
                    norm.revenue &&
                    norm.calculation_unit &&
                    norm.price &&
                    norm.quantity &&
                    norm.total &&
                    norm.month ? (
                      <>
                        <button
                          className="btn w-fit"
                          onClick={() => handleOnclick()}
                        >
                          Hoàn thành
                        </button>
                        <div
                          className="tooltip flex items-center justify-center !z-30"
                          data-tip="Cân nhắc kiểm tra nếu đã lập dự kiến thu trước đó!"
                        >
                          <IoIosInformationCircleOutline
                            size={20}
                            className="text-red-500"
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

// const HitItem = ({ hit, isRefetching }) => {
//   return (
//     <>
//       <tr className="hover">
//         <td
//           // className="w-[20%] self-center"
//           dangerouslySetInnerHTML={{ __html: hit?._formatted.code }}
//         />
//         <td
//           // className="w-[40%] self-center"
//           dangerouslySetInnerHTML={{
//             __html: `${hit?._formatted.first_name} ${hit?._formatted.last_name}`,
//           }}
//         />
//         <td
//           // className="w-[20%] self-center"
//           dangerouslySetInnerHTML={{ __html: hit?._formatted.class_name }}
//         />
//         <td className="self-center">
//           {isRefetching ? (
//             <span className="loading loading-spinner loading-md self-center"></span>
//           ) : (
//             <>
//               <div
//                 className="tooltip cursor-pointer"
//                 data-tip="Lập dự kiến"
//                 onClick={() =>
//                   document.getElementById(`modal_${hit?.code}`).showModal()
//                 }
//               >
//                 <CiCircleMore size={25} />
//               </div>
//             </>
//           )}
//         </td>
//       </tr>
//       <>
//         <Modal hit={hit} />
//       </>
//     </>
//   );
// };

// const Search = ({ queryObject }) => {
//   const [result, setResult] = useState();
//   const {
//     data,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//     isRefetching,
//   } = useInfiniteQuery({
//     queryKey: [`search`, queryObject],
//     queryFn: async ({ pageParam = 1 }) =>
//       meilisearchStudentSearch(
//         queryObject,
//         await meilisearchGetToken(),
//         pageParam
//       ),
//     getNextPageParam: (res) => {
//       if (res.page < res.totalPages) return res.page + 1;
//       else return undefined;
//     },
//   });

//   useEffect(() => {
//     if (Array.isArray(data?.pages))
//       setResult(
//         data?.pages
//           .reduce((total, curr) => [...total, ...curr.hits], [])
//           .map((item) => ({ ...item, isOpen: false }))
//       );
//   }, [data]);

//   return status === "loading" ? (
//     <span className="loading loading-spinner loading-lg self-center"></span>
//   ) : status === "error" ? (
//     <p className="self-center">Error: {error.message}</p>
//   ) : (
//     result && (
//       <>
//         <div className="overflow-x-auto">
//           <table className="table">
//             {/* head */}
//             <thead>
//               <tr>
//                 {/* <th></th> */}
//                 <th>Mã học sinh</th>
//                 <th>Họ tên</th>
//                 <th>Lớp</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {result.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className=" text-center">
//                     Không tìm thấy kết quả
//                   </td>
//                 </tr>
//               ) : (
//                 result.map((el) => (
//                   <Fragment key={el.code}>
//                     <HitItem
//                       hit={el}
//                       isRefetching={isRefetching}
//                       setResult={setResult}
//                     />
//                   </Fragment>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex justify-center">
//           <button
//             className="btn"
//             onClick={() => fetchNextPage()}
//             disabled={!hasNextPage || isFetchingNextPage}
//           >
//             {isFetchingNextPage ? (
//               <span className="loading loading-spinner loading-lg"></span>
//             ) : hasNextPage ? (
//               "Xem thêm"
//             ) : (
//               "Đã hết kết quả tìm kiếm!"
//             )}
//           </button>
//         </div>
//       </>
//     )
//   );
// };

const Student = () => {
  const { listSearch, config } = useContext(listContext);
  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
    query: "",
  });

  return (
    <div className="flex flex-col gap-3">
      <h6>Tìm kiếm học sinh:</h6>
      <StudentFilter
        selected={selected}
        setSelected={setSelected}
        listSearch={listSearch}
      />
      <Search
        queryObject={selected}
        dataTip={"Lập dự kiến"}
        modal
        modalChill={<Modal />}
        config={config}
      >
        <CiCircleMore size={25} />
      </Search>
    </div>
  );
};

export default Student;
