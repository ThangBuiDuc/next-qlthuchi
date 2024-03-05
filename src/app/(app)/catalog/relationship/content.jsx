"use client";
import { IoMdAddCircleOutline } from "react-icons/io";
import Add from "./add";
import { Fragment } from "react";
import Item from "./item";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getFamilyRalationship } from "@/utils/funtionApi";

const Skeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i}>
          {[...Array(3)].map((_, ii) => (
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

const Content = ({ permission, relationshipData }) => {
  console.log(relationshipData);

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
      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã</th>
              <th>Quan hệ</th>
            </tr>
          </thead>
          <tbody>
            {/* {relationshipData?.result.map((item, index) => (
              <Fragment key={item.id}>
                <Item data={item} index={index} />
              </Fragment>
            ))} */}
            {data.isFetching || data.isLoading ? (
              <Skeleton />
            ) : data?.data?.data?.length === 0 ? (
              <p>Không có kết quả!</p>
            ) : data ? (
              data?.data?.data.result.map((item, index) => (
                <Fragment key={item.id}>
                  <Item data={item} index={index} />
                </Fragment>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;



