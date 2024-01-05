"use client";
import moment from "moment";
import "moment/locale/vi";

const Table = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã học sinh</th>
            <th>Họ và tên học sinh</th>
            <th>Ngày sinh</th>
            <th>Lớp</th>
            <th>Mã lớp</th>
            <th>Công nợ đầu kỳ ... năm 202..-202...</th>
            <th>Ưu đãi, miễn giảm kỳ ... năm 202..-202...</th>
            <th>Số phải nộp kỳ ... năm 202..-202...</th>
            <th>Đã điều chỉnh kỳ ... năm 202..-202...</th>
            <th>Đã hoàn trả kỳ ... năm 202..-202...</th>
            <th>Số đã nộp đầu kỳ ... năm 202..-202...</th>
            <th>Công nợ cuối kỳ ... năm 202..-202...</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>1</th>
            <td>2012111005</td>
            <td>Bùi Đức Thắng</td>
            <td>02/01/2024</td>
            <td>1A1</td>
            <td>A1</td>
            <td>1.000.000đ</td>
            <td>1.000.000đ</td>
            <td>1.000.000đ</td>
            <td>1.000.000đ</td>
            <td>1.000.000đ</td>
            <td>1.000.000đ</td>
            <td>1.000.000đ</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Content = async () => {
  let date = moment().format("LL");
  console.log(date);

  return (
    <div>
      <div>Filter</div>
      <div>
        <h4>TỔNG HỢP CÔNG NỢ</h4>
        <p>Tại {date}</p>
        <Table/>
      </div>
    </div>
  );
};

export default Content;
