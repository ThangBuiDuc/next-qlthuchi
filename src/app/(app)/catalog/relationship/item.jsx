"use client";

const Item = ({ data, index }) => {
  return (
    <tr className="hover">
      <th>{index + 1}</th>
      <th>{data.id}</th>
      <th>{data.description}</th>
    </tr>
  );
};

export default Item;
