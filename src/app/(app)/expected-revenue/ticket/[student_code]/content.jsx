"use client";
import { getTicketStudent } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <tr key={index}>
          {[...Array(9)].map((_, i) => (
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

const Content = ({ present, student }) => {
  const { getToken } = useAuth();

  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  const [ticketData, setTicketData] = useState(null);

  const data = useQuery({
    queryFn: async () =>
      getTicketStudent(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        student.code
      ),
  });

  useEffect(() => {
    if (data.data?.data) {
      setTicketData(data.data.data);
    }
  }, [data.data]);

  console.log(data.data);
  return (
    <div className="flex flex-col p-[20px] gap-[15px]">
      <div className="flex gap-1 items-center w-full justify-center">
        <h5>Học kỳ: </h5>
        <h5>{selectPresent.batch} - </h5>
        <h5>Năm học: {present.result[0].school_year}</h5>
      </div>
      <div>
        <p className="font-semibold ">Mã học sinh: {student.code}</p>
        <p className="font-semibold ">
          Học sinh: {`${student.first_name} ${student.last_name}`}
        </p>
      </div>
    </div>
  );
};

// {ticketData === null? <Skeleton/>: ticketData.results.length === 0 ? :<></>}
export default Content;
