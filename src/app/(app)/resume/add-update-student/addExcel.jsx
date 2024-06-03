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
import { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";

function createId(lastCount, code) {
  return `${code}${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

const AddExcel = ({ catalogStudent, countStudent, present }) => {
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [file, setFile] = useState();
  const [infor, setInfor] = useState([]);
  const ref = useRef();

  const handleExcelClick = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Danh sach hoc sinh", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    sheet.addRow([
      "MaBoGiaoDuc",
      "Lop",
      "MaLop",
      "HoDem",
      "Ten",
      "NgaySinh",
      "MaGioiTinh",
      "NgayNhapHoc",
      "MaTrangThai",
      "DiaChi",
    ]);

    for (let i = 1; i <= sheet.columnCount; i++) {
      sheet.getColumn(i).numFmt = "@";
    }

    // sheet.getCell('F1').note('Đổi định dạng cột sang TEXT trước khi nhập!!')
    // sheet.getCell('H1').note('Đổi định dạng cột sang TEXT trước khi nhập!!')

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
          wooksheet.eachRow((row, rowNumber) => {
            // console.log(row.values);
            // console.log(row.values);
            if (rowNumber > 1) {
              const data = row.values;
              setInfor((pre) => [
                ...pre,
                {
                  bgd_code: data[1],
                  class_level_code: parseInt(data[2]),
                  class_code: data[3],
                  firtsName: data[4],
                  lastName: data[5],
                  dob: data[6],
                  gender: parseInt(data[7]),
                  joinDate: data[8],
                  status: parseInt(data[9]),
                  address: data[10],
                },
              ]);
            }
          });
        });
      };
    };
    if (file) {
      processExcel();
    }
  }, [file]);

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createStudent(token, objects),
    onSuccess: () => {
      document.getElementById("modal_add_excel").close();
      setFile(null);
      setMutating(false);
      setInfor([]);
      if (ref.current) {
        ref.current.value = null;
      }
      queryClient.invalidateQueries(["count_student"]);
      toast.success("Tạo mới học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setFile(null);
      setMutating(false);
      setInfor([]);
      if (ref.current) {
        ref.current.value = null;
      }
      document.getElementById("modal_add_excel").close();
      toast.error("Tạo mới học sinh không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setMutating(true);
      // console.log(moment(infor[0].dob).format("yyyy-MM-DD"));
      let primarySchool;
      let secondarySchool;
      countStudent.result.map((item) => {
        if (item.school_level_code === 1) {
          primarySchool = infor.filter(
            (el) =>
              catalogStudent.classes.find(
                (el1) => el1.class_level_code === el.class_level_code
              ).school_level_code === item.school_level_code
          );
        }

        if (item.school_level_code === 2) {
          secondarySchool = infor.filter(
            (el) =>
              catalogStudent.classes.find(
                (el1) => el1.class_level_code === el.class_level_code
              ).school_level_code === item.school_level_code
          );
        }
      });

      // let objects = {
      //   code: infor.code,
      //   bgd_code: infor.bgd_code,
      //   first_name: infor.firtsName,
      //   last_name: infor.lastName,
      //   date_of_birth: moment(infor.dob).format("MM/DD/YYYY"),
      //   gender_id: infor.gender.value,
      //   address: infor.address,
      //   join_date: moment(infor.joinDate).format("MM/DD/YYYY"),
      //   status_id: infor.status.value,
      //   schoolyear_students: {
      //     data: {
      //       class_code: infor.class.value,
      //       school_year_id: present.result[0].id,
      //     },
      //   },
      // };

      let objects = [
        ...primarySchool.map((item, index) => ({
          code: createId(
            countStudent.result.find((el) => el.school_level_code === 1).count +
              index,
            1
          ),
          bgd_code: item.bgd_code,
          first_name: item.firtsName,
          last_name: item.lastName,
          date_of_birth: item.dob.toString().split(/[\/-]/).reverse().join("-"),
          gender_id: item.gender,
          address: item.address,
          join_date: item.joinDate
            .toString()
            .split(/[\/-]/)
            .reverse()
            .join("-"),
          status_id: item.status,
          schoolyear_students: {
            data: {
              class_code: `${item.class_level_code}${item.class_code}`,
              school_year_id: present.result[0].id,
            },
          },
        })),
        ...secondarySchool.map((item, index) => ({
          code: createId(
            countStudent.result.find((el) => el.school_level_code === 2).count +
              index,
            2
          ),
          bgd_code: item.bgd_code ? item.bgd_code : null,
          first_name: item.firtsName,
          last_name: item.lastName,
          date_of_birth: item.dob.toString().split(/[\/-]/).reverse().join("-"),
          gender_id: item.gender,
          address: item.address,
          join_date: item.joinDate
            .toString()
            .split(/[\/-]/)
            .reverse()
            .join("-"),
          status_id: item.status,
          schoolyear_students: {
            data: {
              class_code: `${item.class_level_code}${item.class_code}`,
              school_year_id: present.result[0].id,
            },
          },
        })),
      ];

      // console.log(objects);
      let token = await getToken({
        template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
      });

      mutation.mutate({ token, objects });
    },

    [infor]
  );

  // console.log(infor);
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
  // console.log(infor);

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
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <input
            ref={ref}
            accept=".xlsx,.xls"
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {infor.length > 0 &&
            infor.every(
              (item) =>
                catalogStudent.classes.some(
                  (el) => el.class_level_code === item.class_level_code
                ) &&
                catalogStudent.classes.some(
                  (el) => el.code === item.class_code
                ) &&
                catalogStudent.status.some((el) => el.id === item.status) &&
                catalogStudent.gender.some((el) => el.id === item.gender) &&
                item.dob &&
                item.joinDate
            ) &&
            (mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
            ) : (
              <button className="btn w-fit self-center">Nhập dữ liệu</button>
            ))}
        </form>
      </div>
    </dialog>
  );
};

export default AddExcel;
