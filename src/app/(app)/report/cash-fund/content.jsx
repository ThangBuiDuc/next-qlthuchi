"use client";

import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const Content = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  return (
    <>
      <div className="w-1/2">
        <Datepicker
          inputClassName="w-full border-solid border-slate-200 border-2 rounded-md focus:ring-0 p-[10px]" 
          useRange={false}
          value={value}
          onChange={handleValueChange}
          displayFormat={"DD/MM/YYYY"}
        />
      </div>
    </>
  );
};

export default Content;
