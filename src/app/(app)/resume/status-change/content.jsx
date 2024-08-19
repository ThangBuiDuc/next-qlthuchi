"use client";
import {
  meilisearchGetToken,
  meilisearchStudentsGet,
} from "@/utils/funtionApi";
// import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import Select from "react-select";
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
// import Select from "react-select";

const TableView = ({
  listStudent,
  isLoading,
  config,
  selectedKeys,
  setSelectedKeys,
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = Number(config?.result[0].config.page.value);

  const pages = Math.ceil(listStudent?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return listStudent?.slice(start, end);
  }, [page, listStudent]);

  useEffect(() => {
    setPage(1);
  }, [listStudent]);

  return (
    <Table
      aria-label="listStudent table"
      selectionMode="multiple"
      className="max-h-[450px]"
      // removeWrapper
      isStriped
      isHeaderSticky
      color="primary"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      bottomContent={
        !isLoading &&
        items && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              // showShadow
              color="primary"
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
        <TableColumn>Họ và tên</TableColumn>
        <TableColumn>Ngày sinh</TableColumn>
        <TableColumn>Trạng thái</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Không tìm thấy kết quả tìm kiếm!"
        loadingContent={<Spinner color="primary" />}
        isLoading={isLoading}
      >
        {items?.map((item, index) => {
          return (
            <TableRow key={item.student_code}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.student_code}</TableCell>
              <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
              <TableCell>
                {item.date_of_birth.split("-").reverse().join("-")}
              </TableCell>
              <TableCell
                className={`${
                  item.status_id === 1 || item.status_id === 8
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {item.status_name}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const Content = ({ listSearch, present, config, catalogStudent }) => {
  // console.log(config);
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selected, setSelected] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState();
  const [mutating, setMutating] = useState(false);
  // console.log(selectedKeys === "all");
  // const { getToken } = useAuth();
  const {
    data: listStudent,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: async () =>
      meilisearchStudentsGet(
        await meilisearchGetToken(),
        `class_name = ${selected.value} AND year_active=true`
      ),
    queryKey: ["status-change", selected],
    enabled: selected ? true : false,
  });

  useEffect(() => {
    setSelectedKeys(new Set([]));
  }, [selected]);

  useCallback(() => {}, [selectedKeys]);

  // console.log(listStudent);

  // console.log(selectedKeys);
  // console.log(listStudent);

  return (
    <div className="flex flex-col gap-5 justify-center">
      <div className={`justify-center items-center flex gap-1 `}>
        <h6>
          Học kỳ {selectPresent.batch} - Năm học {present.result[0].school_year}
        </h6>
      </div>
      <div className={`w-[50%] flex flex-col gap-1`}>
        <p className="text-xs font-semibold">Lớp:</p>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Lớp!"
          isClearable
          options={listSearch.classes
            .sort(
              (a, b) =>
                a.class_level_code - b.class_level_code ||
                a.code.localeCompare(b.code)
            )
            .map((item) => ({
              ...item,
              value: item.name,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => setSelected(e)}
          className="text-black w-full"
          classNames={{
            // control: () => "!rounded-[5px]",
            // input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            // valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[21]",
          }}
        />
      </div>

      <TableView
        listStudent={listStudent}
        isLoading={isFetching && isLoading}
        config={config}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />

      <div className="flex justify-center gap-2 items-center">
        <Select
          isDisabled={selectedKeys.size === 0}
          placeholder="Trạng thái"
          className="text-black text-sm"
          classNames={{
            control: () => "!rounded-[5px]",
            input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
          options={catalogStudent.status.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          value={selectedStatus}
          onChange={setSelectedStatus}
        />
        <button
          disabled={selectedKeys.size === 0 || !selectedStatus}
          className="btn w-fit"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
};

export default Content;
