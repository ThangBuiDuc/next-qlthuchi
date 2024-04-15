import { listContext } from "../../content";
import Select from "react-select";
import { useCallback, useContext, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
// import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { createTicketExpectedRevenueRouter } from "@/utils/funtionApi";
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
          <p className="text-xs">Loại khoản thu:</p>
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
                .revenues.filter((item) =>
                  getMonthsBetween(
                    parseInt(selectPresent.start_day.split("-")[1]),
                    parseInt(selectPresent.end_day.split("-")[1])
                  ).includes(item.position)
                )
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

const Content = ({ selected }) => {
  const { selectPresent, listRevenue } = useContext(listContext);

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
  });
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    if (selected)
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
  }, [selected]);

  const mutation = useMutation({
    mutationFn: ({ norm, time, selectPresent }) =>
      createTicketExpectedRevenueRouter({
        type: "CLASS",
        data: [selected.name],
        norm,
        batch_id: selectPresent.id,
        time,
        revenue: listRevenue.revenue_types
          .find((item) => item.id === norm.type.value)
          .revenue_groups.find((item) => item.id === norm.group.value)
          .revenues.filter((item) =>
            getMonthsBetween(
              parseInt(norm.revenue.position),
              parseInt(selectPresent.end_day.split("-")[1])
            ).includes(item.position)
          ),
        // .filter((item) => item.position >= norm.revenue.position),
      }),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["get_revenue_norms", selected],
      // });
      toast.success("Tạo mới dự kiến thu vé ăn cho lớp học thành công!", {
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
      toast.error("Tạo mới dự kiến thu vé ăn cho lớp học không thành công!", {
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
  }, [norm, selected]);
  return (
    <div className="flex flex-col pr-3 gap-2">
      <h6 className="text-center">Dự kiến thu</h6>
      {selected && (
        <div className="flex flex-col gap-1">
          {norm && (
            <>
              <Item
                norm={norm}
                setNorm={setNorm}
                school_level_code={selected.school_level_code}
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
                    <button
                      className="btn w-fit"
                      onClick={() => handleOnclick()}
                    >
                      Hoàn thành
                    </button>
                    <div
                      className="tooltip flex items-center justify-center"
                      data-tip="Dự kiến sẽ tự động cân đối tiền của số vé thừa kỳ trước. Cân nhắc kiểm tra nếu đã lập dự kiến thu trước đó!"
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
      )}
    </div>
  );
};

const Class = () => {
  const { listSearch } = useContext(listContext);
  const [selected, setSelected] = useState();
  return (
    <>
      <div className="flex gap-1 items-center w-full">
        <h6>Lớp học: </h6>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearch.classes
            .sort(
              (a, b) =>
                a.class_level_code - b.class_level_code ||
                a.code.localeCompare(b.code)
            )
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
          classNames={{
            menu: () => "!z-[11]",
          }}
        />
      </div>
      {selected && <Content selected={selected} />}
    </>
  );
};

export default Class;
