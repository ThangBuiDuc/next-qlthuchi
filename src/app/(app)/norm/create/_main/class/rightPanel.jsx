import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useContext } from "react";
import { listContext } from "../../content";
import { getRevenueNorms } from "@/utils/funtionApi";
import { Scrollbars } from "react-custom-scrollbars-2";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
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

const RightPanel = ({ selected }) => {
  const { selectPresent } = useContext(listContext);
  const { getToken } = useAuth();
  const where = {
    batch_id: {
      _eq: selectPresent.id,
    },
    class_code: {
      _eq: selected.name,
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

  return (
    <div className="flex flex-col w-[60%] pl-3">
      <h6 className="text-center">Định mức thu đã lập</h6>
      <Scrollbars
        hideTracksWhenNotNeeded
        universal
        autoHeightMin={"100%"}
        autoHide
        //   autoHeight
      >
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
              ) : revenueNorms.data?.data.result.length ? (
                revenueNorms.data.data.result.map((item, index) => (
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
                    <td>{numberWithCommas(item.unit_price * item.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  {" "}
                  <td className="text-center" colSpan={5}>
                    Chưa có định mức thu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Scrollbars>
    </div>
  );
};

export default RightPanel;
