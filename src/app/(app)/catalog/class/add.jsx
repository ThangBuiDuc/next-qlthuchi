"use client";
import TextInput from "@/app/_component/textInput";
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "change_id": {
      return {
        ...state,
        id: action.payload.value,
      };
    }

    case "change_title": {
      return {
        ...state,
        title: action.payload.value,
      };
    }
  }
}

const Add = () => {
  const [infor, dispatchInfor] = useReducer(reducer, {
    id: "",
    title: "",
  });

  return (
    <dialog id="modal_add" className="modal">
      <div className="modal-box w-4/12 max-w-4xl bg-white">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[25px] mt-[20px]">
            <TextInput
              label={"Mã cấp"}
              value={infor.id}
              dispatch={dispatchInfor}
              isRequire={true}
              id={"add_id"}
              action={"change_id"}
            />
            <TextInput
              label={"Tên cấp"}
              value={infor.title}
              dispatch={dispatchInfor}
              isRequire={true}
              action={"change_title"}
              id={"add_title"}
              type={"text"}
            />
          </div>
          <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center">
            Thêm mới
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default Add;
