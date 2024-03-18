"use client";
import { useState, useCallback } from "react";
import TextInput from "@/app/_component/textInput";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { upsertUserRole } from "@/utils/funtionApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Edit = ({ data, roleData }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [roleId, setRoleId] = useState(
    data.user_roles[0]
      ? {
          value: data.user_roles[0]?.role.id,
          label: data.user_roles[0]?.role.description,
        }
      : null
  );

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => upsertUserRole(token, objects),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_role"],
      });
      toast.success("Cập nhật quyền cho người dùng thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      const modalCheckbox = document.getElementById(`modal_add_${data.id}`);
      if (modalCheckbox) {
        modalCheckbox.checked = false;
      }
    },
    onError: () => {
      toast.error("Cập nhật quyền cho người dùng không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnSubmit = useCallback(async () => {
    let objects = {
      user_id: data.id,
      role_id: roleId?.value,
    };

    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
    });

    mutation.mutate({ token, objects });
  }, [roleId]);

  return (
    <>
      <input
        type="checkbox"
        id={`modal_fix_${data.id}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-6/12"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_fix_${data.id}`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <form
            // onSubmit={handleOnSubmit}
            className="flex flex-col gap-[20px] mt-[20px]"
            style={{ overflowY: "unset" }}
          >
            <p>Cập nhật quyền cho người dùng</p>
            <TextInput
              disable={true}
              label={"Mã người dùng"}
              value={data.id}
              className={"w-[70%]"}
            />
            <TextInput
              disable={true}
              label={"Họ và tên"}
              value={`${data.first_name} ${data.last_name}`}
              className={"w-[70%]"}
            />
            <Select
              placeholder="Quyền"
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              options={roleData.result.map((item) => ({
                value: item.id,
                label: item.description,
              }))}
              value={roleId}
              onChange={setRoleId}
            />
            <button
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center mt-[30px]"
              onClick={(e) => {
                e.preventDefault();
                handleOnSubmit();
              }}
            >
              {mutation.isLoading ? (
                <span className="loading loading-spinner loading-sm bg-primary"></span>
              ) : (
                "Cập nhật"
              )}
            </button> 
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;
