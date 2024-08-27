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
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import Swal from "sweetalert2";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <tr key={index}>
          {[...Array(6)].map((_, i) => (
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

const Content = ({ selected }) => {
  const [mutating, setMutating] = useState(false);
  const [data, setData] = useState();
  const { selectPresent, permission } = useContext(listContext);
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
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
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
        type: "CLASS",
        data: [selected.name],
        time: moment().format(),
        batch_id: selectPresent.id,
      }),
    onSuccess: () => {
      // setMutating(false);
      // toast.success("Lập dự kiến thu thành công!", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   theme: "light",
      // });
      Swal.fire({
        title: "Lập dự kiến thu",
        text: "Lập dự kiến thu thành công",
        icon: "success",
      });
    },
    onError: () => {
      // setMutating(false);
      // toast.error("Lập dự kiến thu không thành công!", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   theme: "light",
      // });
      Swal.fire({
        title: "Lập dự kiến thu",
        text: "Lập dự kiến thu không thành công",
        icon: "error",
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
      <Table
        className="max-h-[450px]"
        aria-label="Create expected class table"
        isHeaderSticky
        isStriped
      >
        {/* head */}
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Khoản thu/Nhóm khoản thu</TableColumn>
          <TableColumn>Loại khoản thu</TableColumn>
          <TableColumn>Đơn giá/ Đơn vị tính</TableColumn>
          <TableColumn>Số lượng</TableColumn>
          <TableColumn>Tổng tiền</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={revenueNorms.isFetching && revenueNorms.isLoading}
          loadingContent={<Spinner color="primary" />}
          emptyContent="Không có kết quả!"
        >
          {data?.data.result.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{++index}</TableCell>
              <TableCell>
                {item.revenue.name}
                <br />
                <span className="badge badge-ghost badge-sm">
                  {item.revenue.revenue_group.name}
                </span>
              </TableCell>
              <TableCell>
                {item.revenue.revenue_group.revenue_type.name}
              </TableCell>
              <TableCell>
                {numberWithCommas(item.unit_price)}
                <br />
                <span className="badge badge-ghost badge-sm">
                  {item.calculation_unit.name}
                </span>
              </TableCell>
              <TableCell>{item.amount}</TableCell>
              <TableCell>
                {numberWithCommas(item.unit_price * item.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </Scrollbars> */}
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
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
                      // setMutating(true);
                      // mutation.mutate();
                      Swal.fire({
                        title: "Lập dự kiến thu",
                        text: "Bạn có chắc chắn muốn lập dự kiến thu? Dự kiến thu trùng sẽ được thay thế dự kiến mới nhất!",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonColor: "#134a9abf",
                        confirmButtonText: "Lập dự kiến",
                        cancelButtonText: "Huỷ",
                        allowOutsideClick: () => !Swal.isLoading(),
                        preConfirm: async () => await mutation.mutateAsync(),
                        icon: "question",
                        showLoaderOnConfirm: true,
                      });
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
      )}
    </div>
  );
};

export default Content;
