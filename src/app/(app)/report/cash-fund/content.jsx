"use client";

import React, { useState, useRef } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import "moment/locale/vi";


const Table = () => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th rowspan="2">Ngày tháng chứng từ</th>
              <th colspan="2">Số hiệu</th>
              <th rowspan="2">Diễn giải</th>
              <th colspan="3">Số tiền</th>
            </tr>
            <tr>
              <th>Thu</th>
              <th>Chi</th>
              <th>Thu</th>
              <th>Chi</th>
              <th>Tồn</th>
            </tr>
            <tr className="bg-[#fef9c3]">
              <th></th>
              <th></th>
              <th></th>
              <th>Tồn quỹ đầu ngày ................</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th></th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {/* <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Zemlak, Daniel and Leannon</td>
              <td>United States</td>
              <td>12/5/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Carroll Group</td>
              <td>China</td>
              <td>8/15/2020</td>
              <td>Red</td>
            </tr>
            <tr>
              <th>4</th>
              <td>Marjy Ferencz</td>
              <td>Office Assistant I</td>
              <td>Rowe-Schoen</td>
              <td>Russia</td>
              <td>3/25/2021</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>5</th>
              <td>Yancy Tear</td>
              <td>Community Outreach Specialist</td>
              <td>Wyman-Ledner</td>
              <td>Brazil</td>
              <td>5/22/2020</td>
              <td>Indigo</td>
            </tr>
            <tr>
              <th>6</th>
              <td>Irma Vasilik</td>
              <td>Editor</td>
              <td>Wiza, Bins and Emard</td>
              <td>Venezuela</td>
              <td>12/8/2020</td>
              <td>Purple</td>
            </tr>
            <tr>
              <th>7</th>
              <td>Meghann Durtnal</td>
              <td>Staff Accountant IV</td>
              <td>Schuster-Schimmel</td>
              <td>Philippines</td>
              <td>2/17/2021</td>
              <td>Yellow</td>
            </tr>
            <tr>
              <th>8</th>
              <td>Sammy Seston</td>
              <td>Accountant I</td>
              <td>O'Hara, Welch and Keebler</td>
              <td>Indonesia</td>
              <td>5/23/2020</td>
              <td>Crimson</td>
            </tr>
            <tr>
              <th>9</th>
              <td>Lesya Tinham</td>
              <td>Safety Technician IV</td>
              <td>Turner-Kuhlman</td>
              <td>Philippines</td>
              <td>2/21/2021</td>
              <td>Maroon</td>
            </tr>
            <tr>
              <th>10</th>
              <td>Zaneta Tewkesbury</td>
              <td>VP Marketing</td>
              <td>Sauer LLC</td>
              <td>Chad</td>
              <td>6/23/2020</td>
              <td>Green</td>
            </tr>
            <tr>
              <th>11</th>
              <td>Andy Tipple</td>
              <td>Librarian</td>
              <td>Hilpert Group</td>
              <td>Poland</td>
              <td>7/9/2020</td>
              <td>Indigo</td>
            </tr>
            <tr>
              <th>12</th>
              <td>Sophi Biles</td>
              <td>Recruiting Manager</td>
              <td>Gutmann Inc</td>
              <td>Indonesia</td>
              <td>2/12/2021</td>
              <td>Maroon</td>
            </tr>
            <tr>
              <th>13</th>
              <td>Florida Garces</td>
              <td>Web Developer IV</td>
              <td>Gaylord, Pacocha and Baumbach</td>
              <td>Poland</td>
              <td>5/31/2020</td>
              <td>Purple</td>
            </tr> */}
          </tbody>
          <tfoot>
            <tr className="bg-[#bbf7d0]">
              <th></th>
              <th></th>
              <th></th>
              <th>Cộng phát sinh</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr className="bg-[#fef9c3]">
              <th></th>
              <th></th>
              <th></th>
              <th>Tồn quỹ cuối ngày ................</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

const Content = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  let ngaybatdau = moment(value.startDate).format('LL');
  let ngayketthuc = moment(value.endDate).format('LL');

  const ref = useRef();
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  return (
    <div className="flex flex-col items-center gap-[20px]">
      <h4>Báo cáo quỹ tiền mặt</h4>
      <div className="w-full flex gap-[10px] items-center justify-center">
        <p>Chọn thời gian: </p>
        <div className="w-1/4">
          <Datepicker
            i18n="vi"
            inputClassName="w-full border-solid border-slate-200 border-2 rounded-md focus:ring-0 p-[10px]"
            //toggleClassName="absolute bg-blue-300 rounded-md text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            useRange={true}
            value={value}
            onChange={(newValue) => setValue(newValue)}
            displayFormat={"DD-MM-YYYY"}
          />
        </div>
        <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
          Xem báo cáo
        </button>
        <button
          className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
          onClick={handlePrint}
        >
          In
        </button>
      </div>
      <Table />
      {/* print div */}
      <div
         className="hidden"
      >
        <div ref={ref} className="flex flex-col relative gap-2">
          <p className="text-rose-600">TRƯỜNG TH & THCS HỮU NGHỊ QUỐC TẾ</p>
          <h5 className="self-center">BÁO CÁO QUỸ TIỀN MẶT</h5>
          <p className="self-center">Loại Quỹ: Đồng Việt Nam</p>
          <p className="self-center">
            Từ ngày {ngaybatdau} đến ngày {ngayketthuc}
          </p>
          <Table />
          <div className="flex gap-2">
            <div className="flex flex-col w-1/2 items-center">
              <p>Kế toán trưởng</p>
              <span>...............</span>
            </div>
            <div className="flex flex-col w-1/2 items-center">
              <p>Ngày.....tháng.....năm 202...</p>
              <p>Thủ quỹ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
