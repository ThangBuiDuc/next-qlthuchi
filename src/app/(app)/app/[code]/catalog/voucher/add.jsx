"use client";
import { useReducer } from "react";
import TextInput from "@/app/component/textInput";
import DatePicker from "react-datepicker";

function reducer(state, action) {
  switch (action.type) {
    case "change_code": {
      return {
        ...state,
        code: action.payload.value,
      };
    }

    case "change_object": {
      return {
        ...state,
        code: action.payload.value,
      };
    }

    case "change_percent": {
      return {
        ...state,
        percent:
          action.payload.value > 100
            ? 100
            : action.payload.value <= 0
            ? 1
            : action.payload.value,
      };
    }

    case "change_startDate": {
      return {
        ...state,
        start_date: action.payload.value,
      };
    }
    case "change_endDate": {
      return {
        ...state,
        start_date: action.payload.value,
      };
    }
  }
}

const Add = () => {
  const [data, dispatchData] = useReducer(reducer, {
    code: "",
    object: "",
    percent: 1,
    startDate: new Date(),
    endDate: new Date(),
  });
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
              value={data.code}
              label={"Mã"}
              dispatch={dispatchData}
              id={"add_code"}
              isRequire={true}
              action={"change_code"}
            />
            <TextInput
              value={data.object}
              label={"Đối tượng"}
              dispatch={dispatchData}
              id={"add_object"}
              isRequire={true}
              action={"change_object"}
            />
            <TextInput
              value={data.percent}
              label={"Phần trăm giảm"}
              dispatch={dispatchData}
              id={"add_percent"}
              isRequire={true}
              type={"number"}
              action={"change_percent"}
            />

            <DatePicker
              autoComplete="off"
              popperClassName="!z-[11]"
              className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300 focus:outline-none "
              id="change_startDate"
              selected={data.startDate}
              onChange={(date) =>
                dispatchData({
                  type: "change_startDate",
                  payload: {
                    value: date,
                  },
                })
              }
            />
            <DatePicker
              autoComplete="off"
              popperClassName="!z-[11]"
              className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300 focus:outline-none "
              id="change_endDate"
              selected={data.endDate}
              onChange={(date) =>
                dispatchData({
                  type: "change_endDate",
                  payload: {
                    value: date,
                  },
                })
              }
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
