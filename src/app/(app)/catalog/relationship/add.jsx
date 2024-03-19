"use client";
import { useReducer, useState, useEffect, useCallback } from "react";
import { insertRelationship } from "@/utils/funtionApi";
import TextInput from "@/app/_component/textInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const Add = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [relation, setRelation] = useState("");
  const mutation = useMutation({
    mutationFn: ({ token, name }) => insertRelationship(token, name),
    onSuccess: () => {
      queryClient.invalidateQueries(["get_relationship"]);
      setRelation("");
      toast.success("Tạo quan hệ gia đình thành công!", {
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
      toast.error("Tạo quan hệ gia đình không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnSubmit = useCallback(async () => {
    let name = relation;
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, name });
  }, [relation]);
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
                value={relation}
                label={"Quan hệ. VD: Bố/Mẹ/..."}
                action={setRelation}
                id={"add_relation"}
                isRequire={true}
              />
            </div>
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
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
