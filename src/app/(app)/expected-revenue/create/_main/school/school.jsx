"use client";
import { listContext } from "../../content";
import { useContext, useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import moment from "moment";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import { IoIosInformationCircleOutline } from "react-icons/io";
import Select from "react-select";
// import { createExpectedRevenueRouter } from "@/utils/funtionApi";
import Content from "./content";
// import RightPanel from "./rightPanel";

const School = () => {
  const [selected, setSelected] = useState();
  const { listSearch } = useContext(listContext);
  // const [mutating, setMutating] = useState(false);
  // const [school, setSchool] = useState({
  //   isCheckedAll: false,
  //   school: listSearch.school_level.map((item) => ({
  //     ...item,
  //     isChecked: false,
  //   })),
  // });

  // const mutation = useMutation({
  //   mutationFn: async () =>
  //     createExpectedRevenueRouter({
  //       type: "SCHOOL",
  //       data: school.school
  //         .filter((item) => item.isChecked)
  //         .map((item) => ({ id: item.id, code: item.code })),

  //       time: moment().format(),
  //       batch_id: selectPresent.id,
  //     }),
  //   onSuccess: () => {
  //     setMutating(false);
  //     toast.success("Lập dự kiến thu thành công!", {
  //       position: "top-center",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       theme: "light",
  //     });
  //   },
  //   onError: () => {
  //     setMutating(false);
  //     toast.error("Lập dự kiến thu không thành công!", {
  //       position: "top-center",
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       theme: "light",
  //     });
  //   },
  // });

  return (
    <>
      <div className="flex gap-1 items-center w-full">
        <h6>Cấp học: </h6>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearch.school_level
            .sort((a, b) => a.code - b.code)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
          classNames={{ menu: () => "!z-[11]" }}
        />
      </div>
      {selected && (
        <>
          <div className="flex w-full divide-x divide-black h-full">
            <Content selected={selected} />
            {/* <RightPanel selected={selected} /> */}
          </div>
        </>
      )}
    </>
  );
  // return (
  //   <>
  //     <div className="overflow-x-auto max-h-[450px]">
  //       <table className="table table-pin-rows">
  //         {/* head */}
  //         <thead>
  //           <tr>
  //             <th>
  //               <input
  //                 type="checkbox"
  //                 checked={school.isCheckedAll}
  //                 onChange={() => {
  //                   setSchool((pre) => ({
  //                     isCheckedAll: !pre.isCheckedAll,
  //                     school: pre.school.map((item) => ({
  //                       ...item,
  //                       isChecked: pre.isCheckedAll ? false : true,
  //                     })),
  //                   }));
  //                 }}
  //                 className="checkbox"
  //               />
  //             </th>
  //             <th>Mã trường</th>
  //             <th>Cấp độ</th>
  //             <th>Tên trường</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {school.school.map((item) => (
  //             <tr key={item.id}>
  //               <td>
  //                 <>
  //                   <input
  //                     type="checkbox"
  //                     checked={item.isChecked}
  //                     onChange={() => {
  //                       setSchool((pre) => {
  //                         let condition = pre.school.map((el) =>
  //                           el.id === item.id
  //                             ? { ...el, isChecked: !el.isChecked }
  //                             : el
  //                         );
  //                         return {
  //                           isCheckedAll: condition.every(
  //                             (item) => item.isChecked
  //                           ),
  //                           school: condition,
  //                         };
  //                       });
  //                     }}
  //                     className="checkbox"
  //                   />
  //                 </>
  //               </td>
  //               <td>{item.id}</td>
  //               <td>{item.code}</td>
  //               <td>{item.name}</td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //     <div className="flex justify-center gap-2">
  //       {mutating ? (
  //         <span className="loading loading-spinner loading-sm bg-primary"></span>
  //       ) : (
  //         <>
  //           {school.isCheckedAll ||
  //           school.school.some((item) => item.isChecked) ? (
  //             <>
  //               <button
  //                 className="btn w-fit"
  //                 onClick={() => {
  //                   setMutating(true);
  //                   mutation.mutate();
  //                 }}
  //               >
  //                 Hoàn thành
  //               </button>
  //               <div
  //                 className="tooltip flex items-center justify-center"
  //                 data-tip="Dự kiến thu trùng lặp sẽ lấy dự kiến thu thêm vào mới nhất!"
  //               >
  //                 <IoIosInformationCircleOutline
  //                   size={20}
  //                   className="text-red-500"
  //                 />
  //               </div>
  //             </>
  //           ) : (
  //             <></>
  //           )}
  //         </>
  //       )}
  //     </div>
  //   </>
  // );
};

export default School;
