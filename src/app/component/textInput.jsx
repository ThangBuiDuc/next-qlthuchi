import React from "react";

const TextInput = ({
  value,
  dispatch,
  label,
  isRequire,
  className,
  type,
  action,
}) => {
  return (
    <div className={` ${className ? className : ""} w-full relative `}>
      {isRequire ? (
        <span className="absolute text-red-600 top-auto bottom-auto right-3 cursor-default ">
          *
        </span>
      ) : (
        <></>
      )}
      <input
        autoComplete="off"
        type={type ? type : "text"}
        id={action}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer"
        placeholder=""
        value={value}
        onChange={(e) => {
          if (typeof action === "function") {
            action(e.target.value);
          } else {
            dispatch({
              type: action,
              payload: e.target.value,
            });
          }
        }}
      />
      <label
        htmlFor={action}
        className="cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-transparent peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {label}
      </label>
    </div>
  );
};

export default TextInput;
