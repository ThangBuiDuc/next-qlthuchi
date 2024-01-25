"use client";
import Moment from "react-moment";
import { memo } from "react";

const Update = ({ data }) => {
  return (
    <tr>
      <th>{data.id}</th>
      <th>
        {data.first_name} {data.last_name}
      </th>
      <th>{data.gender.description}</th>
      <th>
        <Moment format="DD/MM/YYYY">{data.date_of_birth}</Moment>
      </th>
      <th>
        {data.address}  
        {/* {data.ward?.name}  
        {data.district?.name}  
        {data.province?.name} */}
      </th>
      <th>{data.email}</th>
      <th>{data.phone_number}</th>
      {/* <th>
        <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
          Edit
        </button>
      </th> */}
    </tr>
  );
};

export default memo(Update);
