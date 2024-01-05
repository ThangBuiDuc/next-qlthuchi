"use client";
import { createContext, useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";
import "moment/locale/vi";
import Datetime from "react-datetime";
import SubContent from "./subContent";

const conditionFilter = {
  first: [
    { value: 1, label: "Năm dương lịch" },
    { value: 2, label: "Năm học, học kỳ" },
  ],
  second: [
    { value: 1, label: "Khoảng thời gian" },
    { value: 2, label: "Phiếu thu" },
  ],
};

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

export const listContext = createContext();
const Content = ({ listSearch }) => {
  const [selected, setSelected] = useState({});
  const [selectedConditionFilter, setSelectedConditionFilter] = useState({
    first: null,
    second: null,
  });
  const [condition, setCondition] = useState([]);

  // console.log(moment(selected.fromDate).unix());

  useEffect(() => {
    const bill_formality = `${
      selected.bill_formality?.length
        ? `bill_formality_id IN [${selected?.bill_formality
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const users = `${
      selected.users?.length
        ? `created_by IN [${selected?.users
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const year = selected.year ? `start_year = ${selected.year}` : "";

    const school_year = `${
      selected.school_year?.length
        ? `schoolyear_student.school_year_id IN [${selected?.school_year
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const batch = `${
      !selected.batch?.length
        ? `batch_id IN [${selected?.batch
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const fromDate = selected.fromDate
      ? `start_date >= ${moment(selected.fromDate).unix()}`
      : "";

    const toDate = selected.toDate
      ? `start_date <= ${moment(selected.toDate).unix()}`
      : "";

    const fromBillReceipt = selected.fromBillReceipt
      ? `code >= ${selected.fromBillReceipt}`
      : "";

    const toBillReceipt = selected.toBillReceipt
      ? `code <= ${selected.toBillReceipt}`
      : "";

    setCondition(
      [
        bill_formality && bill_formality,
        users && users,
        selectedConditionFilter.first
          ? selectedConditionFilter.first.value === 1
            ? year
              ? year
              : ""
            : selectedConditionFilter.first.value === 2
            ? [school_year && school_year, batch && batch].filter(
                (item) => item
              )
            : ""
          : "",
        selectedConditionFilter.second
          ? selectedConditionFilter.second.value === 1
            ? [fromDate && fromDate, toDate && toDate].filter((item) => item)
            : selectedConditionFilter.second.value === 2
            ? [
                fromBillReceipt && fromBillReceipt,
                toBillReceipt && toBillReceipt,
              ].filter((item) => item)
            : ""
          : "",
      ]
        .filter((item) => item)
        .reduce(
          (total, curr) =>
            typeof curr !== "string" ? [...total, ...curr] : [...total, curr],
          []
        )
    );
  }, [selected]);

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
        }}
      >
        <div className="flex flex-col  gap-3">
          <div className="flex gap-1 justify-center items-center w-full">
            <h4 className="text-center">Quản lý phiếu thu tiền mặt</h4>
          </div>
          {/* <div className="flex flex-col w-full border-opacity-50"> */}
          <div className="grid grid-cols-2 gap-2 auto-rows-auto">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Hình thức thu:</p>
              <Select
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                placeholder="Hình thức thu"
                isMulti
                // isDisabled
                options={listSearch.bill_formality.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={selected.bill_formality}
                onChange={(e) => {
                  setSelected((pre) => ({ ...pre, bill_formality: e }));
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs">Người lập phiếu:</p>
              <Select
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                placeholder="Người lập phiếu"
                isMulti
                options={listSearch.users.map((item) => ({
                  ...item,
                  value: item.clerk_user_id,
                  label: `${item.first_name} ${item.last_name}`,
                }))}
                value={selected.users}
                onChange={(e) => setSelected((pre) => ({ ...pre, users: e }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Điều kiện lọc:</p>
              <Select
                isClearable
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                placeholder="Năm dương lịch hoặc năm học, học kỳ"
                options={conditionFilter.first}
                value={selectedConditionFilter?.first}
                onChange={(e) =>
                  setSelectedConditionFilter((pre) => ({ ...pre, first: e }))
                }
              />
            </div>
            {selectedConditionFilter.first?.value === 1 && (
              <div className="flex flex-col gap-1">
                <p className="text-xs">Năm dương lịch:</p>
                <Datetime
                  value={selected?.year}
                  closeOnSelect
                  timeFormat={false}
                  dateFormat="YYYY"
                  onChange={(value) => {
                    setSelected((pre) => ({
                      ...pre,
                      year: value.year().toString(),
                    }));
                  }}
                  inputProps={{
                    placeholder: "Năm dương lịch",
                    className:
                      "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
                  }}
                />
              </div>
            )}
            {selectedConditionFilter.first?.value === 2 && (
              <div className="grid grid-cols-2 auto-rows-auto gap-3 items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-xs">Năm học:</p>
                  <Select
                    className="text-black text-sm"
                    classNames={{
                      control: () => "!rounded-[5px]",
                      input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                      valueContainer: () => "!p-[0_8px]",
                      menu: () => "!z-[11]",
                    }}
                    isMulti
                    placeholder="Năm học"
                    options={listSearch.school_years.map((item) => ({
                      value: item.id,
                      label: item.school_year,
                    }))}
                    value={selected?.school_year}
                    onChange={(e) =>
                      setSelected((pre) => ({ ...pre, school_year: e }))
                    }
                  />
                </div>
                {selected.school_year?.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs">Học kỳ:</p>
                    <Select
                      isMulti
                      className="text-black text-sm"
                      classNames={{
                        control: () => "!rounded-[5px]",
                        input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                        valueContainer: () => "!p-[0_8px]",
                        menu: () => "!z-[11]",
                      }}
                      placeholder="Học kỳ"
                      options={listSearch.school_years
                        .map((item) => ({
                          ...item,
                          batchs: item.batchs.map((el) => ({
                            ...el,
                            school_year: item.school_year,
                          })),
                        }))
                        .filter((item) =>
                          selected.school_year.some(
                            (el) => el.value === item.id
                          )
                        )
                        .reduce((total, item) => [...total, ...item.batchs], [])
                        .map((item) => ({
                          value: item.id,
                          label: `HK ${item.batch} - ${item.school_year}`,
                        }))}
                      value={selected?.batch}
                      onChange={(e) =>
                        setSelected((pre) => ({ ...pre, batch: e }))
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 items-center ">
            <div className="flex flex-col gap-1">
              <p className="text-xs">Điều kiện lọc:</p>
              <Select
                isClearable
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                placeholder="Khoảng thời gian hoặc biên lai"
                options={conditionFilter.second}
                value={selectedConditionFilter?.second}
                onChange={(e) =>
                  setSelectedConditionFilter((pre) => ({ ...pre, second: e }))
                }
              />
            </div>
            {selectedConditionFilter.second?.value === 1 && (
              <div className="grid grid-cols-2 auto-rows-auto gap-3 items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-xs">Từ ngày:</p>
                  <Datetime
                    value={selected?.fromDate}
                    closeOnSelect
                    timeFormat={false}
                    onChange={(value) => {
                      setSelected((pre) => ({
                        ...pre,
                        fromDate: value,
                      }));
                    }}
                    inputProps={{
                      placeholder: "Từ ngày",
                      className:
                        "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs">Đến ngày:</p>
                  <Datetime
                    isValidDate={(current) => {
                      return current.isAfter(
                        moment(selected.fromDate).subtract(1, "day")
                      );
                    }}
                    value={selected?.toDate}
                    closeOnSelect
                    timeFormat={false}
                    onChange={(value) => {
                      setSelected((pre) => ({
                        ...pre,
                        toDate: value,
                      }));
                    }}
                    inputProps={{
                      disabled: selected.fromDate ? false : true,
                      placeholder: "Đến ngày",
                      className: `px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300 ${
                        !selected.fromDate && "hover:cursor-not-allowed"
                      }`,
                    }}
                  />
                </div>
              </div>
            )}
            {selectedConditionFilter.second?.value === 2 && (
              <div className="grid grid-cols-2 auto-rows-auto gap-3 items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-xs">Từ biên lai:</p>
                  <input
                    type="text"
                    className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                    value={selected.fromBillReceipt}
                    onChange={(e) =>
                      setSelected((pre) => ({
                        ...pre,
                        fromBillReceipt: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs">Đến biên lai:</p>
                  <input
                    type="text"
                    className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                    value={selected.toBillReceipt}
                    onChange={(e) =>
                      setSelected((pre) => ({
                        ...pre,
                        toBillReceipt: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* <div className="flex items-end h-full">
            <button className="btn w-fit" onClick={() => handleOnClick()}>
              Tìm kiếm
            </button>
          </div> */}

          <SubContent condition={condition} />
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
