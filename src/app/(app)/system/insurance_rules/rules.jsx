"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getInsuranceRules, createInsuaranceRule } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
// import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Tooltip } from "@nextui-org/tooltip";
import { EditIcon } from "@/app/_component/editIcon.jsx";
import { DeleteIcon } from "@/app/_component/deleteIcon.jsx";
import { ReActivatedIcon } from "@/app/_component/reActivatedIcon";
import { FaCircle } from "react-icons/fa";
import Select from "react-select";
import DeleteModal from "./delete";
import ReActivateModal from "./reActive";
import EditModal from "./edit";

const DateInput = ({ day, setDay, month, setMonth }) => {
  const handleDayChange = (e) => {
    const newDay = e.target.value;
    setDay(newDay);
  };

  const handleMonthChange = (e) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    // adjustDayForMonth(day, newMonth);
  };

  useEffect(() => {
    let maxDay = 31;
    let maxMonth = 12;

    if (month == 4 || month == 6 || month == 9 || month == 11) {
      maxDay = 30;
    } else if (month == 2) {
      maxDay = 29;
    }

    if (month > maxMonth) {
      setMonth(maxMonth);
    }

    if (day > maxDay) {
      setDay(maxDay);
    }
  }, [day, month]);

  return (
    <div className="flex w-fit gap-5">
      <input
        type="number"
        value={day}
        onChange={handleDayChange}
        className="block w-20 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
        placeholder="Ngày"
      />
      <span>/</span>
      <input
        type="number"
        value={month}
        onChange={handleMonthChange}
        placeholder="Tháng"
        className="block w-20 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
      />
    </div>
  );
};

const Rules = ({ rules, class_levels, permission }) => {
  const { getToken } = useAuth();
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const ruleData = useQuery({
    queryKey: ["get_rules"],
    queryFn: async () => await getInsuranceRules(),
    initialData: () => ({ data: rules }),
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(ruleData?.data?.data?.result?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return ruleData?.data?.data?.result?.slice(start, end);
  }, [page, ruleData]);

  // console.log(items);

  const [allowAdd, setAllowAdd] = useState(false);

  // Dữ liệu thêm
  const [classLevel, setClassLevel] = useState();
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [months, setMonths] = useState("");

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createInsuaranceRule(token, objects),
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries(["get_rules"]);
      setAllowAdd(false);
      toast.success("Tạo luật BHYT thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },

    onError: () => {
      setMutating(false);
      toast.error("Tạo luật BHYT không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleInsert = async () => {
    let objects = {
      class_level: classLevel.value,
      start_day: startDay,
      end_day: endDay,
      start_month: startMonth,
      end_month: endMonth,
      months: months,
    };
    console.log(objects);
    setMutating(true);
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, objects: objects });
  };

  // Vô hiệu hoá
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  // Khôi phục hoạt động
  const [isReActivateModalOpen, setIsReActivateModalOpen] = useState(false);
  const [ruleToReactivate, setRuleToReActivate] = useState(null);

  //Sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState(null);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-10">
        <label
          htmlFor="Rules"
          className="block text-gray-800 font-semibold text-sm"
        >
          Luật tính số tháng BHYT
        </label>
        {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
          <>
            {allowAdd ? (
              <Button
                color="default"
                size="sm"
                onClick={() => setAllowAdd(false)}
              >
                Huỷ
              </Button>
            ) : (
              <Button
                color="primary"
                size="sm"
                onClick={() => setAllowAdd(true)}
              >
                Thêm mới
              </Button>
            )}
          </>
        )}
      </div>

      <Table
        aria-label="Rules Table"
        isHeaderSticky
        className="max-h-[450px]"
        bottomContent={
          !ruleData.isLoading && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                // showShadow
                // color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          )
        }
      >
        <TableHeader>
          <TableColumn>Khối lớp</TableColumn>
          <TableColumn>Ngày sinh Từ</TableColumn>
          <TableColumn>Đến</TableColumn>
          <TableColumn>Số tháng </TableColumn>
          <TableColumn>Trạng thái </TableColumn>
          <TableColumn>Hành động</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"Không tìm thấy kết quả"}
          loadingContent={<Spinner />}
          isLoading={ruleData.isLoading}
        >
          {allowAdd && (
            <TableRow>
              <TableCell>
                {/* <Select
                  isRequired
                  label="Chọn khối"
                  placeholder="Chọn khối"
                  className="max-w-xs"
                  variant="bordered"
                >
                  {class_levels.map((item) => (
                    <SelectItem key={item.code}>{item.name}</SelectItem>
                  ))}
                </Select> */}
                <Select
                  placeholder="Chọn khối"
                  className="text-black text-sm"
                  classNames={{
                    control: () => "!rounded-[5px]",
                    input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                    valueContainer: () => "!p-[0_8px]",
                    menu: () => "!z-[11]",
                  }}
                  options={
                    class_levels
                      ? class_levels.map((item) => ({
                          value: item.code,
                          label: item.name,
                        }))
                      : null
                  }
                  value={classLevel}
                  onChange={setClassLevel}
                />
              </TableCell>
              <TableCell>
                <DateInput
                  day={startDay}
                  setDay={setStartDay}
                  month={startMonth}
                  setMonth={setStartMonth}
                />
              </TableCell>
              <TableCell>
                <DateInput
                  day={endDay}
                  setDay={setEndDay}
                  month={endMonth}
                  setMonth={setEndMonth}
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="block w-20 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                  placeholder="Số tháng"
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                {classLevel?.value &&
                startDay &&
                endDay &&
                startMonth &&
                endMonth &&
                months ? (
                  <Button size="sm" onClick={() => handleInsert()}>
                    {mutating ? (
                      <span className="loading loading-spinner loading-sm bg-primary"></span>
                    ) : (
                      "Lưu"
                    )}
                  </Button>
                ) : (
                  <></>
                )}
              </TableCell>
            </TableRow>
          )}
          {items.map((el) => (
            <TableRow key={el.id}>
              <TableCell>Khổi {el.class_level}</TableCell>
              <TableCell>
                {el.start_day} / {el.start_month}
              </TableCell>
              <TableCell>
                {el.end_day} / {el.end_month}
              </TableCell>
              <TableCell>{el.months}</TableCell>
              <TableCell>
                <FaCircle color={el.is_actived ? "green" : "gray"} />
              </TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Chỉnh sửa">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Button
                        isIconOnly
                        color="warning"
                        variant="ghost"
                        className="border-none"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setRuleToEdit(el);
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </span>
                  </Tooltip>
                  {el.is_actived ? (
                    <Tooltip color="danger" content="Vô hiệu hoá">
                      <Button
                        isIconOnly
                        variant="ghost"
                        className="border-none"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setRuleToDelete(el);
                        }}
                      >
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <DeleteIcon />
                        </span>
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip color="primary" content="Khôi phục">
                      <Button
                        isIconOnly
                        variant="ghost"
                        className="border-none"
                        onClick={() => {
                          setIsReActivateModalOpen(true);
                          setRuleToReActivate(el);
                        }}
                      >
                        <span className="text-lg text-primary cursor-pointer active:opacity-50">
                          <ReActivatedIcon />
                        </span>
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          ruleToDelete={ruleToDelete}
          getToken={getToken}
          queryClient={queryClient}
        />
      )}
      {isReActivateModalOpen && (
        <ReActivateModal
          isOpen={isReActivateModalOpen}
          onClose={() => setIsReActivateModalOpen(false)}
          ruleToReactivate={ruleToReactivate}
        />
      )}
      {isEditModalOpen && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          ruleToEdit={ruleToEdit}
          class_levels={class_levels}
        />
      )}
    </div>
  );
};

export default Rules;
