"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import { GoPersonAdd } from "react-icons/go";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createParent, getStudent } from "@/utils/funtionApi";
import Student from "./student";
import Select from "react-select";
import { useAuth } from "@clerk/nextjs";
import Family from "./family";
import { toast } from "react-toastify";

const Parent = ({ student_code, studentRaw, catalogStudent }) => {
  const queryClient = useQueryClient();
  const [mutating, setMutating] = useState(false);
  const { getToken } = useAuth();
  const [parent, setParent] = useState({
    first_name: "",
    last_name: "",
    telephone: "",
    address: "",
    relation: null,
  });
  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createParent(token, objects),
    onSuccess: () => {
      setMutating(false);
      document.getElementById("modal_add_parent").close();
      queryClient.invalidateQueries({
        queryKey: ["student_information", student_code],
      });
      setParent({
        first_name: "",
        last_name: "",
        telephone: "",
        address: "",
        relation: null,
      });
      toast.success("Tạo mới phụ huynh học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      // document.getElementById("modal_add_parent").close();
      toast.error("Tạo mới phụ huynh học sinh không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnclick = async () => {
    setMutating(true);
    let objects = {
      first_name: parent.first_name,
      last_name: parent.last_name,
      phone_number: parent.telephone,
      address: parent.address,
      student_parents: {
        data: {
          family_relationship_id: parent.relation.value,
          student_code: studentRaw.code,
        },
      },
    };
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
    });
    mutation.mutate({ token, objects });
  };

  return (
    <dialog id="modal_add_parent" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className={`w-full flex flex-col gap-1`}>
              <p className="text-xs">Họ đệm:</p>
              <input
                autoComplete="off"
                type={"text"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Họ đệm"
                value={parent.first_name}
                onChange={(e) => {
                  setParent((pre) => ({ ...pre, first_name: e.target.value }));
                }}
              />
            </div>
            <div className={`w-full flex flex-col gap-1`}>
              <p className="text-xs">Tên:</p>
              <input
                autoComplete="off"
                type={"text"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Họ đệm"
                value={parent.last_name}
                onChange={(e) => {
                  setParent((pre) => ({ ...pre, last_name: e.target.value }));
                }}
              />
            </div>
            <div className={`w-full flex flex-col gap-1`}>
              <p className="text-xs">Số điện thoại:</p>
              <input
                autoComplete="off"
                type={"number"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Số điện thoại"
                value={parent.telephone}
                onChange={(e) => {
                  setParent((pre) => ({ ...pre, telephone: e.target.value }));
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs">Quan hệ:</p>
              <Select
                placeholder="Quan hệ"
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                options={catalogStudent.family_relationships.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={parent.relation}
                onChange={(e) => setParent((pre) => ({ ...pre, relation: e }))}
              />
            </div>
            <div className={`w-full flex flex-col gap-1 col-span-2`}>
              <p className="text-xs">Địa chỉ:</p>
              <input
                autoComplete="off"
                type={"text"}
                id={`query`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Địa chỉ"
                value={parent.address}
                onChange={(e) => {
                  setParent((pre) => ({ ...pre, address: e.target.value }));
                }}
              />
            </div>
          </div>
          {Object.values(parent).every((item) => item) ? (
            mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
            ) : (
              <button
                className="btn w-fit self-center"
                onClick={() => handleOnclick()}
              >
                Thêm
              </button>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </dialog>
  );
};

const Content = ({
  student_code,
  initialStudent,
  present,
  catalogStudent,
  permission,
}) => {
  const { getToken } = useAuth();
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );
  const [studentRaw, setStudentRaw] = useState();

  //   console.log(selectPresent);
  const student = useQuery({
    queryKey: ["student_information", student_code],
    queryFn: async () =>
      getStudent(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        {
          code: { _eq: student_code },
        }
      ),
    initialData: () => ({ data: initialStudent }),
  });

  useEffect(() => {
    if (student.data) {
      setStudentRaw(student.data.data.students[0]);
    }
  }, [student.data]);

  return (
    <>
      <div className="flex flex-col gap-[30px]">
        <div className="flex gap-1 items-center w-full justify-center">
          <h5>Học kỳ: </h5>
          <h5>{selectPresent.batch} - </h5>
          <h5>Năm học: {present.result[0].school_year}</h5>
        </div>
        {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
          <>
            <button
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
              onClick={() =>
                document.getElementById("modal_add_parent").showModal()
              }
            >
              <GoPersonAdd size={20} />
              Thêm phụ huynh
            </button>
            <Parent
              studentRaw={studentRaw}
              catalogStudent={catalogStudent}
              student_code={student_code}
            />
          </>
        )}
        {studentRaw && (
          <Student
            permission={permission}
            catalogStudent={catalogStudent}
            isRefetching={student.isRefetching}
            studentRaw={studentRaw}
            setStudentRaw={setStudentRaw}
            student_code={student_code}
            present={present}
            student={student.data.data}
          />
        )}
        {studentRaw && studentRaw?.student_parents.length ? (
          <>
            <h6 className="text-center">Danh sách phụ huynh học sinh</h6>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Quan hệ</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {studentRaw.student_parents.map((item, index) => (
                    <Fragment key={index}>
                      <Family
                        isRefetching={student.isRefetching}
                        student_code={student_code}
                        data={item}
                        stt={++index}
                        catalogStudent={catalogStudent}
                        permission={permission}
                      />
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Content;
