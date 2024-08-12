"use client";
import { CiCircleMore } from "react-icons/ci";

import Link from "next/link";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

const Content = ({ provinces }) => {
  return (
    <Table
      className="max-h-[450px]"
      aria-label="Provinces table"
      isHeaderSticky
      isStriped
    >
      {/* head */}
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Mã tỉnh</TableColumn>
        <TableColumn>Cấp</TableColumn>
        <TableColumn>Tên tỉnh</TableColumn>
        <TableColumn></TableColumn>
      </TableHeader>
      <TableBody>
        {provinces?.result.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.code}</TableCell>
            <TableCell>{item.level}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <div className="tooltip" data-tip="Chi tiết">
                <Link href={`provinces/${item.code}`}>
                  <CiCircleMore size={25} />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Content;
