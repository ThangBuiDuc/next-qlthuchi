"use client";
import { memo } from "react";
import { GoGear } from "react-icons/go";
import Edit from "./edit";

const Item = ({data, roleData}) => {
  return (
    <tr>
      <td><p>{data.id}</p></td>
      <td><p>{data.first_name} {data.last_name}</p></td>
      <th><p>{data.clerk_user_id}</p></th>
      <td>{data.user_roles[0]? <p>{data.user_roles[0]?.role.description}</p> : <p>Chưa được phân quyền</p> }</td>
      <td>
      <label
        htmlFor={`modal_add_${data.id}`}
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
      >
        <GoGear size={25} />
      </label>
      </td>
      <td><><Edit data={data} roleData={roleData}/></></td>
    </tr>
  );
};

export default memo(Item);