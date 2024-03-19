"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSchoolYear, updateBatch } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { IoIosAddCircleOutline } from "react-icons/io";

import Add from "./add";

const Content = ({ present, permission }) => {
  const data = useQuery({
    queryKey: ["present"],
    queryFn: async () => await getSchoolYear({ is_active: { _eq: true } }),
    initialData: () => ({ data: present }),
  });

  const selectPresent = useMemo(
    () => data.data.data.result.find((item) => item.is_active === true),
    [data.data]
  );

  const { getToken } = useAuth();

  const [activeBatch, setActiveBatch] = useState(selectPresent.batchs);
  const [mutating, setMutating] = useState(false);

  useEffect(() => setActiveBatch(selectPresent.batchs), [selectPresent]);

  const mutation = useMutation({
    mutationFn: ({ token, updates }) => updateBatch(token, updates),
    onSuccess: () => {
      setMutating(false);
      toast.success("Cập nhật học kỳ thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Cập nhật học kỳ không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnClick = useCallback(async () => {
    setMutating(true);
    const updates = activeBatch.map((item) => ({
      _set: {
        is_active: item.is_active,
      },
      where: {
        id: { _eq: item.id },
      },
    }));
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, updates });
  }, [activeBatch]);

  return (
    <div className="flex flex-col gap-2">
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
        <>
          <label
            htmlFor={`modal_add`}
            className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
          >
            <IoIosAddCircleOutline size={20} />
            Năm học mới
          </label>
          <Add school_year={selectPresent.school_year} />
          {/* <Add provinces={provinces} districts={districts} /> */}
        </>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <h6 className="text-center">Năm học: {selectPresent.school_year}</h6>
          <div className="flex justify-evenly">
            <p>
              Ngày bắt đầu:{" "}
              {selectPresent.start_day.split("-").reverse().join("-")}
            </p>
            <p>
              Ngày kết thúc:{" "}
              {selectPresent.end_day.split("-").reverse().join("-")}
            </p>
          </div>
        </div>
        {activeBatch
          .sort((a, b) => a.batch - b.batch)
          .map((item) => (
            <div className="flex flex-col gap-2 justify-center" key={item.id}>
              <h6 className="text-center">Học kỳ: {item.batch}</h6>
              <p className="text-center">
                Ngày bắt đầu: {item.start_day.split("-").reverse().join("-")}
              </p>
              <p className="text-center">
                Ngày kết thúc: {item.end_day.split("-").reverse().join("-")}
              </p>
              <div className="flex gap-1 justify-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-success"
                  checked={item.is_active}
                  // value={item.is_active}

                  onChange={() => {
                    // console.log(e.target.value);
                    setActiveBatch((pre) =>
                      pre.map((el) => ({
                        ...el,
                        is_active: el.id === item.id ? true : false,
                      }))
                    );
                  }}
                />
                <p>Đang hoạt động</p>
              </div>
            </div>
          ))}
      </div>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        mutating ? (
          <div className="w-full flex justify-center mt-2">
            <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
          </div>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => handleOnClick()}
          >
            Cập nhật
          </button>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Content;
