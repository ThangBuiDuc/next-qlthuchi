"use client";
// import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
// import TextInput from "@/app/_component/textInput";
import Add from "./add";
import Edit from "./update";
import Moment from "react-moment";
import { GoGear } from "react-icons/go";
import { getUsers } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
// import { motion } from "framer-motion";

const Skeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <tr key={i}>
          {[...Array(11)].map((_, ii) => (
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
          <Add provinces={provinces} districts={districts} gender={gender} />
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

      <Table>
        <TableHeader>
          <TableColumn>Mã</TableColumn>
          <TableColumn>Tên</TableColumn>
          <TableColumn>Giới tính</TableColumn>
          <TableColumn>Ngày sinh</TableColumn>
          <TableColumn>Địa chỉ</TableColumn>
          <TableColumn>Phường, xã</TableColumn>
          <TableColumn>Quận, huyện</TableColumn>
          <TableColumn>Tỉnh, thành phố</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Số điện thoại</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="Không tìm thấy kết quả!"
          isLoading={data.isFetching || data.isLoading}
          loadingContent={<Spinner />}
        >
          {data?.data?.data.result.map((item) =>
            permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
                <TableCell>{item.gender.description}</TableCell>
                <TableCell>
                  <Moment format="DD/MM/YYYY">{item.date_of_birth}</Moment>
                </TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.ward?.name}</TableCell>
                <TableCell>{item.district?.name}</TableCell>
                <TableCell>{item.province?.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone_number}</TableCell>
                <TableCell>
                  <div>
                    <label
                      htmlFor={`modal_fix_${item.id}`}
                      className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                    >
                      <GoGear size={25} />
                    </label>
                    <Edit
                      data={item}
                      provinces={provinces}
                      districts={districts}
                      gender={gender}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
                <TableCell>{item.gender.description}</TableCell>
                <TableCell>
                  <Moment format="DD/MM/YYYY">{item.date_of_birth}</Moment>
                </TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.ward?.name}</TableCell>
                <TableCell>{item.district?.name}</TableCell>
                <TableCell>{item.province?.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone_number}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Content;
