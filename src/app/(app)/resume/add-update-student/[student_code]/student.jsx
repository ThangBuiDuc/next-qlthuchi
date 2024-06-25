"use client";
import { useState } from "react";
import TextInput from "@/app/_component/textInput";
import Datetime from "react-datetime";
import moment from "moment";
import "moment/locale/vi";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { updateStudent } from "@/utils/funtionApi";

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

const Student = ({
  studentRaw,
  setStudentRaw,
  isRefetching,
  catalogStudent,
  permission,
  present,
  student,
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [mutating, setMutating] = useState(false);
  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ token, data }) => updateStudent(token, data),
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries({
        queryKey: ["student_information", studentRaw.code],
      });
      toast.success("Cập nhật học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      // document.getElementById("modal_add_parent").close();
      toast.error("Cập nhật học sinh không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnclick = async () => {
    setMutating(true);
    let data = {
      where: {
        code: {
          _eq: studentRaw.code,
        },
      },
      _set: {
        first_name: studentRaw.first_name,
        last_name: studentRaw.last_name,
        date_of_birth: studentRaw.date_of_birth,
        address: studentRaw.address,
        status_id: studentRaw.status.id,
      },
      where1: {
        student_code: {
          _eq: studentRaw.code,
        },
        school_year_id: {
          _eq: present.result[0].id,
        },
      },
      _set1: {
        class_code: studentRaw.schoolyear_students[0].class.name,
        updated_by: user.id,
        updated_at: moment().format(),
      },
    };
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, data });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <TextInput value={studentRaw.code} disable label={"Mã sinh viên"} />
        <div className={`w-full flex flex-col gap-1`}>
          <p className="text-xs">Họ đệm:</p>
          <input
            autoComplete="off"
            type={"text"}
            id={`query`}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
            placeholder="Họ đệm"
            value={studentRaw.first_name}
            onChange={(e) => {
              setStudentRaw((pre) => ({ ...pre, first_name: e.target.value }));
            }}
          />
        </div>
        <div className={`w-full flex flex-col gap-1`}>
          <p className="text-xs">Tên:</p>
          <input
            autoComplete="off"
            type={"text"}
            id={`query`}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
            placeholder="Tên"
            value={studentRaw.last_name}
            onChange={(e) => {
              setStudentRaw((pre) => ({ ...pre, last_name: e.target.value }));
            }}
          />
        </div>
        {/* <TextInput
          value={studentRaw.schoolyear_students[0].class.name}
          disable
          label={"Lớp học"}
        /> */}
        <div className="flex flex-col gap-1">
          <p className="text-xs">Lớp học:</p>
          <Select
            placeholder="Lớp học"
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={catalogStudent.classes.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={{
              value: studentRaw.schoolyear_students[0].class.id,
              label: studentRaw.schoolyear_students[0].class.name,
            }}
            onChange={(e) =>
              setStudentRaw((pre) => ({
                ...pre,
                schoolyear_students: pre.schoolyear_students.map(
                  (item, index) => {
                    if (index === 0)
                      return {
                        class: {
                          ...item.class,
                          id: e.value,
                          name: e.label,
                        },
                      };
                    return item;
                  }
                ),
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs">Ngày sinh:</p>
          <Datetime
            value={moment(studentRaw.date_of_birth).format("DD-MM-YYYY")}
            timeFormat={false}
            dateFormat={"DD-MM-YYYY"}
            inputProps={{
              placeholder: "Ngày sinh",
              className: `px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300`,
            }}
          />
        </div>
        {/* <TextInput
          value={studentRaw.gender.description}
          disable
          label={"Giới tính"}
        /> */}
        <div className="flex flex-col gap-1">
          <p className="text-xs">Giới tính:</p>
          <Select
            placeholder="Giới tính"
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={catalogStudent.gender.map((item) => ({
              value: item.id,
              label: item.description,
            }))}
            value={{
              value: studentRaw.gender.id,
              label: studentRaw.gender.description,
            }}
            onChange={(e) =>
              setStudentRaw((pre) => ({
                ...pre,
                gender: {
                  ...pre.gender,
                  id: e.value,
                  description: e.label,
                },
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs">Trạng thái:</p>
          <Select
            placeholder="Trạng thái"
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={catalogStudent.status.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={{
              value: studentRaw.status.id,
              label: studentRaw.status.name,
            }}
            onChange={(e) =>
              setStudentRaw((pre) => ({
                ...pre,
                status: { id: e.value, name: e.label },
              }))
            }
          />
        </div>
        <div className={`w-full flex flex-col gap-1 col-span-2`}>
          <p className="text-xs">Địa chỉ:</p>
          <input
            autoComplete="off"
            type={"text"}
            id={`query`}
            className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
            placeholder="Địa chỉ"
            value={studentRaw.address}
            onChange={(e) => {
              setStudentRaw((pre) => ({ ...pre, address: e.target.value }));
            }}
          />
        </div>
      </div>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        isRefetching ? (
          <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
        ) : mutating ? (
          <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => handleOnclick()}
          >
            Cập nhật
          </button>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default Student;
