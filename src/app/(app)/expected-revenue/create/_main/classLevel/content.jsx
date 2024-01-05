import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useContext } from "react";
import { listContext } from "../../content";
import { getRevenueNorms } from "@/utils/funtionApi";
// import { Scrollbars } from "react-custom-scrollbars-2";
import { useMutation } from "@tanstack/react-query";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { createExpectedRevenueRouter } from "@/utils/funtionApi";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map(() => (
        <tr>
          {[...Array(6)].map(() => (
            <td>
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

const Content = ({ selected }) => {
  const [mutating, setMutating] = useState(false);
  const [data, setData] = useState();
  const { selectPresent } = useContext(listContext);
  const { getToken } = useAuth();
  const where = {
    batch_id: {
      _eq: selectPresent.id,
    },
    class_level_code: {
      _eq: selected.code,
    },
    is_deleted: {
      _eq: false,
    },
    end_at: {
      _is_null: true,
    },
  };
  const revenueNorms = useQuery({
    queryKey: ["get_revenue_norms", selected],
    queryFn: async () =>
      getRevenueNorms(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        where
      ),
  });

  useEffect(() => {
    setData(revenueNorms?.data);
  }, [revenueNorms.data]);

  const mutation = useMutation({
    mutationFn: async () =>
      createExpectedRevenueRouter({
        type: "CLASS_LEVEL",
        data: [selected.code],
        time: moment().format(),
        batch_id: selectPresent.id,
      }),
    onSuccess: () => {
      setMutating(false);
      toast.success("Lập dự kiến thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Lập dự kiến thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  return (
    <div className="flex flex-col w-full max-h-full gap-2">
      <h6 className="text-center">Định mức thu đã lập</h6>
      {/* <Scrollbars
        hideTracksWhenNotNeeded
        universal
        autoHeightMin={"fit-content"}
        autoHeightMax={"100%"}
        autoHide
        autoHeight
      > */}
      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th>STT</th>
              <th>Khoản thu/Nhóm khoản thu</th>
              <th>Loại khoản thu</th>
              <th>Đơn giá/ Đơn vị tính</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {(revenueNorms.isLoading && revenueNorms.isFetching) ||
            revenueNorms.isRefetching ? (
              <Skeleton />
            ) : data?.data.result.length ? (
              data.data.result.map((item, index) => (
                <tr key={item.id} className="hover">
                  <td>{++index}</td>
                  <td>
                    {item.revenue.name}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {item.revenue.revenue_group.name}
                    </span>
                  </td>
                  <td>{item.revenue.revenue_group.revenue_type.name}</td>
                  <td>
                    {numberWithCommas(item.unit_price)}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      {item.calculation_unit.name}
                    </span>
                  </td>
                  <td>{item.amount}</td>
                  <td>{numberWithCommas(item.unit_price * item.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center" colSpan={5}>
                  Chưa có định mức thu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* </Scrollbars> */}
      <div className="flex justify-center gap-2">
        {mutating ? (
          <span className="loading loading-spinner loading-sm bg-primary"></span>
        ) : (
          <>
            {data?.data.result.length &&
            !revenueNorms.isLoading &&
            !revenueNorms.isFetching ? (
              <>
                <button
                  className="btn w-fit"
                  onClick={() => {
                    setMutating(true);
                    mutation.mutate();
                  }}
                >
                  Lập dự kiến thu
                </button>
                <div
                  className="tooltip flex items-center justify-center"
                  data-tip="Dự kiến thu trùng lặp sẽ lấy dự kiến thu thêm vào mới nhất!"
                >
                  <IoIosInformationCircleOutline
                    size={20}
                    className="text-red-500"
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Content;
