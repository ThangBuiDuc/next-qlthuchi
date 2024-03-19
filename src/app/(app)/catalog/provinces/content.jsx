"use client";
import { CiCircleMore } from "react-icons/ci";

import Link from "next/link";

const Content = async ({ provinces }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã tỉnh</th>
            <th>Cấp</th>
            <th>Tên tỉnh</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {provinces.result.map((item, index) => (
            <tr key={item.id}>
              <th>{index + 1}</th>
              <td>{item.code}</td>
              <td>{item.level}</td>
              <td>{item.name}</td>
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
