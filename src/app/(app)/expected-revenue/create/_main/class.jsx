"use client";
import { listContext } from "../content";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { createExpectedRevenueRouter } from "@/utils/funtionApi";

const Class = () => {
  const { listSearch, selectPresent } = useContext(listContext);
  console.log(listSearch.classes);
  const [mutating, setMutating] = useState(false);
  const [classes, setClasses] = useState({
    isCheckedAll: false,
    class: listSearch.classes.map((item) => ({
      ...item,
      isChecked: false,
    })),
  });

  const mutation = useMutation({
    mutationFn: async () =>
      createExpectedRevenueRouter({
        type: "CLASS",
        data: classes.class
          .filter((item) => item.isChecked)
          .map((item) => ({ id: item.id, code: item.name })),
        time: moment().format(),
        batch_id: selectPresent.id,
      }),
    onSuccess: () => {
      setMutating(false);
      toast.success("Lập dự kiến thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Lập dự kiến thu không thành công!", {
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
      <div className="overflow-x-auto max-h-[450px]">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={classes.isCheckedAll}
                  onChange={() => {
                    setClasses((pre) => ({
                      isCheckedAll: !pre.isCheckedAll,
                      class: pre.class.map((item) => ({
                        ...item,
                        isChecked: pre.isCheckedAll ? false : true,
                      })),
                    }));
                  }}
                  className="checkbox"
                />
              </th>
              <th>ID</th>
              <th>Mã lớp</th>
              <th>Tên lớp</th>
            </tr>
          </thead>
          <tbody>
            {classes.class.map((item) => (
              <tr key={item.id}>
                <td>
                  <>
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => {
                        setClasses((pre) => {
                          let condition = pre.class.map((el) =>
                            el.id === item.id
                              ? { ...el, isChecked: !el.isChecked }
                              : el
                          );
                          return {
                            isCheckedAll: condition.every(
                              (item) => item.isChecked
                            ),
                            class: condition,
                          };
                        });
                      }}
                      className="checkbox"
                    />
                  </>
                </td>
                <td>{item.id}</td>
                <td>{item.code}</td>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-2">
        {mutating ? (
          <span className="loading loading-spinner loading-sm bg-primary"></span>
        ) : (
          <>
            {classes.isCheckedAll ||
            classes.class.some((item) => item.isChecked) ? (
              <>
                <button
                  className="btn w-fit"
                  onClick={() => {
                    setMutating(true);
                    mutation.mutate();
                  }}
                >
                  Hoàn thành
                </button>
                <div
                  className="tooltip flex items-center justify-center"
                  data-tip="Dự kiến thu trùng lặp sẽ lấy dự kiến thu thêm vào mới nhất!"
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
    </>
  );
};

export default Class;
