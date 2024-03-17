"use client";
import {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getExpectedRevenue,
  createExpectedRevenueDiscount,
  getExpectedRevenueDiscount,
} from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbPencilDiscount } from "react-icons/tb";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <tr key={i}>
          {[...Array(9)].map((_, ii) => (
            <td key={ii}>
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
  const [checkedDiscount, setCheckedDiscount] = useState();
  console.log("discount data : ", discountsData);
  console.log("data: ", data);


  //====== Danh sách các mã giảm giá đã lưu của một khoản thu ================================================
  const expectedRevenueDiscount = useQuery({
    queryKey: ["get_expected_revenue", data.id],
    queryFn: async () =>
    getExpectedRevenueDiscount(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        data.id
      ),
  });

  useLayoutEffect(() => {
    if (expectedRevenueDiscount.data) {
      setCheckedDiscount(expectedRevenueDiscount.data?.data?.result);
    }
  }, [expectedRevenueDiscount.data]);

  console.log("mã giảm giá đã lưu: ",checkedDiscount);



  //===========================================================================================================
  const getBiggestRatioInCheckedList = (data) => {
    // Filter the checked items
    const checkedItems = data.filter((item) => item.isChecked);
    if (checkedItems.length === 0) {
      return null;
    }

    const biggestRatioItem = checkedItems.reduce((maxItem, currentItem) => {
      return currentItem.ratio > maxItem.ratio ? currentItem : maxItem;
    });

    return biggestRatioItem;
  };

  //================================= bảng giảm giá theo nhập học =============================================
  const [a, setA] = useState(data.prescribed_money);
  const [discountAData, setDiscountAData] = useState([]);
  // useEffect(() => {
  //   // Filter and map the discounts data
  //   const filteredAData = discountsData
  //     ?.filter((item) => item.discount_type.id == 4)
  //     .map((item) => ({ 
  //       ...item, 
  //       isChecked: false 
  //     }));
  //   setDiscountAData(filteredAData);
  // }, [discountsData]);

  useEffect(() => {
    // Filter and map the discounts data
    const filteredAData = discountsData
      ?.filter((item) => item.discount_type.id === 4)
      .map((item) => {
        const checkedItem = checkedDiscount?.find((el) => el.discount_id === item.id && el.status == true);
        if (checkedItem) {
          // If item is found in checkedDiscount, set isChecked to true
          return {
            ...item,
            isChecked: true
          };
        } else {
          // If item is not found in checkedDiscount, set isChecked to false
          return {
            ...item,
            isChecked: false
          };
        }
      });
    setDiscountAData(filteredAData);
  }, [discountsData, checkedDiscount]);
  // console.log("discountAData:", discountAData);

  const toggleItemA = (index) => {
    setDiscountAData(
      discountAData.map((item, i) => {
        if (i == index) {
          return {
            ...item,
            isChecked: !item.isChecked,
          };
        } else {
          return {
            ...item,
            isChecked: false,
          };
        }
      })
    );
  };

  useEffect(() => {
    const checkedItemA = discountAData.filter((item) => item.isChecked);
    if (checkedItemA.length === 0) {
      setA(data.prescribed_money);
    } else {
      // Assuming you meant to iterate over checked items
      const discountedValue = checkedItemA.reduce((acc, item) => {
        return acc * (1 - item.ratio);
      }, data.prescribed_money);
      setA(discountedValue);
    }
  }, [discountAData, data.prescribed_money]);

  // console.log("a:", a);

  //================================= bảng ưu đãi (b)=============================================
  const [b, setB] = useState(0);
  const [discountBData, setDiscountBData] = useState([]);
  // useEffect(() => {
  //   // Filter and map the discounts data
  //   const filteredData = discountsData
  //     ?.filter((item) => item.discount_type.id === 1)
  //     .map((item) => ({ ...item, isChecked: false }));
  //   setDiscountBData(filteredData);
  // }, [discountsData]);
  // console.log(discountBData);


  useEffect(() => {
    // Filter and map the discounts data
    const filteredBData = discountsData
      ?.filter((item) => item.discount_type.id === 1)
      .map((item) => {
        const checkedItem = checkedDiscount?.find((el) => el.discount_id === item.id && el.status == true);
        if (checkedItem) {
          // If item is found in checkedDiscount, set isChecked to true
          return {
            ...item,
            isChecked: true
          };
        } else {
          // If item is not found in checkedDiscount, set isChecked to false
          return {
            ...item,
            isChecked: false
          };
        }
      });
    setDiscountBData(filteredBData);
  }, [discountsData, checkedDiscount]);

  const [checkedAllb, setCheckedAllb] = useState(false);

  const selectAllb = () => {
    setCheckedAllb(!checkedAllb);
    setDiscountBData(
      discountBData.map((item) => ({
        ...item,
        isChecked: !checkedAllb,
      }))
    );
  };

  const toggleItemB = (index) => {
    setDiscountBData(
      discountBData.map((item, i) => {
        if (i == index) {
          return {
            ...item,
            isChecked: !item.isChecked,
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (discountBData.length !== 0) {
      setCheckedAllb(discountBData.every((item) => item.isChecked));
    }
  }, [discountBData]);

  useEffect(() => {
    if (getBiggestRatioInCheckedList(discountBData) !== null) {
      setB(a * getBiggestRatioInCheckedList(discountBData).ratio);
    } else {
      setB(0);
    }
  }, [a, discountBData]);

  // console.log("b:",b)

  //================================= bảng đối tượng chính sách (c)=============================================
  const [c, setC] = useState(0);
  const [discountCData, setDiscountCData] = useState([]);
  // useEffect(() => {
  //   // Filter and map the discounts data
  //   const filteredCData = discountsData
  //     ?.filter((item) => item.discount_type.id === 2)
  //     .map((item) => ({ ...item, isChecked: false }));
  //   setDiscountCData(filteredCData);
  // }, [discountsData]);


  useEffect(() => {
    // Filter and map the discounts data
    const filteredCData = discountsData
      ?.filter((item) => item.discount_type.id === 2)
      .map((item) => {
        const checkedItem = checkedDiscount?.find((el) => el.discount_id === item.id && el.status == true);
        if (checkedItem) {
          // If item is found in checkedDiscount, set isChecked to true
          return {
            ...item,
            isChecked: true
          };
        } else {
          // If item is not found in checkedDiscount, set isChecked to false
          return {
            ...item,
            isChecked: false
          };
        }
      });
    setDiscountCData(filteredCData);
  }, [discountsData, checkedDiscount]);

  // console.log(discountCData);
  const [checkedAllc, setCheckedAllc] = useState(false);

  const selectAllc = () => {
    setCheckedAllc(!checkedAllc);
    setDiscountCData(
      discountCData.map((item) => ({
        ...item,
        isChecked: !checkedAllc,
      }))
    );
  };

  const toggleItemC = (index) => {
    setDiscountCData(
      discountCData.map((item, i) => {
        if (i == index) {
          return {
            ...item,
            isChecked: !item.isChecked,
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (discountCData.length !== 0) {
      setCheckedAllc(discountCData.every((item) => item.isChecked));
    }
  }, [discountCData]);

  useEffect(() => {
    if (getBiggestRatioInCheckedList(discountCData) !== null) {
      setC((a - b) * getBiggestRatioInCheckedList(discountCData).ratio);
    } else {
      setC(0);
    }
  }, [a, b, discountCData]);

  // console.log("c:",c)

  //================================= bảng trừ giảm đối tượng đóng học phí cả năm (d)=============================================
  const [d, setD] = useState(0);
  const [discountDData, setDiscountDData] = useState([]);
  // useEffect(() => {
  //   // Filter and map the discounts data
  //   const filteredDData = discountsData
  //     ?.filter((item) => item.discount_type.id === 3)
  //     .map((item) => ({ ...item, isChecked: false }));
  //   setDiscountDData(filteredDData);
  // }, [discountsData]);
  // console.log(discountDData);


  useEffect(() => {
    // Filter and map the discounts data
    const filteredDData = discountsData
      ?.filter((item) => item.discount_type.id === 3)
      .map((item) => {
        const checkedItem = checkedDiscount?.find((el) => el.discount_id === item.id && el.status == true);
        if (checkedItem) {
          // If item is found in checkedDiscount, set isChecked to true
          return {
            ...item,
            isChecked: true
          };
        } else {
          // If item is not found in checkedDiscount, set isChecked to false
          return {
            ...item,
            isChecked: false
          };
        }
      });
    setDiscountDData(filteredDData);
  }, [discountsData, checkedDiscount]);

  const [checkedAlld, setCheckedAlld] = useState(false);

  const selectAlld = () => {
    setCheckedAlld(!checkedAlld);
    setDiscountDData(
      discountDData.map((item) => ({
        ...item,
        isChecked: !checkedAlld,
      }))
    );
  };

  const toggleItemD = (index) => {
    setDiscountDData(
      discountDData.map((item, i) => {
        if (i == index) {
          return {
            ...item,
            isChecked: !item.isChecked,
          };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    if (discountDData.length !== 0) {
      setCheckedAlld(discountDData.every((item) => item.isChecked));
    }
  }, [discountDData]);

  useEffect(() => {
    if (getBiggestRatioInCheckedList(discountDData) !== null) {
      setD((a - b - c) * getBiggestRatioInCheckedList(discountDData).ratio);
    } else {
      setD(0);
    }
  }, [a, b, c, discountDData]);

  // console.log("d:",d)

  //===================================== Số tiền giảm giá ===================================================
  const [discount, setDiscount] = useState(0);
  useEffect(() => {
    setDiscount(parseInt((data.prescribed_money - (a - b - c - d)).toFixed(0)));
  }, [a, b, c, d]);

  //===================================== Format dữ liệu API ==================================================
  const [formattedDiscounts, setFormattedDiscounts] = useState();
  useEffect(() => {
    const mergedDiscounts = [
      ...discountAData,
      ...discountBData,
      ...discountCData,
      ...discountDData,
    ];
    setFormattedDiscounts(
      mergedDiscounts.map((item) => ({
        expected_revenue_id: data.id,
        discount_id: item.id,
        status: item.isChecked,
      }))
    );
  }, [discountAData, discountBData, discountCData, discountDData]);

  console.log("dữ liệu api:", formattedDiscounts);

  //==================================== API update mã giảm giá cho khoản thu ==================================
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ token, id, discount, objects }) =>
      createExpectedRevenueDiscount(token, id, discount, objects),
    onSuccess: () => {
      queryClient.invalidateQueries(["get_expected_revenue"]);
      toast.success("Cập nhật mã giảm giá cho khoản thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      toast.error("Cập nhật mã giảm giá cho khoản thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnSubmit = useCallback(async () => {
    let objects = formattedDiscounts;
    let id = data.id;
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, id, discount, objects });
  }, [formattedDiscounts, discount]);

  return (
    <>
      <tr className="hover">
        <td className={`${typeof i === "number" ? "text-right" : ""}`}>
          {typeof i === "number" ? `${index + 1}.${i + 1}` : index + 1}
        </td>
        <td>{data.revenue.name}</td>
        <td>{revenue_type.name}</td>
        <td>{numberWithCommas(data.prescribed_money)} đ</td>
        <td>{numberWithCommas(data.discount)} đ</td>
        <td>{numberWithCommas(data.previous_batch_money)} ₫</td>
        <td>{numberWithCommas(data.actual_amount_collected)} ₫</td>
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
        <td
          className="tooltip tooltip-left cursor-pointer"
          data-tip="Cập nhật giảm giá"
        >
          {discountsData.length ? (
            <button
              className={`w-full items-center justify-between flex pl-[15px] pr-[15px] pt-[15px] pb-[15px] hover:bg-[#ECECEC] ${
                checked ? "bg-[#ECECEC] rounded-lg" : ""
              }`}
              onClick={() => setChecked(!checked)}
            >
              <TbPencilDiscount size={20} />
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
      <tr>
        <td colSpan="10">
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

                    {/* bảng giảm giá theo thời gian nhập học */}
                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              {/* <label>
                                <input type="checkbox" className="checkbox" />
                              </label> */}
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountAData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <label key={index}>
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={item.isChecked}
                                    onChange={() => toggleItemA(index)}
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

                    {/* bảng ưu đãi học phí */}
                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  onChange={() => selectAllb()}
                                  checked={checkedAllb}
                                />
                              </label>
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountBData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <label key={index}>
                                  <input
                                    key={index}
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={() => toggleItemB(index)}
                                    checked={item.isChecked}
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

                    {/* bảng đối tượng chính sách */}
                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  onChange={() => selectAllc()}
                                  checked={checkedAllc}
                                />
                              </label>
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountCData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={() => toggleItemC(index)}
                                    checked={item.isChecked}
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

                    {/* bảng trừ giảm đối tượng đóng học phí cả năm */}
                    <div className="overflow-x-auto  border rounded-md">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th>
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  onChange={() => selectAlld()}
                                  checked={checkedAlld}
                                />
                              </label>
                            </th>
                            <th>STT</th>
                            <th>Mã giảm</th>
                            <th>Mô tả</th>
                            <th>Tỉ lệ(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountDData?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <label>
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    onChange={() => toggleItemD(index)}
                                    checked={item.isChecked}
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
                  {discount == 0 ? null : (
                    <h6>Số tiền giảm giá: {numberWithCommas(discount)} ₫</h6>
                  )}
                  <button
                    className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                    onClick={() => {
                      handleOnSubmit();
                    }}
                  >
                    {mutation.isLoading ? (
                      <span className="loading loading-spinner loading-sm bg-primary"></span>
                    ) : (
                      "Lưu"
                    )}
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

  // console.log("expectedRevenue : ", expectedRevenue);

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
              <th>Số tiền quy định</th>
              <th>Số tiền giảm giá</th>
              <th>Công nợ đầu kỳ</th>
              <th>Số phải nộp kỳ này</th>
              {/* <th>Nộp cả năm</th> */}
              {/* <th>Điều chỉnh</th> */}
              <th>Số đã nộp trong kỳ</th>
              <th>Công nợ cuối kỳ</th>
              {/* <th>Căn cứ điều chỉnh</th> */}
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
              <tr key={data.id}>
                <td colSpan={10} className="text-center">
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
                      <tr className="hover" key={item.id}>
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
                    // console.log("item:", item);
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
