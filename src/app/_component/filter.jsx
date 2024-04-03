"use client";
import moment from "moment";
import "moment/locale/vi";
import Datetime from "react-datetime";
import Select from "react-select";

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

// const conditionFilter = {
//   first: [
//     { value: 1, label: "Năm dương lịch" },
//     { value: 2, label: "Năm học, học kỳ" },
//   ],
//   second: [
//     { value: 1, label: "Khoảng thời gian" },
//     { value: 2, label: "Biên lai" },
//   ],
// };

const Filter = (props) => {
  const {
    listSearch,
    selected,
    selectedConditionFilter,
    setSelected,
    setSelectedConditionFilter,
    formality,
    conditionFilter,
    bill,
    refund,
  } = props;

  // console.log(listSearch);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 auto-rows-auto">
        <div className="flex flex-col gap-1">
          <p className="text-xs">Hình thức {refund ? "chi" : "thu"}:</p>
          <Select
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            placeholder={`Hình thức ${refund ? "chi" : "thu"}`}
            isMulti
            isDisabled={!bill && formality === 2}
            options={
              bill
                ? listSearch.bill_formality.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
                : listSearch.formality.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
            }
            value={selected.formality}
            onChange={(e) => {
              setSelected((pre) => ({ ...pre, formality: e }));
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs">Người {refund ? "chi" : "thu"}:</p>
          <Select
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            placeholder={`Người ${refund ? "chi" : "thu"}`}
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
                  year: value,
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
            {/* <div className="flex flex-col gap-1">
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
            </div> */}
            {/* {selected.school_year?.length > 0 && (
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
                      selected.school_year.some((el) => el.value === item.id)
                    )
                    .reduce((total, item) => [...total, ...item.batchs], [])
                    .map((item) => ({
                      value: item.id,
                      label: `HK ${item.batch} - ${item.school_year}`,
                    }))}
                  value={selected?.batch}
                  onChange={(e) => setSelected((pre) => ({ ...pre, batch: e }))}
                />
              </div>
            )} */}
            <div className="flex flex-col gap-1 col-span-2">
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
                  .reduce((total, item) => [...total, ...item.batchs], [])
                  .map((item) => ({
                    value: item.id,
                    label: `HK ${item.batch} - ${item.school_year}`,
                  }))}
                value={selected?.batch}
                onChange={(e) => setSelected((pre) => ({ ...pre, batch: e }))}
              />
            </div>
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
            placeholder={`Khoảng thời gian ${
              conditionFilter.second[1]
                ? `hoặc ${conditionFilter.second[1].label}`
                : ""
            }`}
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
                // isValidDate={(current) => {
                //   if (conditionFilter.first.value === 1) {
                //     return current.isAfter(
                //       moment(selected.year).startOf("year")
                //     );
                //   }

                //   // return true;
                // }}
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
              <p className="text-xs">Từ {conditionFilter.second[1].label}:</p>
              <input
                type="text"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                value={selected.fromReceipt}
                onChange={(e) =>
                  setSelected((pre) => ({
                    ...pre,
                    fromReceipt: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs">Đến {conditionFilter.second[1].label}:</p>
              <input
                type="text"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                value={selected.toReceipt}
                onChange={(e) =>
                  setSelected((pre) => ({
                    ...pre,
                    toReceipt: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>

      {!bill && (
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
              value={selected.school_level}
              onChange={(e) =>
                setSelected((pre) => ({ ...pre, school_level: e }))
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
              value={selected.class_level}
              onChange={(e) =>
                setSelected((pre) => ({ ...pre, class_level: e }))
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
              value={selected.class}
              onChange={(e) => setSelected((pre) => ({ ...pre, class: e }))}
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
              value={selected.studentCode}
              onChange={(e) =>
                setSelected((pre) => ({
                  ...pre,
                  studentCode: e.target.value,
                }))
              }
            />
          </div>
          {/* <div className="flex items-end h-full">
          <button className="btn w-fit" onClick={() => handleOnClick()}>
            Tìm kiếm
          </button>
        </div> */}
          {props.children}
        </div>
      )}
    </>
  );
};

export default Filter;
