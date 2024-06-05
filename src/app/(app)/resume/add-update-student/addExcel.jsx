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
// import { saveAs } from "file-saver";
import { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { FaTimes } from "react-icons/fa";
const { parse, isValid } = require("date-fns");

function createId(lastCount, code) {
  return `${code}${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

function isValidDateTime(text) {
  // Try parsing the date with a known format
  const dateFormats = [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    "MMMM d, yyyy HH:mm:ss",
  ];

  for (const format of dateFormats) {
    const parsedDate = parse(text, format, new Date());
    if (isValid(parsedDate) && parsedDate.toString() !== "Invalid Date") {
      return true;
    }
  }

  return false;
}

const AddExcel = ({ catalogStudent, countStudent, present, queryObject }) => {
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [file, setFile] = useState();
  const [infor, setInfor] = useState([]);
  const [err, setErr] = useState([]);
  const ref = useRef();

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
      queryClient.invalidateQueries(["search", queryObject]);
      setFile(null);
      setMutating(false);
      setInfor([]);
      if (ref.current) {
        ref.current.value = null;
      }
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
          last_name: item.lastName.toString(),
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

  useEffect(() => {
    if (infor.length > 0) {
      setErr(
        infor.reduce((total, curr, index) => {
          if (
            catalogStudent.classes.some(
              (el) => el.class_level_code === curr.class_level_code
            ) &&
            catalogStudent.classes.some((el) => el.code === curr.class_code) &&
            catalogStudent.status.some((el) => el.id === curr.status) &&
            catalogStudent.gender.some((el) => el.id === curr.gender) &&
            isValidDateTime(curr.dob) &&
            isValidDateTime(curr.joinDate)
          )
            return total;
          else return [...total, index + 2];
        }, [])
      );
    }
  }, [infor]);

  console.log(err);

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
        {/* <div className="flex justify-end p-2">
          <button className="btn w-fit" onClick={() => handleExcelClick()}>
            File Mẫu
          </button>
        </div> */}
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              ref={ref}
              accept=".xlsx,.xls"
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div
              className="cursor-pointer tooltip w-fit h-fit self-center"
              data-tip="Xoá File chọn!"
              onClick={() => {
                setFile("");
                ref.current.value = "";
                setInfor([]);
                setErr([]);
              }}
            >
              <FaTimes size={20} />
            </div>
          </div>
          {err.length > 0 && (
            <p className="font-semibold">
              Vị trí dòng dữ liệu phát hiện lỗi:{" "}
              <span className="text-red-400">{err.join(", ")}</span>
            </p>
          )}
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
                isValidDateTime(item.dob) &&
                isValidDateTime(item.joinDate)
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
