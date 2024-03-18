"use client";
import { memo, useState, useCallback } from "react";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { upsertUserPermission } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";
// import { GoGear } from "react-icons/go";
// import Edit from "./edit";

const Item = ({ data, listPermissionFunction, permission, isRefetching }) => {
  const { getToken } = useAuth();
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const [selectArray, setSelectArray] = useState(
    data.permission.map((item) => ({
      ...item,
      value: item.permission_id,
      label: listPermissionFunction.permission.find(
        (el) => el.id === item.permission_id
      ).name,
    }))
  );

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => upsertUserPermission(token, objects),
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries(["user_permission"]);
      toast.success("Tạo mới quyền thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      document.getElementById("modal_add").close();
      toast.error("Tạo mới quyền không thành công!", {
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
    const objects = selectArray.map((item) => ({
      clerk_user_id: data.clerk_user_id,
      function_id: item.function_id,
      permission_id: item.value,
    }));
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, objects });
  }, [selectArray]);

  return (
<<<<<<< HEAD
    <tr>
      <td><p>{data.id}</p></td>
      <td><p>{data.first_name} {data.last_name}</p></td>
      <th><p>{data.clerk_user_id}</p></th>
      <td>{data.user_roles[0]? <p>{data.user_roles[0]?.role.description}</p> : <p>Chưa được phân quyền</p> }</td>
      <td>
      <label
        htmlFor={`modal_fix_${data.id}`}
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
      >
        <GoGear size={25} />
      </label>
      </td>
      <td><><Edit data={data} roleData={roleData}/></></td> 
    </tr>
=======
    <>
      <div className="collapse collapse-arrow border border-bordercl">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-sm font-medium">
          {data.email} - {`${data.first_name} ${data.last_name}`}
        </div>
        <div className="collapse-content">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Chức năng</th>
                  <th>Quyền</th>
                </tr>
              </thead>
              <tbody>
                {listPermissionFunction.functions
                  .sort((a, b) => a.function_type.id - b.function_type.id)
                  .map((item, index) => {
                    const checkExists = selectArray.find(
                      (el) => el.function_id === item.id
                    );
                    return (
                      <tr key={item.id} className="hover cursor-pointer">
                        <td>{++index}</td>
                        <td>{item.name}</td>
                        <td>
                          <>
                            <Select
                              placeholder="Chưa phân quyền"
                              className="text-black text-sm"
                              classNames={{
                                control: () => "!rounded-[5px]",
                                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                                valueContainer: () => "!p-[0_8px]",
                                menu: () => "!z-[11]",
                              }}
                              options={listPermissionFunction.permission.map(
                                (el) => ({
                                  ...el,
                                  value: el.id,
                                  label: el.name,
                                })
                              )}
                              value={checkExists ? checkExists : null}
                              onChange={(e) =>
                                checkExists
                                  ? setSelectArray((pre) =>
                                      pre.map((el) =>
                                        el.function_id === item.id
                                          ? { ...el, ...e }
                                          : el
                                      )
                                    )
                                  : setSelectArray((pre) => [
                                      ...pre,
                                      {
                                        function_id: item.id,
                                        permission_id: e.value,
                                        ...e,
                                      },
                                    ])
                              }
                            />
                          </>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
            isRefetching || mutating ? (
              <div className="w-full flex justify-center mt-2">
                <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
              </div>
            ) : (
              <div className="w-full flex justify-center mt-2">
                <button
                  className="btn w-fit self-center"
                  onClick={() => handleOnClick()}
                >
                  Cập nhật
                </button>
              </div>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
>>>>>>> origin/thangbd
  );
};

export default memo(Item);
