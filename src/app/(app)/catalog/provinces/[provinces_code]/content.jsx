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

const Content = ({ districts }) => {
  return (
    <Table
      className="max-h-[450px]"
      aria-label="District table"
      isHeaderSticky
      isStriped
    >
      {/* head */}
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Mã quận, huyện</TableColumn>
        <TableColumn>Cấp</TableColumn>
        <TableColumn>Tên quận, huyện</TableColumn>
        <TableColumn>Mã tỉnh thành</TableColumn>
        <TableColumn>Tên tỉnh thành</TableColumn>
        <TableColumn></TableColumn>
      </TableHeader>
      <TableBody>
        {districts.result.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.code}</TableCell>
            <TableCell>{item.level}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.province_code}</TableCell>
            <TableCell>{item.province_name}</TableCell>
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
