"use client";
import { useState, Fragment } from "react";
import Item from "./item";


const Content = ({ roleData, userRole }) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>ID clerk</th>
              <th>Quyền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userRole.result.map((item, index) => (
              <Fragment key={item.id}>
                <Item data={item} roleData={roleData} index={index} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Content;
