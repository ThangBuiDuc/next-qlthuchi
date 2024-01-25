"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, Fragment } from "react";
import Item from "./item";
import { getUserRole } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";

const Skeleton = () => {
  return (
    <>
      {[...Array(3)].map((_,index) => (
        <tr key={index}>
          {[...Array(5)].map((_,i) => (
            <td key={i}>
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

const Content = ({ roleData, userRole }) => {
  const { getToken } = useAuth();

  const data = useQuery({
    queryKey: ["user_role"],
    queryFn: async () =>
      await getUserRole(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
        })
      ),
    initialData: () => ({ data: userRole }),
  });

  console.log(data.data);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>ID clerk</th>
              <th>Quyền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.isFetching || data.isLoading ? (
              <Skeleton />
            ) : (
              data?.data?.data.result.map((item, index) => (
                <Fragment key={item.id}>
                  <Item data={item} roleData={roleData} index={index} />
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Content;
