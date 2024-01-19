"use client";
import Select from "react-select";
import {
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import CurrencyInput from "react-currency-input-field";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getExpectedRevenue,
  updateExpectedRevenueDiscount,
} from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbPencilDiscount } from "react-icons/tb";
import item from "@/app/(app)/system/roles/item";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map(() => (
        <tr>
          {[...Array(9)].map(() => (
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

const Item = ({
  data,
  index,
  setData,
  revenue_type,
  i,
  group_id,
  discountsData,
}) => {
  const [checked, setChecked] = useState(false);
  console.log("discount data : ", discountsData);
  // console.log("data: ", data)

  const [mutating, setMutating] = useState(false);

  const { getToken } = useAuth();

  const [discount, setDiscount] = useState();

  const mutation = useMutation({
    mutationFn: async () =>
      updateExpectedRevenueDiscount(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        data.id,
        discount
      ),
    onSuccess: () => {
      setMutating(false);
      toast.success("Thêm giảm giá thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Thêm sự kiến thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  return (
    <>
      <tr className="hover">
        <td className={`${typeof i === "number" ? "text-right" : ""}`}>
          {typeof i === "number" ? `${index + 1}.${i + 1}` : index + 1}
        </td>
        <td>{data.revenue.name}</td>
        <td>{revenue_type.name}</td>
        <td>{numberWithCommas(data.previous_batch_money)} ₫</td>
        <td>{numberWithCommas(data.actual_amount_collected)} ₫</td>
        {/* <td className="text-center">{data.fullyear ? "✓" : "✗"}</td> */}
        <td>
          <>
            <CurrencyInput
              autoComplete="off"
              intlConfig={{ locale: "vi-VN", currency: "VND" }}
              className={`input input-xs`}
              value={data.amount_edited}
              onValueChange={(value) =>
                setData((pre) =>
                  pre.map((el) =>
                    el.id === group_id
                      ? {
                          ...el,
                          expected_revenues: el.expected_revenues.map((item) =>
                            item.id === data.id
                              ? { ...item, amount_edited: parseInt(value) }
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
              data.actual_amount_collected +
              data.amount_edited -
              data.amount_collected
          )}{" "}
          ₫
        </td>
        <td>
          <>
            <input
              type="text"
              className="input input-xs"
              value={data.note ? data.note : ""}
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
                                  note: e.target.value ? e.target.value : null,
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
        <td
          className="tooltip tooltip-left cursor-pointer"
          data-tip="Cập nhật giảm giá"
        >
          <button
            className={`w-full items-center justify-between flex pl-[15px] pr-[15px] pt-[15px] pb-[15px] hover:bg-[#ECECEC] ${
              checked ? "bg-[#ECECEC] rounded-lg" : ""
            }`}
            onClick={() => setChecked(!checked)}
          >
            <TbPencilDiscount size={20} />
          </button>
        </td>
      </tr>
      <tr>
        <td colspan="10">
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="p-[20px] flex flex-col items-center gap-5 w-full justify-center border-x border-b rounded-b-lg">
                  <h5>Thêm giảm giá: </h5>
                  <div className="grid grid-cols-4 gap-2 w-full justify-items-center">
                    <p>Giảm giá cho đối tượng mới nhập học</p>
                    <p>Trừ ưu đãi học phí</p>
                    <p>Trừ giảm học phí cho đối tượng chính sách</p>
                    <p>Trừ giảm học phí cho đối tượng đóng học phí cả năm</p>
                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input type="checkbox" className="checkbox" />
                              </label>
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountsData
                            .filter((item) => item.discount_type.id == 4)
                            .map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <label>
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                    />
                                  </label>
                                </td>
                                <td>{index + 1}. </td>
                                <td>{item.code}</td>
                                <td>{item.description}</td>
                                <td>{item.ratio * 100}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input type="checkbox" className="checkbox" />
                              </label>
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountsData
                            .filter((item) => item.discount_type.id == 1)
                            .map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <label>
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                    />
                                  </label>
                                </td>
                                <td>{index + 1}. </td>
                                <td>{item.code}</td>
                                <td>{item.description}</td>
                                <td>{item.ratio * 100}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input type="checkbox" className="checkbox" />
                              </label>
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountsData
                            .filter((item) => item.discount_type.id == 2)
                            .map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <label>
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                    />
                                  </label>
                                </td>
                                <td>{index + 1}. </td>
                                <td>{item.code}</td>
                                <td>{item.description}</td>
                                <td>{item.ratio * 100}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input type="checkbox" className="checkbox" />
                              </label>
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountsData
                            .filter((item) => item.discount_type.id == 3)
                            .map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <label>
                                    <input
                                      type="checkbox"
                                      className="checkbox"
                                    />
                                  </label>
                                </td>
                                <td>{index + 1}. </td>
                                <td>{item.code}</td>
                                <td>{item.description}</td>
                                <td>{item.ratio * 100}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <button
                    className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                    // onClick={()=>}
                  >
                    Lưu
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </td>
      </tr>
    </>
  );
};

const SubContent = ({ student, selectPresent, discounts }) => {
  // console.log("discouts", discounts);
  const { user } = useUser();
  const [mutating, setMutating] = useState(false);
  const [data, setData] = useState();

  const { getToken } = useAuth();
  const queryClient = useQueryClient();
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
      setData(expectedRevenue.data?.data?.result);
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

  console.log("expectedRevenue : ", expectedRevenue);

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
              <th>Điều chỉnh</th>
              <th>Số đã nộp trong kỳ</th>
              <th>Công nợ cuối kỳ</th>
              <th>Căn cứ điều chỉnh</th>
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
                .map((item, index) => {
                  if (item.expected_revenues.length === 0) {
                    return (
                      <tr className="hover">
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.revenue_type.name}</td>
                        <td className="text-center text-red-300" colSpan={8}>
                          Chưa có dự kiến thu
                        </td>
                      </tr>
                    );
                  }
                  if (item.expected_revenues.length === 1) {
                    console.log("item:", item);
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
                        discountsData={discounts.filter(
                          (obj) =>
                            obj.revenue_group.id ===
                            item.expected_revenues[0].revenue_group_id
                        )}
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
                          // console.log("el", el)
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
                              discountsData={discounts.filter(
                                (obj) =>
                                  obj.revenue_group.id === el.revenue_group_id
                              )}
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
      </div>
    </div>
  );
};

export default SubContent;
