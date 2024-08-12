"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";

const Content = ({ wards, permission }) => {
  return (
    <Table
      className="max-h-[450px]"
      aria-label="Wards table"
      isHeaderSticky
      isStriped
    >
      {/* head */}
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Mã phường, xã</TableColumn>
        <TableColumn>Cấp</TableColumn>
        <TableColumn>Tên phường, xã</TableColumn>
        <TableColumn>Mã quận, huyện</TableColumn>
        <TableColumn>Tên quận, huyện</TableColumn>
      </TableHeader>
      <TableBody>
        {wards.result.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.code}</TableCell>
            <TableCell>{item.level}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.district_code}</TableCell>
            <TableCell>{item.district_name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Content;
