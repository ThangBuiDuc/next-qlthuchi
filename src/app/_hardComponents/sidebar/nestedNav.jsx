"use client";
import { BiChevronDown } from "react-icons/bi";
import Link from "next/link";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NestedNav = ({ data, setRootData, pathName }) => {
  return (
    <>
      <button
        className={`text-[#000000] font-semibold w-full items-center justify-between flex pl-[25px] pr-[25px] pt-[20px] pb-[20px] hover:bg-[#ECECEC] ${
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
      <AnimatePresence initial={false}>
        {data.isChecked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            // className="overflow-hidden h-[200px]"
          >
            <div
              className={`flex flex-col w-full h-fit ${
                data.isChecked ? "bg-[#ECECEC]" : ""
              }`}
            >
              {data.subNav.map((item, index) => {
                return (
                  <Link
                    key={index}
                    className={` w-full  items-center flex pl-[35px] pt-[20px] pb-[20px]  group ${
                      pathName === item.path
                        ? "bg-[#134a9abf] "
                        : "hover:bg-[#134a9abf]"
                    }`}
                    href={`${item.path}`}
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
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(NestedNav);


