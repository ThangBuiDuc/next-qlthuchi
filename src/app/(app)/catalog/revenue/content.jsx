"use client";
import React, {useState,useMemo} from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";

export default function Content({ data }) {
  //   console.log(data);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(data?.result?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data?.result?.slice(start, end);
  }, [page, data]);
  return (
    <div className="flex justify-center mt-10 flex-col">
      <h3 className="text-2xl font-bold text-center mb-4">Khoản thu / chi</h3>
      <Table
        aria-label="Bảng loại khoản thu, chi"
        isHeaderSticky
        className="max-h-[500px]"
        bottomContent={
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
        }
      >
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Nhóm khoản thu</TableColumn>
          <TableColumn>Mã</TableColumn>
          <TableColumn>Tên</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Không tìm thấy kết quả"}>
          {items.map((el, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{el.revenue_group.name}</TableCell>
              <TableCell>{el.code}</TableCell>
              <TableCell>{el.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
