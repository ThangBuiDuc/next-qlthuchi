"use client";
import { useState, useContext, useEffect } from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import "moment/locale/vi";
import ListRefund from "./listRefund";
import { getText } from "number-to-text-vietnamese";
import Filter from "@/app/_component/filter";

const conditionFilter = {
  first: [
    { value: 1, label: "Năm dương lịch" },
    { value: 2, label: "Năm học, học kỳ" },
  ],
  second: [{ value: 1, label: "Khoảng thời gian" }],
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

const Refund = ({ selected }) => {
  const { preBill, listSearch } = useContext(listContext);
  const [billRefund, setBillRefund] = useState({
    receiver: "",
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
  const [condition, setCondition] = useState([]);

  useEffect(() => {
    // const formality = `${
    //   selectedFilter.formality?.length
    //     ? `formality_id IN [${selectedFilter?.formality
    //         ?.map((item) => item.value)
    //         .toString()}]`
    //     : ""
    // }`;

    const formality = `${
      selectedFilter.formality?.length ? `formality_id IS NULL` : ""
    }`;

    const users = `${
      selectedFilter.users?.length
        ? `user.clerk_id IN [${selectedFilter?.users
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const year = selectedFilter.year
      ? `start_year = ${selectedFilter.year.year()}`
      : "";

    // const school_year = `${
    //   selectedFilter.school_year?.length
    //     ? `schoolyear_student.school_year_id IN [${selectedFilter?.school_year
    //         ?.map((item) => item.value)
    //         .toString()}]`
    //     : ""
    // }`;

    const batch = `${
      selectedFilter.batch?.length
        ? `batch_id IN [${selectedFilter?.batch
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const fromDate = selectedFilter.fromDate
      ? `start_at >= ${moment(selectedFilter.fromDate).unix()}`
      : "";

    const toDate = selectedFilter.toDate
      ? `start_at <= ${moment(selectedFilter.toDate).unix()}`
      : "";

    // const fromReceipt = selectedFilter.fromReceipt
    //   ? `receipt_code >= ${selectedFilter.fromReceipt}`
    //   : "";

    // const toReceipt = selectedFilter.toReceipt
    //   ? `receipt_code <= ${selectedFilter.toReceipt}`
    //   : "";

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
            ? [batch && batch].filter((item) => item)
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
  }, [selectedFilter, selectedConditionFilter]);

  return (
    <>
      <div className="grid grid-cols-2 items-center gap-2">
        <p className="col-span-2">
          Phiếu chi số:{" "}
          <span className="font-semibold">{`PC${createCode(
            preBill.count_bill[0].bill_refund
          )}`}</span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Họ tên người nhận tiền:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.receiver}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, receiver: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Địa chỉ:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.location}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, location: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Số tiền:</p>
          <CurrencyInput
            disabled
            className="input input-bordered min-w-[300px]"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            value={billRefund.nowMoney}
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Lý do chi:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.bill_name}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, bill_name: e.target.value }))
            }
          />
        </div>

        <p className="italic col-span-2">
          Bằng chữ:{" "}
          <span className="font-semibold">
            {billRefund.nowMoney
              ? getText(billRefund.nowMoney).charAt(0).toUpperCase() +
                getText(billRefund.nowMoney).slice(1) +
                " đồng"
              : ""}
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Kèm theo:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.description}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, description: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 ">
        <h6 className="text-center">Bảng kê biên lai chi</h6>
        <Filter
          listSearch={listSearch}
          selected={selectedFilter}
          setSelected={setSelectedFilter}
          selectedConditionFilter={selectedConditionFilter}
          setSelectedConditionFilter={setSelectedConditionFilter}
          condition={condition}
          setCondition={setCondition}
          conditionFilter={conditionFilter}
          formality={2}
          refund
        ></Filter>
        <ListRefund
          condition={condition}
          billRefund={billRefund}
          setBillRefund={setBillRefund}
          mutating={mutating}
          setMutating={setMutating}
          selected={selected}
        />
      </div>
      {/* {billRefund.receiver.trim() &&
      billRefund.location.trim() &&
      billRefund.bill_name.trim() &&
      billRefund.nowMoney ? (
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

export default Refund;
