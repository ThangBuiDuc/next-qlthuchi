"use client";
import { listContext } from "../content";
import { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteRevenueNorm,
  getRevenueNorms,
  updateRevenueNorm,
} from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import { TbReload } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import Select from "react-select";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import CurrencyInput from "react-currency-input-field";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const UpdateModal = ({ data, queryKey }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [mutating, setMutating] = useState(false);
  const { calculationUnit, selectPresent } = useContext(listContext);
  const [norm, setNorm] = useState({
    calculation_unit: {
      value: data.calculation_unit.id,
      label: calculationUnit.calculation_units.find(
        (item) => item.id === data.calculation_unit.id
      ).name,
    },
    amount: data.amount,
    unit_price: data.unit_price,
    total: data.unit_price * data.amount,
  });
  const updateRef = useRef();
  const [updateDescription, setUpdateDescription] = useState("");

  const updateMutation = useMutation({
    mutationFn: async () => {
      let time = moment().format();
      return updateRevenueNorm(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),

        {
          _set: {
            end_at: time,
            updated_at: time,
            updated_by: user.id,
            description: updateDescription ? updateDescription : null,
          },
          where: {
            id: {
              _eq: data.id,
            },
          },
        },
        {
          batch_id: selectPresent.id,
          created_by: user.id,
          revenue_code: data.revenue_code,
          class_code: data.class_code,
          unit_price: norm.unit_price,
          amount: norm.amount,
          start_at: time,
        },
        {
          clerk_user_id: user.id,
          type: "update",
          table: "revenue_norms",
          description: updateDescription,
          oldData: {
            id: data.id,
            batch_id: selectPresent.id,
            created_by: data.created_by,
            revenue_code: data.revenue_code,
            class_code: data.class_code,
            calculation_unit: data.calculation_unit.id,
            unit_price: data.unit_price,
            amount: data.amount,
            start_at: data.start_at,
            end_at: time,
          },
          newData: {
            created_by: user.id,
            batch_id: selectPresent.id,
            revenue_code: data.revenue_code,
            class_code: data.class_code,
            calculation_unit: norm.calculation_unit.id,
            unit_price: norm.unit_price,
            amount: norm.amount,
            start_at: time,
          },
        }
      );
    },
    onSuccess: () => {
      // document.getElementById(`modal_delete_${data.id}`).checked = false;
      updateRef.current.checked = false;
      setMutating(false);
      queryClient.invalidateQueries({
        queryKey: ["get_revenue_norms", queryKey],
      });
      toast.success("Sửa định mức thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Sửa định mức thu không thành công!", {
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
      <input
        ref={updateRef}
        type="checkbox"
        id={`modal_update_${data.id}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 !max-h-none !pt-10 !max-w-xl"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_update_${data.id}`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <h5 className="text-center">Sửa định mức thu: {data.revenue.name}</h5>
          <div className="grid grid-cols-2 auto-rows-auto gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Loại khoản thu:</p>
              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Loại khoản thu"
                value={{
                  value: data.revenue.revenue_group.revenue_type.id,
                  label: data.revenue.revenue_group.revenue_type.name,
                }}
                isDisabled
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs">Nhóm khoản thu:</p>

              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Nhóm khoản thu"
                isDisabled
                value={{
                  value: data.revenue.revenue_group.id,
                  label: data.revenue.revenue_group.name,
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

            <div className="flex flex-col gap-1">
              <p className="text-xs">Khoản thu:</p>
              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Khoản thu"
                isDisabled
                value={{
                  value: data.revenue.id,
                  label: data.revenue.name,
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
            <div className="flex flex-col gap-1">
              <p className="text-xs">Đơn vị tính:</p>
              <Select
                noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                placeholder="Đơn vị tính"
                // options={calculationUnit.calculation_units.map((item) => ({
                //   value: item.id,
                //   label: item.name,
                // }))}
                isDisabled
                value={norm.calculation_unit}
                // onChange={(e) =>
                //   setNorm((pre) => ({ ...pre, calculation_unit: e }))
                // }
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
                id={`quantity_${norm}`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Số lượng"
                value={norm.amount}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                onChange={(e) => {
                  setNorm((pre) => ({
                    ...pre,
                    amount: parseInt(e.target.value).toString(),
                    total: parseInt(e.target.value) * parseInt(pre.unit_price),
                  }));
                }}
              />
              <label
                htmlFor={`quantity_${norm}`}
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Số lượng
              </label>
            </div>
            <div className={`w-full relative `}>
              <CurrencyInput
                autoComplete="off"
                id={`price_${norm}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={norm.unit_price}
                decimalsLimit={2}
                onValueChange={(value) => {
                  setNorm((pre) => ({
                    ...pre,
                    unit_price: parseInt(value),
                    total: parseInt(value) * parseInt(pre.amount),
                  }));
                }}
              />
              <label
                htmlFor={`price_${norm}`}
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Đơn giá
              </label>
            </div>
            <div className={`w-full relative col-span-2`}>
              <CurrencyInput
                autoComplete="off"
                disabled
                id={`total_${norm}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={typeof norm.total === "number" ? norm.total : "NaN"}
                decimalsLimit={2}
              />
              <label
                htmlFor={`total_${norm}`}
                className={`!cursor-not-allowe absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Tổng tiền
              </label>
            </div>
          </div>
          <label className="form-control">
            <textarea
              className="textarea textarea-bordered h-24 resize-none"
              placeholder="Ghi chú"
              value={updateDescription}
              onChange={(e) => setUpdateDescription(e.target.value)}
            ></textarea>
          </label>

          {mutating ? (
            <span className="loading loading-spinner loading-md self-center"></span>
          ) : (
            <button
              className="btn w-fit self-center"
              onClick={() => {
                setMutating(true);
                updateMutation.mutate();
              }}
            >
              Sửa
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const DeleteModal = ({ data, queryKey }) => {
  const deleteRef = useRef();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { selectPresent } = useContext(listContext);
  const [deleteDescription, setDeleteDescription] = useState("");

  const [mutating, setMutating] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      let time = moment().format();
      return deleteRevenueNorm(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        {
          end_at: time,
          deleted_at: time,
          deleted_by: user.id,
          is_deleted: true,
        },
        { id: { _eq: data.id } },
        {
          clerk_user_id: user.id,
          type: "delete",
          data: {
            id: data.id,
            batch_id: selectPresent.id,
            revenue_code: data.revenue_code,
            class_id: data.class_id,
            calculation_unit: data.calculation_unit.id,
            unit_price: data.unit_price,
            amount: data.amount,
            end_at: time,
            description: deleteDescription ? deleteDescription : null,
          },
        }
      );
    },
    onSuccess: () => {
      // document.getElementById(`modal_delete_${data.id}`).checked = false;
      deleteRef.current.checked = false;
      setMutating(false);
      queryClient.invalidateQueries({
        queryKey: ["get_revenue_norms", queryKey],
      });
      toast.success("Xoá định mức thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Xoá định mức thu không thành công!", {
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
      <input
        ref={deleteRef}
        type="checkbox"
        id={`modal_delete_${data.id}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 !max-h-none !pt-10"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_delete_${data.id}`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <h5 className="text-center">Xoá định mức thu: {data.revenue.name}</h5>
          <label className="form-control">
            <textarea
              className="textarea textarea-bordered h-24 resize-none"
              placeholder="Ghi chú"
              value={deleteDescription}
              onChange={(e) => setDeleteDescription(e.target.value)}
            ></textarea>
          </label>
          {mutating ? (
            <span className="loading loading-spinner loading-md self-center"></span>
          ) : (
            <button
              className="btn w-fit self-center"
              onClick={() => {
                setMutating(true);
                deleteMutation.mutate();
              }}
            >
              Xoá
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const Item = ({ data, isRefetching, queryKey }) => {
  return (
    <tr className="hover">
      <td>{data.revenue.code}</td>
      <td>
        {data.revenue.name}
        <br />
        <span className="badge badge-ghost badge-sm">
          {data.revenue.revenue_group.name}
        </span>
      </td>
      <td>
        {data.amount}
        <br />
        <span className="badge badge-ghost badge-sm">
          {data.calculation_unit.name}
        </span>
      </td>
      <td>{numberWithCommas(data.unit_price) + "đ"}</td>
      <td>{numberWithCommas(data.unit_price * data.amount)}đ</td>
      <th>
        {isRefetching ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <>
            <div className="flex gap-2">
              <label htmlFor={`modal_update_${data.id}`}>
                <div className="tooltip  cursor-pointer" data-tip="Sửa">
                  <FaRegEdit size={30} />
                </div>
              </label>

              <label htmlFor={`modal_delete_${data.id}`}>
                <div className="tooltip  cursor-pointer" data-tip="Xoá">
                  <IoTrashBinOutline size={30} />
                </div>
              </label>
            </div>
          </>
        )}
      </th>
      {/* UPDATE MODAL */}
      <UpdateModal data={data} queryKey={queryKey} />

      {/* DELETE MODAL */}
      <DeleteModal data={data} queryKey={queryKey} />
    </tr>
  );
};

const Content = ({ queryKey, selectPresent }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const where = {
    batch_id: {
      _eq: selectPresent.id,
    },
    class_code: {
      _eq: queryKey.name,
    },
    is_deleted: {
      _eq: false,
    },
    end_at: {
      _is_null: true,
    },
  };
  const revenueNorms = useQuery({
    queryKey: ["get_revenue_norms", queryKey],
    queryFn: async () =>
      getRevenueNorms(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        where
      ),
  });

  if (revenueNorms.isFetching && revenueNorms.isLoading) {
    return (
      <div className="flex flex-col justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (revenueNorms.isError) {
    throw new Error();
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            {/* <th></th> */}
            <th>Mã khoản thu</th>
            <th>Khoản thu</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
            <th>
              <div
                className="tooltip tooltip-left cursor-pointer"
                data-tip="Tải lại"
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["get_revenue_norms", queryKey],
                  });
                }}
              >
                <TbReload size={30} />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {revenueNorms.data.data.result.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                Không có kết quả!
              </td>
            </tr>
          ) : (
            revenueNorms.data.data.result.map((item) => (
              <Item
                key={item.id}
                data={item}
                isRefetching={revenueNorms.isRefetching}
                queryKey={queryKey}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const Class = () => {
  const { listSearch, selectPresent } = useContext(listContext);
  const [selected, setSelected] = useState();
  return (
    <>
      <div className="flex gap-1 items-center w-full">
        <h5>Lớp học: </h5>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearch.classes
            .sort((a, b) => a.code - b.code)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
        />
      </div>
      <h5 className="text-center">Định mức thu</h5>
      {selected && (
        <Content queryKey={selected} selectPresent={selectPresent} />
      )}
    </>
  );
};

export default Class;
