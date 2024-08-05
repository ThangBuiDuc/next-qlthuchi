"use client";
import Select from "react-select";
import {
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { listContext } from "../content";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getExpectedRevenue } from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
// import Html2Pdf from "js-html2pdf";

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const SubContent = ({ student, selectPresent, permission, school_year }) => {
  const { config } = useContext(listContext);
  const { user } = useUser();
  const [mutating, setMutating] = useState(false);
  const [data, setData] = useState();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const where = {
    batch_id: {
      _eq: selectPresent.id,
    },
    student_code: {
      _eq: student.code,
    },
    is_deleted: {
      _eq: false,
    },
    end_at: {
      _is_null: true,
    },
  };

  const expectedRevenue = useQuery({
    queryKey: ["get_expected_revenue", where],
    queryFn: async () =>
      getExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        where
      ),
  });

  useLayoutEffect(() => {
    if (expectedRevenue.data) {
      setData(expectedRevenue.data?.data?.result);
    }
  }, [expectedRevenue.data]);

  if (expectedRevenue.isError) {
    throw new Error();
  }

  console.log(data);

  return (
    <>
      <div className="flex gap-4 w-full">
        {/* <Scrollbars universal autoHeight autoHeightMin={"450px"}> */}
        <div className="flex w-[48%]">
          <Table
            className="max-h-[450px] "
            isHeaderSticky
            isStriped
            color={"primary"}
            selectionMode="single"
            aria-label="from expected table"
            disabledKeys={data
              ?.filter((item) => item.expected_revenues.length > 1)
              .map((item) => `group_${item.id}`)}
            // selectionBehavior="toggle"
          >
            {/* head */}
            <TableHeader>
              <TableColumn>TT</TableColumn>
              <TableColumn>Khoản thu</TableColumn>
              <TableColumn>Loại khoản thu</TableColumn>
              <TableColumn>Số phải nộp kỳ này</TableColumn>
              <TableColumn>Số đã nộp trong kỳ</TableColumn>
              <TableColumn>Công nợ cuối kỳ</TableColumn>
              {/* <TableColumn>
                <div
                  className="tooltip tooltip-left cursor-pointer"
                  data-tip="Tải lại"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["get_expected_revenue", where],
                    });
                  }}
                >
                  <TbReload size={30} />
                </div>
              </TableColumn> */}
            </TableHeader>
            <TableBody
              isLoading={
                expectedRevenue.isRefetching ||
                (expectedRevenue.isFetching && expectedRevenue.isLoading)
              }
              loadingContent={<Spinner color="primary" />}
              emptyContent={"Không có kết quả!"}
            >
              {data
                ?.sort((a, b) => {
                  if (a.position === null) return 1;
                  if (b.position === null) return -1;
                  return a.position - b.position;
                })
                .filter((item) =>
                  item.scope.some((el) => el === student.school_level_code)
                )
                .filter((item) => item.expected_revenues.length > 0)
                .map((item, index) => {
                  // if (item.expected_revenues.length === 0) {
                  //   return (
                  //     <TableRow key={item.id}>
                  //       <TableCell>{index + 1}</TableCell>
                  //       <TableCell>{item.name}</TableCell>
                  //       <TableCell>{item.revenue_type.name}</TableCell>
                  //       <TableCell
                  //         className="text-center text-red-300"
                  //         aria-colspan={3}
                  //         colSpan={3}
                  //       >
                  //         Chưa có dự kiến thu
                  //       </TableCell>
                  //       <TableCell className="hidden"> </TableCell>
                  //       <TableCell className="hidden"> </TableCell>
                  //     </TableRow>
                  //   );
                  // }
                  if (item.expected_revenues.length === 1) {
                    return (
                      <TableRow key={item.expected_revenues[0].id}>
                        <TableCell
                          className={`${
                            typeof i === "number" ? "text-right" : ""
                          }`}
                        >
                          {typeof i === "number"
                            ? `${index + 1}.${i + 1}`
                            : index + 1}
                        </TableCell>
                        <TableCell>
                          {item.expected_revenues[0].revenue.name}
                        </TableCell>
                        <TableCell>{item.revenue_type.name}</TableCell>
                        <TableCell>
                          {numberWithCommas(
                            item.expected_revenues[0].actual_amount_collected,
                            config
                          )}{" "}
                          ₫
                        </TableCell>
                        <TableCell>
                          {numberWithCommas(
                            item.expected_revenues[0].amount_collected,
                            config
                          )}{" "}
                          ₫
                        </TableCell>
                        <TableCell>
                          {numberWithCommas(
                            item.expected_revenues[0].previous_batch_money +
                              item.expected_revenues[0]
                                .actual_amount_collected +
                              item.expected_revenues[0].amount_edited -
                              item.expected_revenues[0].amount_collected +
                              item.expected_revenues[0].amount_spend,
                            config
                          )}{" "}
                          ₫
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (item.expected_revenues.length > 1) {
                    return (
                      <>
                        <TableRow key={`group_${item.id}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.revenue_type.name}</TableCell>
                          <TableCell className="hidden"> </TableCell>
                          <TableCell className="hidden"> </TableCell>
                          <TableCell className="hidden"> </TableCell>
                          {/* <td className="text-center text-red-300" colSpan={8}>
                          Chưa có dự kiến thu
                        </td> */}
                        </TableRow>
                        {item.expected_revenues.map((el, i) => {
                          return (
                            <TableRow key={el.id}>
                              <TableCell
                                className={`${
                                  typeof i === "number" ? "text-right" : ""
                                }`}
                              >
                                {typeof i === "number"
                                  ? `${index + 1}.${i + 1}`
                                  : index + 1}
                              </TableCell>
                              <TableCell>{el.revenue.name}</TableCell>
                              <TableCell>{item.revenue_type.name}</TableCell>
                              <TableCell>
                                {numberWithCommas(
                                  el.actual_amount_collected,
                                  config
                                )}{" "}
                                ₫
                              </TableCell>
                              <TableCell>
                                {numberWithCommas(el.amount_collected, config)}{" "}
                                ₫
                              </TableCell>
                              <TableCell>
                                {numberWithCommas(
                                  el.previous_batch_money +
                                    el.actual_amount_collected +
                                    el.amount_edited -
                                    el.amount_collected +
                                    el.amount_spend,
                                  config
                                )}{" "}
                                ₫
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    );
                  }
                })}
            </TableBody>
          </Table>
        </div>
        <div className="flex w-[4%]"></div>
        <div className="flex w-[48%]">
          <Table
            className="max-h-[450px]"
            isHeaderSticky
            isStriped
            color={"primary"}
            selectionMode="single"
            aria-label="from expected table"
            // selectionBehavior="toggle"
          >
            {/* head */}
            <TableHeader>
              <TableColumn>TT</TableColumn>
              <TableColumn>Khoản thu</TableColumn>
              <TableColumn>Loại khoản thu</TableColumn>
              <TableColumn>Số phải nộp kỳ này</TableColumn>
              <TableColumn>Số đã nộp trong kỳ</TableColumn>
              <TableColumn>Công nợ cuối kỳ</TableColumn>
              {/* <TableColumn>
                <div
                  className="tooltip tooltip-left cursor-pointer"
                  data-tip="Tải lại"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["get_expected_revenue", where],
                    });
                  }}
                >
                  <TbReload size={30} />
                </div>
              </TableColumn> */}
            </TableHeader>
            <TableBody
              isLoading={
                expectedRevenue.isRefetching ||
                (expectedRevenue.isFetching && expectedRevenue.isLoading)
              }
              loadingContent={<Spinner color="primary" />}
              emptyContent={"Không có kết quả!"}
            >
              {data
                ?.sort((a, b) => {
                  if (a.position === null) return 1;
                  if (b.position === null) return -1;
                  return a.position - b.position;
                })
                .filter((item) =>
                  item.scope.some((el) => el === student.school_level_code)
                )
                .filter((item) => item.expected_revenues.length > 0)
                .map((item, index) => {
                  if (item.expected_revenues.length === 0) {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.revenue_type.name}</TableCell>
                        <TableCell
                          className="text-center text-red-300"
                          aria-colspan={3}
                          colSpan={3}
                        >
                          Chưa có dự kiến thu
                        </TableCell>
                        <TableCell className="hidden"> </TableCell>
                        <TableCell className="hidden"> </TableCell>
                      </TableRow>
                    );
                  }
                  if (item.expected_revenues.length === 1) {
                    return (
                      <TableRow key={item.id}>
                        <TableCell
                          className={`${
                            typeof i === "number" ? "text-right" : ""
                          }`}
                        >
                          {typeof i === "number"
                            ? `${index + 1}.${i + 1}`
                            : index + 1}
                        </TableCell>
                        <TableCell>
                          {item.expected_revenues[0].revenue.name}
                        </TableCell>
                        <TableCell>{item.revenue_type.name}</TableCell>
                        <TableCell>
                          {numberWithCommas(
                            item.expected_revenues[0].actual_amount_collected,
                            config
                          )}{" "}
                          ₫
                        </TableCell>
                        <TableCell>
                          {numberWithCommas(
                            item.expected_revenues[0].amount_collected,
                            config
                          )}{" "}
                          ₫
                        </TableCell>
                        <TableCell>
                          {numberWithCommas(
                            item.expected_revenues[0].previous_batch_money +
                              item.expected_revenues[0]
                                .actual_amount_collected +
                              item.expected_revenues[0].amount_edited -
                              item.expected_revenues[0].amount_collected +
                              item.expected_revenues[0].amount_spend,
                            config
                          )}{" "}
                          ₫
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (item.expected_revenues.length > 1) {
                    return (
                      <>
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.revenue_type.name}</TableCell>
                          <TableCell className="hidden"> </TableCell>
                          <TableCell className="hidden"> </TableCell>
                          <TableCell className="hidden"> </TableCell>
                          {/* <td className="text-center text-red-300" colSpan={8}>
                          Chưa có dự kiến thu
                        </td> */}
                        </TableRow>
                        {item.expected_revenues.map((el, i) => {
                          return (
                            <TableRow>
                              <TableCell
                                className={`${
                                  typeof i === "number" ? "text-right" : ""
                                }`}
                              >
                                {typeof i === "number"
                                  ? `${index + 1}.${i + 1}`
                                  : index + 1}
                              </TableCell>
                              <TableCell>{el.revenue.name}</TableCell>
                              <TableCell>{item.revenue_type.name}</TableCell>
                              <TableCell>
                                {numberWithCommas(
                                  el.actual_amount_collected,
                                  config
                                )}{" "}
                                ₫
                              </TableCell>
                              <TableCell>
                                {numberWithCommas(el.amount_collected, config)}{" "}
                                ₫
                              </TableCell>
                              <TableCell>
                                {numberWithCommas(
                                  el.previous_batch_money +
                                    el.actual_amount_collected +
                                    el.amount_edited -
                                    el.amount_collected +
                                    el.amount_spend,
                                  config
                                )}{" "}
                                ₫
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    );
                  }
                })}
            </TableBody>
          </Table>
        </div>
        {/* </Scrollbars> */}
      </div>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        <></>
      ) : (
        <></>
      )}
    </>
  );
};

export default SubContent;
