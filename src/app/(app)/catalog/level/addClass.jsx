"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@nextui-org/input";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClass } from "@/utils/funtionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";

export default function AddClass({ classlevel, classes }) {
  // console.log(classlevel)
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [grade, setGrade] = useState();
  const [code, setCode] = useState();
  const [name, setName] = useState();
  const [schoolLevel, setSchoolLevel] = useState();
  const [isInvalid, setIsInvalid] = useState(false);

  // const handleSelectionChange = (e) => {
  //   setGrade(e.target.value);
  // };

  useEffect(() => {
    if (grade) {
      const selectedGrade = classlevel.result.find((el) =>
        grade.has(el.code.toString())
      );
      if (selectedGrade) {
        setSchoolLevel(selectedGrade.school_level_code);
      }
    } else {
      setSchoolLevel("");
    }
  
    if (grade && code) {
      setName([...grade][0] + code);
    } else {
      setName("");
    }
  
    // Validate code duplication within the selected grade
    if (grade && code) {
      const gradeCode = [...grade][0];
      const isDuplicate = classes.result.some(
        (el) => el.class_level_code === parseInt(gradeCode) && el.code === code
      );
      setIsInvalid(isDuplicate);
    } else {
      setIsInvalid(false);
    }
  }, [grade, code, classlevel, classes]);
  

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createClass(token, objects),
    onSuccess: () => {
      setMutating(false);
      setGrade();
      setCode();
      setName();
        queryClient.invalidateQueries(["get_classes"]);
      toast.success("Thêm mới lớp học thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      const modalCheckbox = document.getElementById(`modal_add`);
      if (modalCheckbox) {
        modalCheckbox.checked = false;
      }
    },
    onError: () => {
      setMutating(false);
      toast.error("Thêm mới lớp học không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleInsert = async () => {
    const objects = {
      class_level_code: parseInt([...grade][0], 10),
      school_level_code: schoolLevel,
      code: code,
      name: name,
    };

    // console.log(objects);
    setMutating(true);
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, objects });
  };

  return (
    <>
      <input type="checkbox" id={`modal_add`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-1/4"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_add`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <form
            // onSubmit={handleOnSubmit}
            className="flex flex-col gap-[20px] mt-[20px]"
            style={{ overflowY: "unset" }}
            autoComplete="off"
          >
            <div className="flex flex-col items-center w-full">
              <h4 className="my-5">Thêm mới một lớp</h4>
              <div className="flex flex-col w-full gap-5">
                <Select
                  label="Chọn khối"
                  className="max-w-xs"
                  selectedKeys={grade}
                  onSelectionChange={setGrade}
                  //   selectedKeys={[grade]}
                  //   onChange={handleSelectionChange}
                >
                  {classlevel.result.map((el) => (
                    <SelectItem key={el.code} value={el.code}>
                      {el.name}
                    </SelectItem>
                  ))}
                </Select>
                {/* <p>{grade}</p> */}
                {/* <Input
                  type="text"
                  label="Mã lớp (Ví dụ: A1, A2,... )"
                  value={code}
                  onValueChange={setCode}
                /> */}
                <Input
                  type="text"
                  label="Mã lớp (Ví dụ: A1, A2,... )"
                  value={code}
                  isInvalid={isInvalid}
                  color={isInvalid ? "danger" : "success"}
                  errorMessage="Mã lớp đã tồn tại trong khối này"
                  onValueChange={setCode}
                  className="max-w-xs"
                />
                <Input
                  isReadOnly
                  type="text"
                  label="Tên lớp"
                  value={name}
                  onValueChange={setName}
                />
              </div>
              {grade && code && name ? (
                <Button
                  color="primary"
                  className="mt-5"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleInsert();
                  }}
                >
                  {mutating ? (
                    <span className="loading loading-spinner loading-sm bg-primary"></span>
                  ) : (
                    "Lưu"
                  )}
                </Button>
              ) : (
                <></>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
