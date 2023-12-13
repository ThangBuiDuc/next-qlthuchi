"use client";
import { memo } from "react";

const Update = ({data}) => {
  return (
    <tr>
      <th>{data.id}</th>
      <th>{data.first_name} {data.last_name}</th>
      <th>{data.clerk_user_id}</th>
      <th>{data.user_roles[0]?.role.description}</th>
      <th><button>Edit</button></th>
    </tr>
  );
};

export default memo(Update);