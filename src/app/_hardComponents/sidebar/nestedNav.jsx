"use client";
import { BiChevronDown } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import useMeasure from "react-use-measure";
import { motion } from "framer-motion";

const NestedNav = ({ data, setRootData }) => {
  const pathName = usePathname();
  const [ref, { height }] = useMeasure();

  return (
    <>
      <button
        className={`text-[#000000] font-semibold w-full h-[8vh] items-center justify-between flex pl-[25px] pr-[25px] hover:bg-[#ECECEC] ${
          data.isChecked ? "bg-[#ECECEC] " : ""
        }`}
        onClick={() => {
          setRootData((pre) =>
            pre.map((item) =>
              data.id === item.id
                ? { ...item, isChecked: item.isChecked ? false : true }
                : { ...item, isChecked: false }
            )
          );
        }}
      >
        <p className="flex gap-[10px] items-center font-medium">
          {data.icon}
          {data.title}
        </p>
        <BiChevronDown
          size={20}
          color="#7D7D7D"
          className={`float-right !duration-100 transition-all ${
            data.isChecked ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        animate={{ height: data.isChecked ? height : 0 }}
        initial={false}
        className="overflow-hidden"
      >
        <div
          ref={ref}
          className={`flex flex-col w-full ${
            data.isChecked ? "bg-[#ECECEC]" : ""
          }`}
        >
          {data.subNav.map((item, index) => {
            return (
              <Link
                key={index}
                className={` w-full h-[8vh] items-center flex pl-[15px]  group ${
                  pathName === item.path
                    ? "bg-[#134a9abf] "
                    : "hover:bg-[#134a9abf]"
                }`}
                href={item.path}
              >
                <p
                  className={`${
                    pathName === item.path
                      ? "text-white "
                      : "group-hover:text-white"
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default memo(NestedNav);
