import React from 'react'
import { FaCircle } from "react-icons/fa6";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";

const Item = ({data,index}) => {
  console.log(data)
  const iconColor = data.is_actived ? 'green' : 'gray';
  return (
    <tr>
      {/* <td>{index+1}</td> */}
      <td>Khối {data.class_level}</td>
      <td>{data.start_day} / {data.start_month}</td>
      <td>{data.end_day} / {data.end_month}</td>
      <td>{data.months}</td>
      <td><FaCircle color={iconColor}/></td>
    </tr>
  )
}

export default Item
