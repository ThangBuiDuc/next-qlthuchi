"use client";
import Select from "react-select";
import { useContext, useState, useRef, useLayoutEffect } from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getExpectedRevenue, updateExpectedRevenue } from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
import { Scrollbars } from "react-custom-scrollbars-2";

function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

const getDiffArray = (a, b) => {
  return b.reduce(
    (total, item) =>
      JSON.stringify(item) === JSON.stringify(a.find((el) => el.id === item.id))
        ? total
        : [...total, item],
    []
  );
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map(() => (
        <tr>
          {[...Array(13)].map(() => (
            <td>
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

const Modal = ({ data }) => {
  const { selectPresent, preReceipt, student } = useContext(listContext);
  const [formality, setFormality] = useState({
    label: preReceipt.formality[0].name,
    value: preReceipt.formality[0].id,
  });
  const middleIndex = Math.floor(data.length / 2);
  const firstPart = data.slice(0, middleIndex);
  const secondPart = data.slice(middleIndex);
  return (
    <div className="flex flex-col p-2 gap-2">
      <h6 className="col-span-3 text-center">Lập biên lai thu</h6>
      <Select
        noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
        placeholder="Hình thức thu tiền"
        options={preReceipt.formality.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        value={formality}
        onChange={(e) => {
          if (formality.value !== e.value) setFormality(e);
        }}
        className="text-black text-sm"
        classNames={{
          control: () => "!rounded-[5px]",
          input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
          valueContainer: () => "!p-[0_8px]",
          menu: () => "!z-[11]",
        }}
      />

      {formality.value === 2 && (
        <div className="flex flex-col relative justify-center items-center gap-1">
          {/* <h6 className="absolute left-0 text-red-500 uppercase">
            {preReceipt.schools[0].name}
          </h6> */}
          <h5 className="text-center">BIÊN LAI THU TIỀN MẶT</h5>
          <p>
            Số BL:{" "}
            {`BM${createCode(
              preReceipt.count_receipt.find(
                (item) => item.id === formality.value
              ).count
            )}`}
          </p>
          <p>
            Ngày {moment().day()} tháng {moment().month() + 1} năm{" "}
            {moment().year()}
          </p>
          <div className="grid grid-cols-2 auto-rows-auto border border-black w-full divide-x divide-black">
            <div className="pl-1">
              <p className="font-semibold">
                Họ và tên học sinh:{" "}
                {`${student.first_name} ${student.last_name}`}
              </p>
              <p className="font-semibold">
                Ngày sinh:{" "}
                {student.date_of_birth.split("-").reverse().join("/")}
              </p>
            </div>
            <div className="pl-1">
              <p className="font-semibold">Mã học sinh: {student.code}</p>
              <p className="font-semibold">Lớp: {student.class_name}</p>
            </div>
            <div className="col-span-2 grid grid-cols-2 auto-rows-auto">
              <div className="flex flex-col pl-1 !border-none">
                {firstPart.map((item, index) => (
                  <p>
                    {index + 1}. {item.name}: {item.nowMoney} <span>₫</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Item = ({ data, index, setData, revenue_type, i, group_id }) => {
  return (
    <tr className="hover">
      <td className={`${typeof i === "number" ? "text-right" : ""}`}>
        {typeof i === "number" ? `${index + 1}.${i + 1}` : index + 1}
      </td>
      <td>{data.revenue.name}</td>
      <td>{revenue_type.name}</td>
      <td>{numberWithCommas(data.previous_batch_money)} ₫</td>
      <td>{numberWithCommas(data.discount)} ₫</td>
      <td>{numberWithCommas(data.actual_amount_collected)} ₫</td>
      {/* <td className="text-center">{data.fullyear ? "✓" : "✗"}</td> */}
      <td>{numberWithCommas(data.amount_edited)} ₫</td>
      <td>{numberWithCommas(data.amount_spend)} ₫</td>
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
                                nowMoney: e.target.checked
                                  ? item.next_batch_money
                                  : item.nowMoney,
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
            onValueChange={(value) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? { ...item, nowMoney: parseInt(value) }
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
      <td>{numberWithCommas(data.amount_collected)} ₫</td>
      <td>
        {numberWithCommas(
          data.previous_batch_money +
            data.prescribed_money +
            data.amount_edited -
            data.amount_collected
        )}{" "}
        ₫
      </td>
      <td></td>
    </tr>
  );
};

const SubContent = ({ student, selectPresent }) => {
  const ref = useRef();
  const { user } = useUser();
  const [mutating, setMutating] = useState(false);
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
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const time = moment().format();
      const updates = getDiffArray(expectedRevenue.data.data.result, data).map(
        (item) => ({
          _set: {
            note: item.note,
            amount_edited: item.amount_edited,
            updated_by: user.id,
            updated_at: time,
            start_at: time,
          },
          where: { id: { _eq: item.id } },
        })
      );
      return updateExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        updates
      );
    },
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries({
        queryKey: ["get_expected_revenue", student.code],
      });
      toast.success("Điều chỉnh dự kiến thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Điều chỉnh dự kiến thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });
  const expectedRevenue = useQuery({
    queryKey: ["get_expected_revenue", student.code],
    queryFn: async () =>
      getExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
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
                  nowMoney: "",
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
      <Scrollbars universal autoHeight autoHeightMin={"450px"}>
        <table className="table table-xs table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th>TT</th>
              <th>Khoản thu</th>
              <th>Loại khoản thu</th>
              <th>Công nợ đầu kỳ</th>
              <th>Ưu đãi, miễn giảm</th>
              <th>Số phải nộp kỳ này</th>
              {/* <th>Nộp cả năm</th> */}
              <th>Đã điều chỉnh</th>
              <th>Đã hoàn trả</th>
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
                                  nowMoney: el.next_batch_money,
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
                      Tích chọn nộp
                    </div>
                  </>
                </th>
              ) : (
                <th>Tích chọn nộp</th>
              )}
              <th>Số tiền nộp lần này</th>
              <th>Số đã nộp trong kỳ</th>
              <th>Công nợ cuối kỳ</th>
              <th>
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
              </th>
            </tr>
          </thead>
          <tbody>
            {expectedRevenue.isRefetching ||
            (expectedRevenue.isFetching && expectedRevenue.isLoading) ? (
              <Skeleton />
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
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
                      <>
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
                      </>
                    );
                  }
                })
            )}
          </tbody>
        </table>
      </Scrollbars>
      {data
        ?.filter((item) => item.expected_revenues.length > 0)
        .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
        .some((item) => item.isChecked) && (
        <>
          <button
            className="btn w-fit self-center"
            onClick={() => ref.current.showModal()}
          >
            Lập biên lai
          </button>
          <dialog ref={ref} id="my_modal_1" className="modal">
            <div
              className="modal-box !max-h-none !max-w-2xl"
              style={{ overflowY: "unset" }}
            >
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <Modal
                data={data
                  ?.filter(
                    (item) =>
                      item.expected_revenues.length > 0 &&
                      item.expected_revenues.some((el) => el.isChecked)
                  )
                  .map((item) => ({
                    ...item,
                    nowMoney: item.expected_revenues.reduce(
                      (total, curr) => total + curr.nowMoney,
                      0
                    ),
                  }))}
              />
            </div>
          </dialog>
        </>
      )}
    </div>
  );
};

export default SubContent;
