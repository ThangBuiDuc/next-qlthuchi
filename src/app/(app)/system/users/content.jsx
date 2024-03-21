"use client";
// import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
// import TextInput from "@/app/_component/textInput";
import Add from "./add";
import Update from "./update";
import { getUsers } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
// import { motion } from "framer-motion";

const Skeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <tr key={i}>
          {[...Array(11)].map((_,ii) => (
            <td key={ii}>
              <>
                <div className="skeleton h-4 w-full"></div>
              </>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

const Content = ({ provinces, districts, usersData, permission, gender }) => {
  // const [isOpen, setIsOpen] = useState(false);

  const { getToken } = useAuth();

  const data = useQuery({
    queryKey: ["get_user"],
    queryFn: async () =>
      await getUsers(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        })
      ),
    initialData: () => ({ data: usersData }),
  });

  return (
    <div className="flex flex-col gap-[30px]">
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
        <>
          <label
            htmlFor={`modal_add`}
            className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
          >
            <GoPersonAdd size={20} />
            Thêm mới
          </label>
          <Add provinces={provinces} districts={districts} gender={gender}/>
        </>
      )}

      {/* <form className="flex flex-row justify-around mt-[10px] p-[20px]">
        <TextInput
          className={"!w-[70%]"}
          label={"Tìm kiếm người dùng"}
          value={query}
          id={"query"}
          action={setQuery}
        />
        <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl">
          Tìm kiếm
        </button>
      </form> */}

      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Địa chỉ</th>
              <th>Phường, xã</th>
              <th>Quận, huyện</th>
              <th>Tỉnh, thành phố</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.isFetching || data.isLoading ? (
              <Skeleton />
            ) : data?.data?.data?.length === 0 ? (
              <p>Không có kết quả!</p>
            ) : data ? (
              data?.data?.data.result.map((item) => (
                <Update key={item.id} data={item} provinces={provinces} districts={districts} permission={permission} gender={gender}/>
              ))
            ) : (
              <></>
            )}

            {/* {usersData ? (
              usersData.result.map((item) => (
                <Update key={item.id} data={item} />
              ))
            ) : (
              <></>
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
