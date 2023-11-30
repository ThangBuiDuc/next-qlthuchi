"use client";
import { useState, useEffect } from "react";
import Add from "./add";
import { GoPersonAdd } from "react-icons/go";
import TextInput from "@/app/_component/textInput";
import Update from "./update";
import { useQuery } from "@tanstack/react-query";
import { getCountStudent } from "@/utils/funtionApi";
import Select from "react-select";
import { useAuth } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";

const Content = (props) => {
  const { getToken } = useAuth();
  const countStudent = useQuery({
    queryKey: ["count_student"],
    queryFn: async () =>
      getCountStudent(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        })
      ),
    initialData: () => ({
      data: props.countStudent,
    }),
  });

  // const student = useQuery({
  //   queryKey: ["get_student"],
  //   queryFn: async () =>
  //     getStudent(
  //       await getToken({
  //         template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
  //       })
  //     ),
  // });

  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
    code: "",
  });

  // const [studentData, setStudentData] = useState(null);

  // useEffect(() => {
  //   if (student.data) setStudentData(student.data.data);
  // }, [student.data]);

  useEffect(() => {
    if (
      selected.school &&
      selected.school.id !== selected.class_level?.school_level_id
    )
      setSelected((pre) => ({ ...pre, class_level: null }));
  }, [selected.school]);

  useEffect(() => {
    if (
      selected.class_level &&
      selected.class_level.id !== selected.class?.class_level_id
    )
      setSelected((pre) => ({ ...pre, class: null }));
  }, [selected.class_level]);

  // console.log(studentData);

  const [query, setQuery] = useState("");
  if (countStudent.error)
    throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại!");

  return (
    <>
      <div className="flex flex-col gap-[30px]">
        {countStudent.isFetching && countStudent.isLoading ? (
          <div>loading...</div>
        ) : (
          <button
            className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
            onClick={() => document.getElementById("modal_add").showModal()}
          >
            <GoPersonAdd size={20} />
            Thêm mới
          </button>
        )}
        {countStudent.data && (
          <Add
            catalogStudent={props.catalogStudent}
            countStudent={countStudent.data.data}
            present={props.present}
          />
        )}
        <form className="flex flex-row gap-1 p-[20px] justify-around">
          <TextInput
            className={"!w-[20%]"}
            label={"Nhập mã sinh viên"}
            value={query}
            id={"query"}
            action={setQuery}
          />
          <Select
            placeholder="Cấp"
            className="text-black text-sm w-[20%]"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={props.listSearch.school_level
              .sort((a, b) => a.code - b.code)
              .map((item) => ({ ...item, value: item.id, label: item.name }))}
            value={selected.school}
            onChange={(e) => setSelected((pre) => ({ ...pre, school: e }))}
          />
          <Select
            isDisabled={selected.school ? false : true}
            placeholder="Khối"
            className="text-black text-sm w-[15%]"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={props.listSearch.class_level
              ?.filter(
                (item) => item.school_level_id === selected.school?.value
              )
              .sort((a, b) => a.code - b.code)
              .map((item) => ({ ...item, value: item.id, label: item.name }))}
            value={selected.class_level}
            onChange={(e) => setSelected((pre) => ({ ...pre, class_level: e }))}
          />

          <Select
            isDisabled={selected.class_level ? false : true}
            placeholder="Lớp"
            className="text-black text-sm w-[15%]"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
            options={props.listSearch.classes
              ?.filter(
                (item) => item.class_level_id === selected.class_level?.value
              )
              .sort((a, b) => a.code - b.code)
              .map((item) => ({ ...item, value: item.id, label: item.name }))}
            value={selected.class}
            onChange={(e) => setSelected((pre) => ({ ...pre, class: e }))}
          />

          <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
            Tìm kiếm
          </button>
        </form>
        <div className="flex flex-col p-[20px]">
          <Update query={query} selected={selected} />
        </div>
      </div>
    </>
  );
};

export default Content;
