"use client";

import Select from "react-select";
import { useContext, Fragment, useState, useEffect, useCallback } from "react";
import { meilisearchGetToken, meilisearchSearch } from "@/utils/funtionApi";
import { useInfiniteQuery } from "@tanstack/react-query";
import { IoCreateOutline } from "react-icons/io5";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createRevenueNorm } from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
const Item = ({ norm, setNorm }) => {
  const { listRevenue, calculationUnit } = useContext(listContext);

  useEffect(() => {
    if (norm.gruop) setNorm((pre) => ({ ...pre, type: null }));
  }, [norm.gruop]);
  return (
    <div className="flex flex-col gap-4 mt-3">
      {/* <div className="grid grid-cols-4 auto-rows-auto gap-2"> */}
      <Select
        noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
        placeholder="Nhóm khoản thu"
        options={listRevenue.revenue_group
          .sort((a, b) => a.id - b.id)
          .map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        value={norm.gruop}
        onChange={(e) => {
          if (norm.gruop?.value !== e.value)
            setNorm((pre) => ({ ...pre, gruop: e }));
        }}
        className="text-black text-sm"
        classNames={{
          control: () => "!rounded-[5px]",
          input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
          valueContainer: () => "!p-[0_8px]",
          menu: () => "!z-[11]",
        }}
      />
      {norm.gruop && (
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Loại khoản thu"
          options={listRevenue.revenue_group
            .find((item) => item.id === norm.gruop.value)
            .revenue_types.sort((a, b) => a.id - b.id)
            .map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          value={norm.type}
          onChange={(e) => setNorm((pre) => ({ ...pre, type: e }))}
          className="text-black text-sm"
          classNames={{
            control: () => "!rounded-[5px]",
            input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
        />
      )}
      {norm.type && (
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Khoản thu"
          options={listRevenue.revenue_group
            .find((item) => item.id === norm.gruop.value)
            .revenue_types.find((item) => item.id === norm.type.value)
            .revenues.map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={norm.revenue}
          onChange={(e) => setNorm((pre) => ({ ...pre, revenue: e }))}
          className="text-black text-sm"
          classNames={{
            control: () => "!rounded-[5px]",
            input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
        />
      )}
      {norm.revenue && (
        <>
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
          <div className={`w-full relative `}>
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
      {/* </div> */}
    </div>
  );
};

const HitItem = ({ hit, isRefetching }) => {
  const { selectPresent } = useContext(listContext);
  const [norm, setNorm] = useState({
    gruop: null,
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
      createRevenueNorm(token, objects, log),
    onSuccess: () => {
      // document.getElementById(`modal_${hit.code}`).close();
      toast.success("Tạo mới định mức thu cho học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setNorm({
        gruop: null,
        type: null,
        revenue: null,
        calculation_unit: null,
        price: 100000,
        quantity: 1,
        total: 100000,
      });
      setMutating(false);
    },
    onError: () => {
      toast.error("Tạo mới định mức thu cho học sinh không thành công!", {
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
    let objects = {
      revenue_code: norm.revenue.code,
      batch_id: selectPresent.value,
      calculation_unit_id: norm.calculation_unit.value,
      student_id: hit.id,
      amount: norm.quantity,
      unit_price: norm.price,
      created_by: user.id,
      start_at: moment().format(),
    };

    let log = {
      clerk_user_id: user.id,
      type: "create",
      table: "revenue_norms",
      data: {
        revenue_code: norm.revenue.code,
        batch_id: selectPresent.value,
        calculation_unit_id: norm.calculation_unit.value,
        student_id: hit.id,
        amount: norm.quantity,
        unit_price: norm.price,
        created_by: user.id,
        start_at: moment().format(),
      },
    };

    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
    });

    mutation.mutate({ token, objects, log });
    // } else {
    //   toast.error("Vui lòng nhập khoản thu!", {
    //     position: "top-center",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     theme: "light",
    //   });
    // }
  }, [norm]);
  return (
    <>
      <div className="hover:bg-hovercl flex gap-3 border-b">
        <p
          className="w-[20%] self-center"
          dangerouslySetInnerHTML={{ __html: hit._formatted.code }}
        />
        <p
          className="w-[40%] self-center"
          dangerouslySetInnerHTML={{
            __html: `${hit._formatted.first_name} ${hit._formatted.last_name}`,
          }}
        />
        <p
          className="w-[20%] self-center"
          dangerouslySetInnerHTML={{ __html: hit._formatted.class_name }}
        />
        <p className="self-center">
          {isRefetching ? (
            <span className="loading loading-spinner loading-xs self-center"></span>
          ) : (
            <label
              htmlFor={`modal_${hit.code}`}
              className="cursor-pointer"
              // onClick={() =>
              //   document.getElementById(`modal_${hit.code}`).showModal()
              // }
            >
              <div className="tooltip" data-tip="Lập định mức">
                <IoCreateOutline size={35} />
              </div>
            </label>
          )}
        </p>
      </div>
      <input
        type="checkbox"
        id={`modal_${hit.code}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_${hit.code}`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <Item norm={norm} setNorm={setNorm} />
          <div className="flex justify-center gap-2">
            {mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary"></span>
            ) : (
              <>
                {norm.gruop &&
                norm.type &&
                norm.revenue &&
                norm.calculation_unit &&
                norm.price &&
                norm.quantity &&
                norm.total ? (
                  <button className="btn w-fit" onClick={() => handleOnclick()}>
                    Hoàn thành
                  </button>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* <dialog id={`modal_${hit.code}`} className="modal">
        <div
          className="modal-box gap-3 flex flex-col"
          style={{ overflowY: "unset" }}
        >
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <Item norm={norm} setNorm={setNorm} />
          <div className="flex justify-center gap-2">
            {mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary"></span>
            ) : (
              <>
                {norm.gruop &&
                norm.type &&
                norm.revenue &&
                norm.calculation_unit &&
                norm.price &&
                norm.quantity &&
                norm.total ? (
                  <button className="btn w-fit" onClick={() => handleOnclick()}>
                    Hoàn thành
                  </button>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
      </dialog> */}
    </>
  );
};

const Search = ({ queryObject }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [`search`, queryObject],
    queryFn: async ({ pageParam = 1 }) =>
      meilisearchSearch(queryObject, await meilisearchGetToken(), pageParam),
    getNextPageParam: (res) => {
      if (res.page < res.totalPages) return res.page + 1;
      else return undefined;
    },
  });

  // toast.success("Tạo mới định mức thu cho cấp học thành công!", {
  //   position: "top-center",
  //   autoClose: 2000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   theme: "light",
  // });

  return status === "loading" ? (
    <span className="loading loading-spinner loading-lg self-center"></span>
  ) : status === "error" ? (
    <p className="self-center">Error: {error.message}</p>
  ) : (
    <div className="flex flex-col gap-[10px] w-full">
      {data.pages[0].hits.length === 0 ? (
        <h5 className="text-center">Không tìm thấy kết quả</h5>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex gap-3">
              <p className="font-semibold w-[20%]">Mã học sinh</p>
              <p className="font-semibold w-[40%]">Họ tên</p>
              <p className="font-semibold w-[20%]">Lớp</p>
            </div>
            {data.pages.map((item, index) => {
              return (
                <Fragment key={index}>
                  {item.hits.map((el) => (
                    <Fragment key={el._ab_pk}>
                      <HitItem hit={el} isRefetching={isRefetching} />
                    </Fragment>
                  ))}
                </Fragment>
              );
            })}
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
      )}
      {/* <div className="flex justify-center">
        {isFetching && !isFetchingNextPage ? (
          <span className="loading loading-infinity loading-lg"></span>
        ) : null}
      </div> */}
    </div>
  );
};

const Student = () => {
  const { listSearch } = useContext(listContext);
  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
    query: "",
  });

  return (
    <div className="flex flex-col gap-3">
      <h5>Tìm kiếm học sinh:</h5>
      <div className="grid grid-cols-3 auto-rows-auto gap-2">
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Cấp học!"
          classNames={{
            // control: () => "!rounded-[5px]",
            // input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            // valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
          options={listSearch.school_level
            .sort((a, b) => a.code - b.code)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected.school}
          onChange={(e) =>
            e.value !== selected.school?.value &&
            setSelected((pre) => ({
              ...pre,
              school: e,
              class_level: null,
              class: null,
            }))
          }
          className="text-black w-full"
        />

        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Khối lớp!"
          options={
            selected.school
              ? listSearch.class_level
                  .filter(
                    (item) => item.school_level_id === selected.school.value
                  )
                  .sort((a, b) => a.code - b.code)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
              : listSearch.class_level
                  .sort((a, b) => a.code - b.code)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
          }
          value={selected.class_level}
          onChange={(e) =>
            e.value !== selected.class_level?.value &&
            setSelected((pre) => ({ ...pre, class_level: e, class: null }))
          }
          className="text-black w-full"
        />

        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Lớp!"
          options={
            selected.class_level
              ? listSearch.classes
                  .filter(
                    (item) => item.class_level_id === selected.class_level.value
                  )
                  .sort((a, b) => a.class_level_id - b.class_level_id)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
              : listSearch.classes
                  .sort((a, b) => a.class_level_id - b.class_level_id)
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
          }
          value={selected.class}
          onChange={(e) =>
            e.value !== selected.class?.value &&
            setSelected((pre) => ({ ...pre, class: e }))
          }
          className="text-black w-full"
        />

        <div className={`w-full relative col-span-2`}>
          <input
            autoComplete="off"
            type={"text"}
            id={`query`}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
            placeholder="Tìm kiếm"
            value={selected.query}
            onChange={(e) => {
              setSelected((pre) => ({ ...pre, query: e.target.value }));
            }}
          />
          <label
            htmlFor={`query`}
            className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
          >
            Tìm kiếm
          </label>
        </div>

        {/* <button className="btn w-fit">Tìm kiếm</button> */}
      </div>
      <Search queryObject={selected} />
    </div>
  );
};

export default Student;
