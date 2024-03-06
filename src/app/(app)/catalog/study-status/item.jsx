"use client";

const Item = ({ data, index }) => {
  return (
    <tr className="hover">
      <td>{index + 1}</td>
      <td>{data.id}</td>
      <td>{data.name}</td>
    </tr>
  );
};

export default Item;
