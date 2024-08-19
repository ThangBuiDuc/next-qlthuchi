"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

export default function Content({ data }) {
//   console.log(data);
  return (
    <div className="flex justify-center mt-10 flex-col">
      <h3 className="text-2xl font-bold text-center mb-4">
        Loại khoản thu / chi
      </h3>
      <Table
        aria-label="Bảng loại khoản thu, chi"
        isHeaderSticky
        className="max-h-[450px]"
      >
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Tên</TableColumn>
          <TableColumn>Mô tả</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Không tìm thấy kết quả"}>
          {data.result.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
