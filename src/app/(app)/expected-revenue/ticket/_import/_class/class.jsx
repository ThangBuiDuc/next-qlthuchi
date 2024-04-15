import { listContext } from "../../content";
import Select from "react-select";
import { Fragment, useContext, useEffect, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
// import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { getTicketStudent, updateTicket } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import LoadingCustom from "@/app/_component/loadingCustom";

// const Skeleton = () => {
//   return (
//     <>
//       {[...Array(4)].map((_, index) => (
//         <tr key={index}>
//           {[...Array(2)].map((_, i) => (
//             <td key={i}>
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
const Item = ({
  ticketData,
  setTicketData,
  data,
  ticketAte,
  ticketCollected,
}) => {
  return (
    <tr className="hover">
      <td>{data.student_code}</td>
      <td>{`${data.first_name} ${data.last_name}`}</td>
      <td>{data.ticket_remain}</td>
      {ticketCollected.map((item) => (
        <td key={`${data.student_code}${item.code}_thu`}>
          {item.position === data.position ? data.amount : 0}
        </td>
      ))}
      {ticketAte.map((item) => {
        const ticketCount = ticketData
          .filter((el) => el.student_code === data.student_code)
          .find((el) => item.position === el.position);
        return (
          <td key={`${data.student_code}${item.revenue_code}_an`}>
            {ticketCount ? (
              <input
                className="input border border-bordercl"
                type="number"
                value={ticketCount.ticket_count}
                onChange={(e) =>
                  setTicketData((pre) =>
                    pre.map((item) =>
                      item.position === ticketCount.position &&
                      item.student_code === data.student_code
                        ? { ...item, ticket_count: e.target.value }
                        : item
                    )
                  )
                }
                onWheel={(e) => e.target.blur()}
                onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
              />
            ) : (
              0
            )}
          </td>
        );
      })}
    </tr>
  );
};

const Content = ({ selected }) => {
  const [mutating, setMutating] = useState(false);
  const [ticketData, setTicketData] = useState();
  // const { user } = useUser();
  const { selectPresent } = useContext(listContext);
  const { getToken, userId } = useAuth();
  // console.log(selected);
  const { data, isFetching, isRefetching } = useQuery({
    queryFn: async () =>
      getTicketStudent(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        {
          class_code: { _eq: selected.name },
          batch_id: { _eq: selectPresent.id },
        }
      ),
    queryKey: ["ticket_student", selected],
  });

  useEffect(() => {
    if (data?.data?.results.length)
      setTicketData(
        data.data.results.reduce(
          (total, curr) => [...total, ...curr.ticket],
          []
        )
      );
  }, [data?.data]);

  const mutation = useMutation({
    mutationFn: async ({ ticketData, time }) =>
      updateTicket(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        ticketData.map((item) => ({
          _set: {
            ticket_count: parseInt(item.ticket_count),
            updated_by: userId,
            updated_at: time,
          },
          where: { id: { _eq: item.id } },
        }))
      ),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["get_revenue_norms", selected],
      // });
      toast.success("Cập nhật vé ăn cho lớp học thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setMutating(false);
    },
    onError: () => {
      toast.error("Cập nhật vé ăn cho lớp học không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      }),
        setMutating(false);
    },
  });

  const handleOnclick = useCallback(async () => {
    setMutating(true);
    let time = moment().format();

    mutation.mutate({ ticketData, time });
  }, [ticketData]);

  if (isFetching) return <LoadingCustom />;

  if (data.data.results.length === 0)
    return (
      <div className="flex flex-col">
        <h6 className="text-center">Hiện tại chưa có dữ liệu</h6>
      </div>
    );

  if (!ticketData) return <LoadingCustom />;
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Mã học sinh</th>
              <th>Họ tên học sinh</th>
              <th>Số vé ăn còn lại</th>
              {[
                ...new Map(
                  data.data.results.map((item) => [item.position, item])
                ).values(),
              ]
                .sort((a, b) => a.position - b.position)
                .map((item) => {
                  return (
                    <th key={`${item.code}_thu`}>
                      Vé ăn đã thu tháng {item.position}
                    </th>
                  );
                })}
              {[
                ...new Map(
                  data.data.results
                    .reduce((total, curr) => [...total, ...curr.ticket], [])
                    .map((item) => [item.position, item])
                ).values(),
              ]
                .sort((a, b) => a.position - b.position)
                .map((item) => {
                  return (
                    <th key={`${item.revenue_code}_an`}>
                      Vé ăn đã ăn tháng {item.position}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {data.data?.results.map((item) => (
              <Fragment key={item.student_code}>
                <Item
                  ticketData={ticketData}
                  setTicketData={setTicketData}
                  data={item}
                  ticketCollected={[
                    ...new Map(
                      data.data.results.map((item) => [item.position, item])
                    ).values(),
                  ].sort((a, b) => a.position - b.position)}
                  ticketAte={[
                    ...new Map(
                      data.data.results
                        .reduce((total, curr) => [...total, ...curr.ticket], [])
                        .map((item) => [item.position, item])
                    ).values(),
                  ].sort((a, b) => a.position - b.position)}
                />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {!isFetching || !isRefetching ? (
        mutating ? (
          <LoadingCustom style={"loading-xs"} />
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => handleOnclick()}
          >
            Cập nhật
          </button>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

const Class = () => {
  const { listSearch } = useContext(listContext);
  const [selected, setSelected] = useState();
  return (
    <>
      <div className="flex gap-1 items-center w-full">
        <h6>Lớp học: </h6>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearch.classes
            .sort(
              (a, b) =>
                a.class_level_code - b.class_level_code ||
                a.code.localeCompare(b.code)
            )
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
          classNames={{
            menu: () => "!z-[11]",
          }}
        />
      </div>
      {selected && <Content selected={selected} />}
    </>
  );
};

export default Class;
