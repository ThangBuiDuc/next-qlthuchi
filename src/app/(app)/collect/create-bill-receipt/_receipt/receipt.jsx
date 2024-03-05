"use client";
import { useState, useContext } from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "moment/locale/vi";
import Datetime from "react-datetime";
import ListReceipt from "./listReceipt";
import { getText } from "number-to-text-vietnamese";

const conditionFilter = {
  first: [
    { value: 1, label: "Năm dương lịch" },
    { value: 2, label: "Năm học, học kỳ" },
  ],
  second: [
    { value: 1, label: "Khoảng thời gian" },
    { value: 2, label: "Biên lai" },
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

function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

const Receipt = ({ selected }) => {
  const { preBill, listSearch } = useContext(listContext);
  const [billReceipt, setBillReceipt] = useState({
    payer: "",
    location: "",
    nowMoney: null,
    bill_name: "",
    description: "",
  });
  const [mutating, setMutating] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    formality: [{ value: 2, label: "Tiền mặt" }],
  });
  const [selectedConditionFilter, setSelectedConditionFilter] = useState({
    first: null,
    second: null,
  });
  const [condition, setCondition] = useState([
    `${
      selectedFilter.formality?.length
        ? `formality_id IN [${selectedFilter?.formality
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`,
  ]);

  const handleSearchOnClick = () => {
    const formality = `${
      selectedFilter.formality?.length
        ? `formality_id IN [${selectedFilter?.formality
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const users = `${
      selectedFilter.users?.length
        ? `user.clerk_id IN [${selectedFilter?.users
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const year = selectedFilter.year
      ? `start_year = ${selectedFilter.year}`
      : "";

    // const school_year = `${
    //   selectedFilter.school_year?.length
    //     ? `schoolyear_student.school_year_id IN [${selectedFilter?.school_year
    //         ?.map((item) => item.value)
    //         .toString()}]`
    //     : ""
    // }`;

    const batch = `${
      !selectedFilter.batch?.length
        ? `batch_id IN [${selectedFilter?.batch
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const fromDate = selectedFilter.fromDate
      ? `start_date >= ${moment(selectedFilter.fromDate).unix()}`
      : "";

    const toDate = selectedFilter.toDate
      ? `start_date <= ${moment(selectedFilter.toDate).unix()}`
      : "";

    const fromReceipt = selectedFilter.fromReceipt
      ? `receipt_code >= ${selectedFilter.fromReceipt}`
      : "";

    const toReceipt = selectedFilter.toReceipt
      ? `receipt_code <= ${selectedFilter.toReceipt}`
      : "";

    const school_level = selectedFilter.school_level?.length
      ? `student.school_level_code IN [${selectedFilter.school_level
          .map((item) => item.code)
          .toString()}]`
      : "";

    const class_level = selectedFilter.class_level?.length
      ? `student.class_level_code IN [${selectedFilter.class_level
          .map((item) => item.code)
          .toString()}]`
      : "";

    const classes = selectedFilter.class?.length
      ? `student.class_code IN [${selectedFilter.class
          .map((item) => item.name)
          .toString()}]`
      : "";

    const studentCode = selectedFilter.studentCode
      ? `code = ${selectedFilter.studentCode}`
      : "";

    setCondition(
      [
        formality && formality,
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
            ? [fromReceipt && fromReceipt, toReceipt && toReceipt].filter(
                (item) => item
              )
            : ""
          : "",
        school_level && school_level,
        class_level && class_level,
        classes && classes,
        studentCode && studentCode,
      ]
        .filter((item) => item)
        .reduce(
          (total, curr) =>
            typeof curr !== "string" ? [...total, ...curr] : [...total, curr],
          []
        )
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 items-center gap-2">
        <p className="col-span-2">
          Phiếu thu số:{" "}
          <span className="font-semibold">{`PT${createCode(
            preBill.count_bill[0].bill_receipt
          )}`}</span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Họ tên người nộp tiền:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.payer}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, payer: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Địa chỉ:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.location}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, location: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Số tiền:</p>
          <CurrencyInput
            disabled
            className="input input-bordered min-w-[300px]"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            value={billReceipt.nowMoney}
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Lý do nộp:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.bill_name}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, bill_name: e.target.value }))
            }
          />
        </div>

        <p className="italic col-span-2">
          Bằng chữ:{" "}
          <span className="font-semibold">
            {billReceipt.nowMoney
              ? getText(billReceipt.nowMoney).charAt(0).toUpperCase() +
                getText(billReceipt.nowMoney).slice(1) +
                " đồng"
              : ""}
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Kèm theo:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.description}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, description: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 ">
        <h6 className="text-center">Bảng kê biên lai thu</h6>
        <div className="grid grid-cols-2 gap-2 auto-rows-auto">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Hình thức thu:</p>
            <Select
              isDisabled
              className="text-black text-sm "
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0 ",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              placeholder="Hình thức thu"
              isMulti
              // isDisabled
              options={listSearch.formality.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={selectedFilter.formality}
              // onChange={(e) => {
              //   setSelectedFilter((pre) => ({ ...pre, formality: e }));
              // }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs">Người thu:</p>
            <Select
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              placeholder="Người thu"
              isMulti
              options={listSearch.users.map((item) => ({
                ...item,
                value: item.clerk_user_id,
                label: `${item.first_name} ${item.last_name}`,
              }))}
              value={selectedFilter.users}
              onChange={(e) =>
                setSelectedFilter((pre) => ({ ...pre, users: e }))
              }
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
                value={selectedFilter?.year}
                closeOnSelect
                timeFormat={false}
                dateFormat="YYYY"
                onChange={(value) => {
                  setSelectedFilter((pre) => ({
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
                  value={selectedFilter?.school_year}
                  onChange={(e) =>
                    setSelectedFilter((pre) => ({ ...pre, school_year: e }))
                  }
                />
              </div>
              {selectedFilter.school_year?.length > 0 && (
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
                        selectedFilter.school_year.some(
                          (el) => el.value === item.id
                        )
                      )
                      .reduce((total, item) => [...total, ...item.batchs], [])
                      .map((item) => ({
                        value: item.id,
                        label: `HK ${item.batch} - ${item.school_year}`,
                      }))}
                    value={selectedFilter?.batch}
                    onChange={(e) =>
                      setSelectedFilter((pre) => ({ ...pre, batch: e }))
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
                  value={selectedFilter?.fromDate}
                  closeOnSelect
                  timeFormat={false}
                  onChange={(value) => {
                    setSelectedFilter((pre) => ({
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
                      moment(selectedFilter.fromDate).subtract(1, "day")
                    );
                  }}
                  value={selectedFilter?.toDate}
                  closeOnSelect
                  timeFormat={false}
                  onChange={(value) => {
                    setSelectedFilter((pre) => ({
                      ...pre,
                      toDate: value,
                    }));
                  }}
                  inputProps={{
                    disabled: selectedFilter.fromDate ? false : true,
                    placeholder: "Đến ngày",
                    className: `px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300 ${
                      !selectedFilter.fromDate && "hover:cursor-not-allowed"
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
                  value={selectedFilter.fromReceipt}
                  onChange={(e) =>
                    setSelectedFilter((pre) => ({
                      ...pre,
                      fromReceipt: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs">Đến biên lai:</p>
                <input
                  type="text"
                  className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                  value={selectedFilter.toReceipt}
                  onChange={(e) =>
                    setSelectedFilter((pre) => ({
                      ...pre,
                      toReceipt: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 items-center ">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Cấp học:</p>
            <Select
              isMulti
              isClearable
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Vui lòng chọn!"
              options={listSearch.school_level
                .sort((a, b) => a.code - b.code)
                .map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.name,
                }))}
              value={selectedFilter.school_level}
              onChange={(e) =>
                setSelectedFilter((pre) => ({ ...pre, school_level: e }))
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs">Khối lớp:</p>
            <Select
              isMulti
              isClearable
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Vui lòng chọn!"
              options={listSearch.class_level
                .sort((a, b) => a.code - b.code)
                .map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.name,
                }))}
              value={selectedFilter.class_level}
              onChange={(e) =>
                setSelectedFilter((pre) => ({ ...pre, class_level: e }))
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs">Lớp học:</p>
            <Select
              isMulti
              isClearable
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Vui lòng chọn!"
              options={listSearch.classes
                .sort((a, b) => a.code - b.code)
                .map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.name,
                }))}
              value={selectedFilter.class}
              onChange={(e) =>
                setSelectedFilter((pre) => ({ ...pre, class: e }))
              }
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs">Học sinh:</p>
            <input
              type="text"
              className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
              value={selectedFilter.studentCode}
              onChange={(e) =>
                setSelectedFilter((pre) => ({
                  ...pre,
                  studentCode: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-end h-full">
            <button className="btn w-fit" onClick={() => handleSearchOnClick()}>
              Tìm kiếm
            </button>
          </div>
        </div>
        <ListReceipt
          condition={condition}
          billReceipt={billReceipt}
          setBillReceipt={setBillReceipt}
          mutating={mutating}
          setMutating={setMutating}
          selected={selected}
        />
      </div>
      {/* {billReceipt.payer.trim() &&
      billReceipt.location.trim() &&
      billReceipt.bill_name.trim() &&
      billReceipt.nowMoney ? (
        mutating ? (
          <span className="loading loading-spinner loading-sm bg-primary"></span>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => handleOnClick()}
          >
            Hoàn thành
          </button>
        )
      ) : (
        <></>
      )} */}
    </>
  );
};

export default Receipt;
