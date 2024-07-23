"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  meilisearchGetToken,
  meilisearchStudentSearch,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import { Tooltip } from "@nextui-org/tooltip";

const Search = ({
  queryObject,
  config,
  redirect,
  dataTip,
  children,
  modal,
}) => {
  // const [result, setResult] = useState(null);
  const { data, isRefetching, isLoading } = useQuery({
    queryKey: [`search`, queryObject],
    queryFn: async () =>
      meilisearchStudentSearch(queryObject, await meilisearchGetToken(), 1),
  });

  const [page, setPage] = useState(1);
  const rowsPerPage = Number(config.result[0].config.page.value);

  const pages = Math.ceil(data?.hits?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data?.hits?.slice(start, end);
  }, [page, data]);

  useEffect(() => {
    setPage(1);
  }, [queryObject]);

  // useEffect(() => {
  //   setResult(
  //     data?.hits
  //       .reduce((total, curr) => [...total, ...curr.hits], [])
  //       .map((item) => ({ ...item, isOpen: false }))
  //   );
  // }, [data]);

  return (
    <Table
      aria-label="Student Table"
      // removeWrapper
      className="max-h-[450px]"
      isStriped
      isHeaderSticky
      bottomContent={
        !isLoading && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              // showShadow
              // color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )
      }
    >
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Mã học sinh</TableColumn>
        <TableColumn>Họ tên</TableColumn>
        <TableColumn>Lớp</TableColumn>
        <TableColumn></TableColumn>
      </TableHeader>

      <TableBody
        emptyContent={"Không tìm thấy kết quả"}
        loadingContent={<Spinner />}
        isLoading={isLoading}
      >
        {items?.map((el, index) => (
          <TableRow key={el.code}>
            <TableCell>
              {/* <div
                      dangerouslySetInnerHTML={{ __html: el._formatted.code }}
                    /> */}
              {index + 1}
            </TableCell>
            <TableCell>
              {/* <div
                      dangerouslySetInnerHTML={{ __html: el._formatted.code }}
                    /> */}
              {el.code}
            </TableCell>
            <TableCell>
              {/* <div
                dangerouslySetInnerHTML={{
                  __html: `${el._formatted.first_name} ${el._formatted.last_name}`,
                }}
                /> */}
              {`${el.first_name} ${el.last_name}`}
            </TableCell>
            <TableCell>
              {/* <div
                dangerouslySetInnerHTML={{
                  __html: el._formatted.class_name,
                }}
              /> */}
              {el.class_name}
            </TableCell>
            <TableCell>
              <p className="self-center">
                {isRefetching ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    {/* <div className="tooltip" data-tip="Cập nhật">
                      <Link href={`add-update-student/${el.code}`}>
                        <CiCircleMore size={25} />
                      </Link>
                    </div> */}

                    {modal ? (
                      <div
                        className="tooltip cursor-pointer !z-[21]"
                        data-tip={dataTip}
                        onClick={() =>
                          document
                            .getElementById(`modal_${el.code}`)
                            .showModal()
                        }
                      >
                        {children}
                      </div>
                    ) : (
                      <Tooltip content={dataTip} showArrow>
                        <Link
                          className="flex w-fit !z-[21]"
                          href={`${redirect}/${el.code}`}
                        >
                          {children}
                        </Link>
                      </Tooltip>
                    )}
                  </>
                )}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Search;
