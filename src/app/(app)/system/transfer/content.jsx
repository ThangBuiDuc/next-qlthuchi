"use client";
import React from "react";
import ExpectedRevenue from "./expectedRevenue";

const Content = ({ transfer }) => {
  const { result } = transfer;
  if (!result[0].previous_batch_id) {
    return (
      <div className="flex gap-1 items-center w-full justify-center p-10">
        <h5>
          Hiện tại chưa có thông tin của học kỳ trước để thực hiện kết chuyển
          công nợ
        </h5>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center p-5 gap-7">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col justify-center items-center">
          <h5>Học kỳ trước</h5>
          <h6>
            Học kỳ {result[0].previous_batch} - Năm học{" "}
            {result[0].previous_school_year}
          </h6>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h5>Học kỳ hiện tại</h5>
          <h6>
            Học kỳ {result[0].batch} - Năm học {result[0].school_year}
          </h6>
        </div>
      </div>
      <button className="btn w-fit self-center">Kết chuyển</button>
      {/* <ExpectedRevenue previous_batch_id={result[0].previous_batch_id} /> */}
    </div>
  );
};

export default Content;
