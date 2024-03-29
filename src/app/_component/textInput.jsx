"use client";

const TextInput = ({
  value,
  dispatch,
  label,
  isRequire,
  className,
  type,
  action,
  disable,
  id,
  parentIndex,
  placeholder,
  autoComplete,
}) => {
  return (
    // <div className={` ${className ? className : ""} w-full relative `}>
    //   <input
    //     disabled={disable}
    //     autoComplete="off"
    //     type={type ? type : "text"}
    //     id={id}
    //     className={`${
    //       disable ? "!bg-bordercl cursor-not-allowed" : ""
    //     } block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
    //     placeholder=""
    //     value={value}
    //     onChange={(e) => {
    //       if (typeof action === "function") {
    //         action(e.target.value);
    //       } else {
    //         dispatch({
    //           type: action,
    //           payload: { value: e.target.value, parentIndex },
    //         });
    //       }
    //     }}
    //   />
    //   <label
    //     htmlFor={id}
    //     className={`${
    //       disable ? "!cursor-not-allowed bg-white" : ""
    //     } cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
    //   >
    //     {label}
    //     {isRequire ? (
    //       <span className="text-red-600 cursor-default ">*</span>
    //     ) : (
    //       <></>
    //     )}
    //   </label>
    // </div>

    <div
      className={` ${className ? className : ""} w-full flex flex-col gap-1 `}
    >
      <p className="text-xs">{label}:</p>
      <input
        disabled={disable}
        autoComplete={autoComplete}
        type={type ? type : "text"}
        id={id}
        className={`${
          disable ? "!bg-bordercl cursor-not-allowed" : ""
        } block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
        placeholder={placeholder ? placeholder : ""}
        value={value}
        onChange={(e) => {
          if (typeof action === "function") {
            action(e.target.value);
          } else {
            dispatch({
              type: action,
              payload: { value: e.target.value, parentIndex },
            });
          }
        }}
      />
    </div>
  );
};

export default TextInput;
