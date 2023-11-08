"use client";
import { useState } from "react";
import TextInput from "@/app/component/textInput";

const Add = () => {
  const [relation, setRelation] = useState("");
  return (
    <dialog id="modal_add" className="modal">
      <div className="modal-box w-[50%] bg-white">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
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
          <button className="btn w-fit self-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
            Thêm mới
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default Add;
