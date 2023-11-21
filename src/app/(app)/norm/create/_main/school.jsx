import Select from "react-select";
import { listContext } from "../content";
import { useContext, useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

const Item = ({ index, norm, setNorm }) => {
  const { listRevenue, caculationUnit } = useContext(listContext);
  const [selected, setSelected] = useState({ gruop: null, type: null });
  console.log(caculationUnit);

  useEffect(() => {
    if (selected.gruop) setSelected((pre) => ({ ...pre, type: null }));
  }, [selected.gruop]);
  return (
    <div className="flex flex-col gap-4">
      {index !== 0 && <hr width="50%" className="self-center text-black" />}
      <div className="flex gap-2 justify-around">
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Nhóm khoản thu"
          options={listRevenue.revenue_group
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          value={selected.gruop}
          onChange={(e) => {
            if (selected.gruop?.value !== e.value)
              setSelected((pre) => ({ ...pre, gruop: e }));
          }}
          className="text-black text-sm"
          classNames={{
            control: () => "!rounded-[5px]",
            input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
        />
        {selected.gruop && (
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Loại khoản thu"
            options={listRevenue.revenue_group
              .find((item) => item.id === selected.gruop.value)
              .revenue_types.sort((a, b) => a.id - b.id)
              .map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            value={selected.type}
            onChange={(e) => setSelected((pre) => ({ ...pre, type: e }))}
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
          />
        )}
        {selected.type && (
          <>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Đơn vị tính"
              options={caculationUnit.caculation_units.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={norm.caculation_unit}
              onChange={(e) =>
                setNorm((pre) =>
                  pre.map((item) =>
                    item.id === norm.id ? { ...item, caculation_unit: e } : item
                  )
                )
              }
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />
            <div className={`w-[10%] relative `}>
              <input
                dir="rtl"
                autoComplete="off"
                type={"number"}
                id={`quantity_${norm.id}`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Số lượng"
                value={norm.quantity}
                onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                onChange={(e) =>
                  setNorm((pre) =>
                    pre.map((item) =>
                      item.id === norm.id
                        ? { ...item, quantity: e.target.value }
                        : item
                    )
                  )
                }
              />
              <label
                htmlFor={`quantity_${norm.id}`}
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 right-1`}
              >
                Số lượng
              </label>
            </div>
            <div className={`w-[15%] relative `}>
              <input
                dir="rtl"
                autoComplete="off"
                type={"number"}
                id={`price_${norm.id}`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={norm.price}
                onChange={(e) =>
                  setNorm((pre) =>
                    pre.map((item) =>
                      item.id === norm.id
                        ? { ...item, price: e.target.value }
                        : item
                    )
                  )
                }
              />
              <label
                htmlFor={`price_${norm.id}`}
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 right-1`}
              >
                Đơn giá
              </label>
            </div>
            <div className={`w-[15%] relative `}>
              <input
                dir="rtl"
                disabled
                autoComplete="off"
                type={"number"}
                id={`total_${norm.id}`}
                className={`!bg-bordercl cursor-not-allowed block px-2.5 pb-2.5 pt-4 w-full text-sm text-black  rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Tổng tiền"
                value={norm.total}
              />
              <label
                htmlFor={`total_${norm.id}`}
                className={`!cursor-not-allowe absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 right-1`}
              >
                Tổng tiền
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const School = () => {
  const { listSearch } = useContext(listContext);
  const [selected, setSelected] = useState();
  const [norm, setNorm] = useState([]);

  useEffect(() => {
    if (selected) setNorm([]);
  }, [selected]);
  return (
    <>
      <div className="flex gap-1 items-center w-full">
        <h5>Cấp học: </h5>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearch.school_level.map((item) => ({
            ...item,
            value: item.id,
            label: item.name,
          }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
        />
      </div>
      <h5 className="text-center">Định mức thu</h5>
      {selected ? (
        norm.length === 0 ? (
          <div
            className="tooltip w-fit self-center cursor-pointer"
            data-tip="Thêm khoản thu"
            onClick={() =>
              setNorm((pre) => [
                ...pre,
                {
                  id: norm.length + 1,
                  revenue: null,
                  caculation_unit: null,
                  price: 0,
                  quantity: 1,
                  total: 0,
                },
              ])
            }
          >
            <CiCirclePlus size={35} />
          </div>
        ) : (
          <>
            {norm.map((item, index) => (
              <Item key={index} index={index} norm={item} setNorm={setNorm} />
            ))}
            <div
              className="tooltip w-fit self-center cursor-pointer"
              data-tip="Thêm khoản thu"
              onClick={() =>
                setNorm((pre) => [
                  ...pre,
                  {
                    id: norm.length + 1,
                    revenue_id: null,
                    price: 0,
                    quantity: 1,
                    total: 0,
                  },
                ])
              }
            >
              <CiCirclePlus size={35} />
            </div>
          </>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default School;
