"use client";
import { useReducer, useState, useEffect, useCallback } from "react";
import TextInput from "@/app/_component/textInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { insertStudyStatus } from "@/utils/funtionApi";

const Add = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [status, setStatus] = useState("");
  const mutation = useMutation({
    mutationFn: ({ token, name }) => insertStudyStatus(token, name),
    onSuccess: () => {
      queryClient.invalidateQueries(["get_study_status"]);
      setStatus("");
      toast.success("Tạo trạng thái học tập thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      const modalCheckbox = document.getElementById(`modal_add`);
      if (modalCheckbox) {
        modalCheckbox.checked = false;
      }
    },
    onError: () => {
      toast.error("Tạo trạng thái học tập không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnSubmit = useCallback(async () => {
    let name = status;
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, name });
  }, [status]);

  return (
    <>
      <input type="checkbox" id={`modal_add`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-[30%] bg-white"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_add`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <form className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[25px] mt-[20px]">
              <TextInput
                value={status}
                label={"Tình trạng học tập"}
                action={setStatus}
                id={"add_status"}
                isRequire={true}
              />
            </div>
            {status ? (
              <button
                className="btn w-fit self-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                onClick={(e) => {
                  e.preventDefault();
                  handleOnSubmit();
                }}
              >
                {mutation.isLoading ? (
                  <span className="loading loading-spinner loading-sm bg-primary"></span>
                ) : (
                  "Thêm mới"
                )}
              </button>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
