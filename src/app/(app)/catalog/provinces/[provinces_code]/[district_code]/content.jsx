"use client";

const Content = async ({ wards, permission }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã phường, xã</th>
            <th>Cấp</th>
            <th>Tên phường, xã</th>
            <th>Mã quận, huyện</th>
            <th>Tên quận, huyện</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {wards.result.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.code}</td>
              <td>{item.level}</td>
              <td>{item.name}</td>
              <td>{item.district_code}</td>
              <td>{item.district_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Content;
