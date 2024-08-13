"use client";
// import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
import Add from "./add";
import Edit from "./edit";
import { getDiscounts } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { GoGear } from "react-icons/go";
// import { motion } from "framer-motion";
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
//       {[...Array(6)].map((_, i) => (
//         <tr key={i}>
//           {[...Array(8)].map((_, ii) => (
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

// function Item({ data, index, discountTypeData, revenueGroupData, permission }) {
//   return (
//     <tr className="hover" key={index}>
//       <td>{index + 1}</td>
//       <td>{data.discount_type.name}</td>
//       <td>{data.code}</td>
//       <td>{data.description}</td>
//       <td>{data.ratio * 100} %</td>
//       <td>{data.revenue_group.name}</td>
//       {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
//         <>
//           <td>
//             <label
//               htmlFor={`modal_fix_${data.id}`}
//               className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
//             >
//               <GoGear size={20} />
//             </label>
//           </td>
//           <td>
//             <>
//               <Edit
//                 data={data}
//                 discountTypeData={discountTypeData}
//                 revenueGroupData={revenueGroupData}
//               />
//             </>
//           </td>
//         </>
//       )}
//     </tr>
//   );
// }

const Content = ({
  discountsData,
  discountTypeData,
  revenueGroupData,
  permission,
}) => {
  // console.log(discountsData);

  const data = useQuery({
    queryKey: ["get_discount"],
    queryFn: async () => await getDiscounts(),
    initialData: () => ({ data: discountsData }),
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
          <Add
            discountTypeData={discountTypeData}
            revenueGroupData={revenueGroupData}
            data={discountsData}
          />
        </>
      )}
      {/* <label
        htmlFor={`modal_add`}
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
      >
        <GoPersonAdd size={20} />
        Thêm mới
      </label> */}
      {/* <Add
        discountTypeData={discountTypeData}
        revenueGroupData={revenueGroupData}
      /> */}
      <Table
        className="max-h-[450px]"
        aria-label="discounts table"
        isHeaderSticky
        isStriped
      >
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Loại giảm giá</TableColumn>
          <TableColumn>Mã giảm giá</TableColumn>
          <TableColumn>Mô tả</TableColumn>
          <TableColumn>Tỉ lệ giảm</TableColumn>
          <TableColumn>Nhóm áp dụng</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody
          isLoading={data.isFetching && data.isLoading}
          loadingContent={<Spinner color="primary" />}
          emptyContent={"Không có kết quả!"}
        >
          {data?.data?.data.result.map((item, index) => (
            // <Fragment key={index}>
            //   <Item
            //     data={item}
            //     index={index}
            //     discountTypeData={discountTypeData}
            //     revenueGroupData={revenueGroupData}
            //     permission={permission}
            //   />
            // </Fragment>
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.discount_type.name}</TableCell>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.ratio * 100} %</TableCell>
              <TableCell>{item.revenue_group.name}</TableCell>
              {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
                <TableCell>
                  <div>
                    <label
                      htmlFor={`modal_fix_${item.id}`}
                      className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
                    >
                      <GoGear size={20} />
                    </label>
                    <Edit
                      data={item}
                      discountTypeData={discountTypeData}
                      revenueGroupData={revenueGroupData}
                    />
                  </div>
                </TableCell>
              ) : (
                <TableCell></TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Content;
