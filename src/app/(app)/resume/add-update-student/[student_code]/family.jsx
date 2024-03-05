"use client";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
// import { IoTrashBinOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { updateParent } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

const UpdateModal = ({ student_code, data, catalogStudent }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [parent, setParent] = useState(data.parent);
  const [relation, setRelation] = useState({
    label: data.family_relationship.name,
    value: data.family_relationship.id,
  });
  const [mutating, setMutating] = useState(false);

  const mutation = useMutation({
    mutationFn: ({ token, dataRaw }) => updateParent(token, dataRaw),
    onSuccess: () => {
      document.getElementById(`update_modal_${data.id}`).close();
      setMutating(false);
      queryClient.invalidateQueries({
        queryKey: ["student_information", student_code],
      });
      toast.success("Cập nhật phụ huynh học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      // document.getElementById("modal_add_parent").close();
      toast.error("Cập nhật phụ huynh học sinh không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnclick = async () => {
    setMutating(true);
    let dataRaw = {
      pk_columns: {
        id: parent.id,
      },
      _set: {
        first_name: parent.first_name,
        last_name: parent.last_name,
        address: parent.address,
        phone_number: parent.phone_number,
      },
      pk_columns1: {
        id: data.id,
      },
      _set1: {
        family_relationship_id: relation.value,
      },
    };
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
    });
    mutation.mutate({ token, dataRaw });
  };

  return (
    <dialog id={`update_modal_${data.id}`} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className={`w-full flex flex-col gap-1`}>
              <p className="text-xs">Họ đệm:</p>
              <input
                autoComplete="off"
                type={"text"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Họ đệm"
                value={parent.first_name}
                onChange={(e) => {
                  setParent((pre) => ({ ...pre, first_name: e.target.value }));
                }}
              />
            </div>
            <div className={`w-full flex flex-col gap-1`}>
              <p className="text-xs">Tên:</p>
              <input
                autoComplete="off"
                type={"text"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Họ đệm"
                value={parent.last_name}
                onChange={(e) => {
                  setParent((pre) => ({ ...pre, last_name: e.target.value }));
                }}
              />
            </div>
            <div className={`w-full flex flex-col gap-1`}>
              <p className="text-xs">Số điện thoại:</p>
              <input
                autoComplete="off"
                type={"number"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Số điện thoại"
                value={parent.phone_number}
                onChange={(e) => {
                  setParent((pre) => ({
                    ...pre,
                    phone_number: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs">Quan hệ:</p>
              <Select
                placeholder="Quan hệ"
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                options={catalogStudent.family_relationships.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={relation}
                onChange={setRelation}
              />
            </div>
            <div className={`w-full flex flex-col gap-1 col-span-2`}>
              <p className="text-xs">Địa chỉ:</p>
              <input
                autoComplete="off"
                type={"text"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Địa chỉ"
                value={parent.address}
                onChange={(e) => {
                  setParent((pre) => ({ ...pre, address: e.target.value }));
                }}
              />
            </div>
          </div>
          {Object.values(parent).every((item) => item) ? (
            mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
            ) : (
              <button
                className="btn w-fit self-center"
                onClick={() => handleOnclick()}
              >
                Cập nhật
              </button>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </dialog>
  );
};

const Family = ({ student_code, data, stt, catalogStudent, isRefetching }) => {
  return (
    <tr key={stt} className="hover">
      <td>{stt}</td>
      <td>{`${data.parent.first_name} ${data.parent.last_name}`}</td>
      <td>{data.family_relationship.name}</td>
      <td>{data.parent.phone_number}</td>
      <td>{data.parent.address}</td>
      <>
        <td>
          <div className="flex gap-2">
            {isRefetching ? (
              <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
            ) : (
              <>
                <label>
                  <div
                    className="tooltip  cursor-pointer"
                    data-tip="Sửa"
                    onClick={() =>
                      document
                        .getElementById(`update_modal_${data.id}`)
                        .showModal()
                    }
                  >
                    <FaRegEdit size={30} />
                  </div>
                </label>
                <UpdateModal
                  data={data}
                  catalogStudent={catalogStudent}
                  student_code={student_code}
                />
              </>
            )}
          </div>
        </td>
      </>
    </tr>
  );
};

export default Family;
