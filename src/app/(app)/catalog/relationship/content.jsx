"use client";
import { IoMdAddCircleOutline } from "react-icons/io";
import Add from "./add";
// import { Fragment } from "react";
// import Item from "./item";
import { useQuery } from "@tanstack/react-query";
import { getFamilyRalationship } from "@/utils/funtionApi";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";

// const Skeleton = () => {
//   return (
//     <>
//       {[...Array(5)].map((_, i) => (
//         <tr key={i}>
//           {[...Array(3)].map((_, ii) => (
//             <td key={ii}>
//               <>
//                 <div className="skeleton h-4 w-full"></div>
//               </>
//             </td>
//           ))}
//         </tr>
//       ))}
//     </>
//   );
// };

const Content = ({ permission, relationshipData }) => {
  // console.log(relationshipData);

  const data = useQuery({
    queryKey: ["get_relationship"],
    queryFn: async () => await getFamilyRalationship(),
    initialData: () => ({ data: relationshipData }),
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
        aria-label="relationship table"
        isHeaderSticky
        isStriped
      >
        {/* head */}
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Mã</TableColumn>
          <TableColumn>Quan hệ</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={data.isFetching && data.isLoading}
          loadingContent={<Spinner color="primary" />}
          emptyContent="Không có kết quả!"
        >
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
