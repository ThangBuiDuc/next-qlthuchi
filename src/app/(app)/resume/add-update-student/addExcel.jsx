"use client";

import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "moment/locale/vi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

registerLocale("vi", vi);

import "react-datepicker/dist/react-datepicker.css";
import { createStudent } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";

function createId(lastCount, code) {
  return `${code}${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

const AddExcel = ({ catalogStudent, countStudent, present }) => {
  console.log(catalogStudent);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [file, setFile] = useState();
  const [infor, setInfor] = useState([]);

  const handleExcelClick = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Danh sach hoc sinh", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet.addRow([
      "Mã bộ giáo dục học sinh",
      "Lớp học",
      "Họ đệm",
      "Tên",
      "Ngày sinh",
      "Mã Giới tính",
      "Ngày nhập học",
      "Mã Trạng thái",
      "Địa chỉ",
    ]);

    const sheet1 = workbook.addWorksheet("Danh muc lop hoc", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet1.addRow(["lớp học"]);

    catalogStudent.classes.forEach((item) => sheet1.addRow([item.name]));

    const sheet2 = workbook.addWorksheet("Danh muc gioi tinh", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet2.addRow(["Mã", "Giới tính"]);

    catalogStudent.gender.forEach((item) =>
      sheet2.addRow([item.id, item.description])
    );

    const sheet3 = workbook.addWorksheet("Danh muc trang thai", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet3.addRow(["Mã", "Trạng thái"]);

    catalogStudent.status.forEach((item) =>
      sheet3.addRow([item.id, item.name])
    );

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "danh-sach-hoc-sinh.xlsx");
  };

  useEffect(() => {
    const processExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const buffer = reader.result;
        workbook.xlsx.load(buffer).then((wb) => {
          const wooksheet = wb.worksheets[0];
          wooksheet.eachRow((row, index) => {
            setInfor((pre) => [
              ...pre,
              {
                code: createId(
                  countStudent.result.find(
                    (el) =>
                      el.school_level_code ===
                      catalogStudent.classes[0].school_level_code
                  ).count,
                  catalogStudent.classes[0].school_level_code
                ),
                bgd_code: row[1],
                gender: null,
                class: {
                  ...catalogStudent.classes[0],
                  value: catalogStudent.classes[0].name,
                  label: catalogStudent.classes[0].name,
                },
                status: null,
                firtsName: "",
                lastName: "",
                joinDate: null,
                dob: null,
                address: "",
              },
            ]);
          });
        });
      };
    };
    if (file) {
      processExcel();
    }
  }, [file]);
  //   const mutation = useMutation({
  //     mutationFn: ({ token, arg }) => createStudent(token, arg),
  //     onSuccess: () => {
  //       document.getElementById("modal_add").close();
  //       queryClient.invalidateQueries(["count_student"]);
  //       dispatchInfor({
  //         type: "reset",
  //         payload: {
  //           value: {
  //             code: createId(
  //               countStudent.result.find(
  //                 (el) =>
  //                   el.school_level_code ===
  //                   catalogStudent.classes[0].school_level_code
  //               ).count,
  //               catalogStudent.classes[0].school_level_code
  //             ),
  //             gender: null,
  //             class: {
  //               ...catalogStudent.classes[0],
  //               value: catalogStudent.classes[0].name,
  //               label: catalogStudent.classes[0].name,
  //             },
  //             status: null,
  //             firtsName: "",
  //             lastName: "",
  //             joinDate: null,
  //             dob: null,
  //             address: "",
  //           },
  //         },
  //       });
  //       toast.success("Tạo mới học sinh thành công!", {
  //         position: "top-center",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         theme: "light",
  //       });
  //     },
  //     onError: () => {
  //       document.getElementById("modal_add").close();
  //       toast.error("Tạo mới học sinh không thành công!", {
  //         position: "top-center",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         theme: "light",
  //       });
  //     },
  //   });

  return (
    <dialog id="modal_add_excel" className="modal !z-[20]">
      <div className="modal-box bg-white ">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex justify-end p-2">
          <button className="btn w-fit" onClick={() => handleExcelClick()}>
            File Mẫu
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            accept=".xlsx,.xls"
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </form>
      </div>
    </dialog>
  );
};

export default AddExcel;
