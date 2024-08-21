"use client";
import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import AddClass from "./addClass";
import { getClasses } from "@/utils/funtionApi";

export default function Content({
  classlevel,
  schoolLevel,
  classes,
  permission,
}) {
  const queryClient = useQueryClient();
  // console.log(classlevel, schoolLevel, classes);
  const [selectedOption, setSelectedOption] = useState(null);
  const [grade, setGrade] = useState();

  const options = [
    { value: "shool-level", label: "Cấp" },
    { value: "classlevel", label: "Khối" },
    { value: "classes", label: "Lớp" },
  ];

  const handleSelectChange = (selected) => {
    setSelectedOption(selected.value);
    setGrade(null);
  };
  const classesData = useQuery({
    queryKey: ["get_classes"],
    queryFn: async () => await getClasses(),
    initialData: () => ({ data: classes }),
  });
  //   const [page, setPage] = useState(1);
  //   const rowsPerPage = 10;

  //   const pages = Math.ceil(data?.result?.length / rowsPerPage);

  //   const items = useMemo(() => {
  //     const start = (page - 1) * rowsPerPage;
  //     const end = start + rowsPerPage;

  //     return data?.result?.slice(start, end);
  //   }, [page, data]);
  return (
    <div className="flex justify-center mt-10 flex-col">
      <Select
        options={options}
        onChange={handleSelectChange}
        placeholder="Chọn cấp, khối, hoặc lớp"
      />
      <div className="my-5">
        {selectedOption === "shool-level" && (
          <div>
            {/* Render the interface for "Cấp" */}
            <h2 className="my-5">Danh mục Cấp</h2>
            {/* Add your code here */}
            <Table
              aria-label="Bảng danh mục cấp"
              isHeaderSticky
              className="max-h-[450px]"
            >
              <TableHeader>
                <TableColumn>STT</TableColumn>
                <TableColumn>Mã</TableColumn>
                <TableColumn>Tên</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"Không tìm thấy kết quả"}>
                {schoolLevel.result.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {selectedOption === "classlevel" && (
          <div>
            {/* Render the interface for "Khối" */}
            <h2 className="my-5">Danh mục Khối</h2>
            {/* Add your code here */}
            <Table
              aria-label="Bảng danh mục khối"
              isHeaderSticky
              className="max-h-[450px]"
            >
              <TableHeader>
                <TableColumn>STT</TableColumn>
                <TableColumn>Mã</TableColumn>
                <TableColumn>Tên</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"Không tìm thấy kết quả"}>
                {classlevel.result.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {selectedOption === "classes" && (
          <div>
            {/* Render the interface for "Lớp" */}
            <h2 className="my-5">Danh mục Lớp</h2>
            <div className="flex items-center gap-10">
              <Select
                options={classlevel.result.map((item) => ({
                  value: item.code,
                  label: item.name,
                }))}
                value={grade}
                onChange={setGrade}
                placeholder="Chọn khối"
                className="h-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "44px", // Adjust height to match button
                    minHeight: "44px",
                  }),
                }}
              />
              {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
                <>
                  <label
                    htmlFor={`modal_add`}
                    className="btn w-fit h-[44px] items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                  >
                    {/* <GoPersonAdd size={20} /> */}
                    Thêm mới
                  </label>
                  <AddClass classlevel={classlevel} classes={classes} />
                </>
              )}
            </div>
            {/* Add your code here */}
            {grade && (
              <Table
                aria-label="Bảng danh mục lớp"
                isHeaderSticky
                className="max-h-[450px] mt-5"
              >
                <TableHeader>
                  <TableColumn>STT</TableColumn>
                  <TableColumn>Mã</TableColumn>
                  <TableColumn>Tên</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Không tìm thấy kết quả"}>
                  {classesData?.data?.data?.result
                    ?.filter((item) => item.class_level_code === grade.value)
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
