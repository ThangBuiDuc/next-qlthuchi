const Item = ({ data, index }) => {
  return (
    <tr className="hover">
      <th>{index + 1}</th>
      <th>{data.code}</th>
      <th>{data.description}</th>
      <th>{data.percent * 100}%</th>
      <th>{data.start_date}</th>
      <th>{data.end_date}</th>
    </tr>
  );
};

export default Item;
