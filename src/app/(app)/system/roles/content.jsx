"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, Fragment, useEffect } from "react";
import Item from "./item";
import { getListUserPermission } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";
import TextInput from "@/app/_component/textInput";

const Skeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <tr key={index}>
          {[...Array(5)].map((_, i) => (
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

const Content = ({ permission, listPermissionFunction }) => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");

  const data = useQuery({
    queryKey: ["user_permission"],
    queryFn: async () =>
      await getListUserPermission(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        })
      ),
  });

  useEffect(() => {
    if (data.data) {
      setUsers(data.data.data.result);
    }
  }, [data.data]);

  return (
    <div className="flex flex-col gap-2">
      {users ? (
        users.length ? (
          <>
            <TextInput
              value={query}
              action={setQuery}
              label={"Tìm kiếm"}
              className={"!w-[30%] self-end"}
            />
            {users
              .filter(
                (item) =>
                  item.email.includes(query) ||
                  item.first_name.includes(query) ||
                  item.last_name.includes(query)
              )
              .map((item) => (
                <Fragment key={item.email}>
                  <Item
                    listPermissionFunction={listPermissionFunction}
                    permission={permission}
                    data={item}
                    isRefetching={data.isRefetching}
                  />
                </Fragment>
              ))}
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Content;
