"use client";
import { CiCircleMore } from "react-icons/ci";
import Link from "next/link";

const Content = async ({ districts }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra table-lg">
        {/* head */}
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã quận, huyện</th>
            <th>Cấp</th>
            <th>Tên quận, huyện</th>
            <th>Mã tỉnh thành</th>
            <th>Tên tỉnh thành</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {districts.result.map((item, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{item.code}</td>
              <td>{item.level}</td>
              <td>{item.name}</td>
              <td>{item.province_code}</td>
              <td>{item.province_name}</td>
              <td>
                <div className="tooltip" data-tip="Chi tiết">
                  <Link href={`provinces/${item.code}`}>
                    <CiCircleMore size={25} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Content;
