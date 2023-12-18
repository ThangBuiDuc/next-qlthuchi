"use client";
import { listContext } from "../content";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { createExpectedRevenueRouter } from "@/utils/funtionApi";

const ClassLevel = () => {
  const { listSearch, selectPresent } = useContext(listContext);
  const [mutating, setMutating] = useState(false);
  const [classLevel, setClassLevel] = useState({
    isCheckedAll: false,
    class_level: listSearch.class_level.map((item) => ({
      ...item,
      isChecked: false,
    })),
  });

  const mutation = useMutation({
    mutationFn: async () =>
      createExpectedRevenueRouter({
        type: "CLASS_LEVEL",
        data: classLevel.class_level
          .filter((item) => item.isChecked)
          .map((item) => ({ id: item.id, code: item.code })),

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
                  checked={classLevel.isCheckedAll}
                  onChange={() => {
                    setClassLevel((pre) => ({
                      isCheckedAll: !pre.isCheckedAll,
                      class_level: pre.class_level.map((item) => ({
                        ...item,
                        isChecked: pre.isCheckedAll ? false : true,
                      })),
                    }));
                  }}
                  className="checkbox"
                />
              </th>
              <th>Mã khối</th>
              <th>Cấp độ</th>
              <th>Tên khối</th>
            </tr>
          </thead>
          <tbody>
            {classLevel.class_level.map((item) => (
              <tr key={item.id}>
                <td>
                  <>
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => {
                        setClassLevel((pre) => {
                          let condition = pre.class_level.map((el) =>
                            el.id === item.id
                              ? { ...el, isChecked: !el.isChecked }
                              : el
                          );
                          return {
                            isCheckedAll: condition.every(
                              (item) => item.isChecked
                            ),
                            class_level: condition,
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
            {classLevel.isCheckedAll ||
            classLevel.class_level.some((item) => item.isChecked) ? (
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

export default ClassLevel;
