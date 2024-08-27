import Select from "react-select";
import { listContext } from "./content";
import { useCallback, useContext, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createRevenueNorm } from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";

const Item = ({ norm, setNorm, school_level_code }) => {
  const { listRevenue, calculationUnit } = useContext(listContext);

  // useEffect(() => {
  //   if (norm.group) setNorm((pre) => ({ ...pre, type: null }));
  // }, [norm.group]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-2 auto-rows-auto gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs">Loại khoản thu:</p>
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Loại khoản thu"
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
            className="text-black text-sm"
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
            <p className="text-xs">Nhóm khoản thu:</p>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Nhóm khoản thu"
              options={listRevenue.revenue_types
                .find((item) => item.id === norm.type.value)
                .revenue_groups.filter((item) =>
                  item.scope.some((el) => el === school_level_code)
                )
                .filter((item) => item.id !== 12)
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
              className="text-black text-sm"
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
            <p className="text-xs">Khoản thu:</p>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Khoản thu"
              options={listRevenue.revenue_types
                .find((item) => item.id === norm.type.value)
                .revenue_groups.find((item) => item.id === norm.group.value)
                .revenues.map((item) => {
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
              className="text-black text-sm"
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
              <p className="text-xs ">Đơn vị tính:</p>
              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Đơn vị tính"
                options={calculationUnit.calculation_units.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={norm.calculation_unit}
                onChange={(e) =>
                  setNorm((pre) => ({ ...pre, calculation_unit: e }))
                }
                className="text-black text-sm"
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
                type={"number"}
                id={`quantity_${norm.id}`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
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
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Số lượng
              </label>
            </div>
            <div className={`w-full relative `}>
              <CurrencyInput
                autoComplete="off"
                id={`price_${norm.id}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
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
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Đơn giá
              </label>
            </div>
            <div className={`w-full relative col-span-2`}>
              <CurrencyInput
                autoComplete="off"
                disabled
                id={`total_${norm.id}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={typeof norm.total === "number" ? norm.total : "NaN"}
                decimalsLimit={2}
                onValueChange={(value) =>
                  setNorm((pre) => ({ ...pre, total: value }))
                }
              />
              <label
                htmlFor={`total_${norm.id}`}
                className={`!cursor-not-allowe absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
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

const LeftPanel = () => {
  const queryClient = useQueryClient();
  const { selectPresent, student } = useContext(listContext);
  const [norm, setNorm] = useState({
    group: null,
    type: null,
    revenue: null,
    calculation_unit: null,
    price: 100000,
    quantity: 1,
    total: 100000,
  });
  const [mutating, setMutating] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  const mutation = useMutation({
    mutationFn: ({ token, objects, log }) =>
      createRevenueNorm(token, objects, [log]),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_revenue_norms", student.code],
      });
      // toast.success("Tạo mới định mức thu cho cấp học thành công!", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   theme: "light",
      // });
      setNorm({
        group: null,
        type: null,
        revenue: null,
        calculation_unit: null,
        price: 100000,
        quantity: 1,
        total: 100000,
      });
      // setMutating(false);
      Swal.fire({
        title: "Lập định mức thu cho học sinh",
        text: "Lập định mức thu cho học sinh thành công",
        icon: "success",
      });
    },
    onError: () => {
      // toast.error("Tạo mới định mức thu cho cấp học không thành công!", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   theme: "light",
      // }),
      //   setMutating(false);
      Swal.fire({
        title: "Lập định mức thu cho học sinh",
        text: "Lập định mức thu cho học sinh không thành công",
        icon: "error",
      });
    },
  });

  const handleOnclick = useCallback(async () => {
    // setMutating(true);
    let time = moment().format();
    let objects = {
      revenue_code: norm.revenue.code,
      revenue_group_id: norm.group.value,
      batch_id: selectPresent.id,
      calculation_unit_id: norm.calculation_unit.value,
      student_code: student.code,
      amount: norm.quantity,
      unit_price: norm.price,
      created_by: user.id,
      start_at: time,
    };

    let log = {
      clerk_user_id: user.id,
      type: "create",
      table: "revenue_norms",
      data: {
        revenue_code: norm.revenue.code,
        revenue_group_id: norm.group.value,
        batch_id: selectPresent.id,
        calculation_unit_id: norm.calculation_unit.value,
        student_code: student.code,
        amount: norm.quantity,
        unit_price: norm.price,
        created_by: user.id,
        start_at: time,
      },
    };

    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    Swal.fire({
      title: "Lập định mức thu cho học sinh",
      text: "Bạn có chắc chắn muốn lập định mức thu cho học sinh? Những định mức thu trùng sẽ bị thay thế bằng các định mức thu mới!",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#134a9abf",
      confirmButtonText: "Lập định mức",
      cancelButtonText: "Huỷ",
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () =>
        await mutation.mutateAsync({ token, objects, log }),
      icon: "question",
      showLoaderOnConfirm: true,
    });

    // mutation.mutate({ token, objects, log });
  }, [norm]);
  return (
    <div className="flex flex-col pr-3 w-[40%] gap-2">
      <h6 className="text-center">Định mức thu</h6>
      <div className="flex flex-col gap-1">
        {norm && (
          <>
            <Item
              norm={norm}
              setNorm={setNorm}
              school_level_code={student.school_level_code}
            />
          </>
        )}
        <div className="flex justify-center gap-2">
          {mutating ? (
            <span className="loading loading-spinner loading-sm bg-primary"></span>
          ) : (
            <>
              {norm.group &&
              norm.type &&
              norm.revenue &&
              norm.calculation_unit &&
              norm.price &&
              norm.quantity &&
              norm.total ? (
                <>
                  <button className="btn w-fit" onClick={() => handleOnclick()}>
                    Hoàn thành
                  </button>
                  <div
                    className="tooltip flex items-center justify-center"
                    data-tip="Định mức thu trùng lặp sẽ lấy định mức thu thêm vào mới nhất!"
                  >
                    <IoIosInformationCircleOutline
                      size={20}
                      className="text-red-500"
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
