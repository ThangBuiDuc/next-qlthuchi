"use client";
import React from "react";

export default function Content({ data }) {
  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6">
        <h3 className="text-2xl font-bold text-center mb-4">{data.name}</h3>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Mã Trường: </span>
            <span>{data.code}</span>
          </div>
          <div>
            <span className="font-semibold">Tên Ngân Hàng: </span>
            <span>{data.bank_name}</span>
          </div>
          <div>
            <span className="font-semibold">Số Tài Khoản: </span>
            <span>{data.bank_account}</span>
          </div>
          <div>
            <span className="font-semibold">Địa Chỉ: </span>
            <span>{data.address}</span>
          </div>
          <div>
            <span className="font-semibold">Người Đại Diện: </span>
            <span>{data.representative}</span>
          </div>
          <div>
            <span className="font-semibold">Mã Số Thuế: </span>
            <span>{data.tax_code}</span>
          </div>
          <div>
            <span className="font-semibold">Số Điện Thoại: </span>
            <span>{data.telephone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
