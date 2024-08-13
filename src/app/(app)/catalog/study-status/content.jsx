"use client";
import { IoMdAddCircleOutline } from "react-icons/io";
import Add from "./add";
import { Fragment } from "react";
// import Item from "./item";
import { useQuery } from "@tanstack/react-query";
import { getStudyStatus } from "@/utils/funtionApi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";

const Content = ({ permission, statusData }) => {
  const data = useQuery({
    queryKey: ["get_study_status"],
    queryFn: async () => await getStudyStatus(),
    initialData: () => ({ data: statusData }),
  });
  return (
    <div className="flex flex-col gap-[30px] p-[10px]">
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
        <>
          <label
            htmlFor={`modal_add`}
            className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
          >
            <IoMdAddCircleOutline size={20} />
            Thêm mới
          </label>
          <Add />
        </>
      )}

      {/* <div className="grid grid-cols-2 gap-[20px]">
        {rawData.map((item) => (
          <Item data={item} />
        ))}
      </div> */}

      <Table
        className="max-h-[450px]"
        aria-label="Study status table"
        isHeaderSticky
        isStriped
      >
        <TableHeader>
          <TableColumn></TableColumn>
          <TableColumn>Mã</TableColumn>
          <TableColumn>Tình trạng</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={data.isFetching && data.isLoading}
          loadingContent={<Spinner color="primary" />}
          emptyContent="Không có kết quả!"
        >
          {/* {rawData.map((item, index) => (
              <Fragment key={item.id}>
                <Item data={item} index={index} />
              </Fragment>
            ))} */}
          {data?.data?.data.result.map((item, index) => (
            // <Fragment key={item.id}>
            //   <Item data={item} index={index} />
            // </Fragment>

            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Content;
