"use client";

import { useState } from "react";
import Datetime from "react-datetime";
import moment from "moment";
import "moment/locale/vi";
import SubContent from "./subContent";

moment.updateLocale("vi", {
  months: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthsShort: [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ],
});

const Content = ({ config }) => {
  const [query, setQuery] = useState({
    start_date: null,
    end_date: null,
  });
  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Báo cáo quỹ tiền mặt</h5>
      <div className="grid grid-cols-2 gap-2 p-2">
        <div className={`w-full flex flex-col gap-1`}>
          <p className="text-xs">Ngày bắt đầu:</p>
          <Datetime
            value={query.start_date}
            closeOnSelect
            timeFormat={false}
            onChange={(value) => {
              setQuery((pre) => ({ ...pre, start_date: value }));
            }}
            inputProps={{
              placeholder: "Ngày bắt đầu",
              className:
                "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
            }}
          />
        </div>
        <div className={`w-full flex flex-col gap-1`}>
          <p className="text-xs">Ngày kết thúc:</p>
          <Datetime
            value={query.end_date}
            closeOnSelect
            timeFormat={false}
            onChange={(value) => {
              setQuery((pre) => ({ ...pre, end_date: value }));
            }}
            inputProps={{
              placeholder: "Ngày kết thúc",
              className:
                "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
            }}
          />
        </div>
        {/* <button className="btn w-fit self-end">Tìm kiếm</button> */}
      </div>
      <SubContent query={query} config={config} />
      {/* {selected && <SubContent selected={selected} />} */}
    </div>
  );
};

export default Content;
