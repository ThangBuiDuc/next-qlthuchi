"use client";
import { AiOutlineSetting } from "react-icons/ai";
import Link from "next/link";

const GateWay = ({ listSchoolData }) => {
  return (
    <>
      {listSchoolData.result
        .sort((a, b) => a.code - b.code)
        .map((item) => (
          <Link
            key={item.id}
            href={`/app/${item.code}`}
            className="cursor-pointer h-full flex flex-col p-2 bg-[#134a9abf] shadow-md border border-bordercl rounded justify-center gap-2"
          >
            <p className="text-white text-center  text-2xl font-semibold">
              {item.school_name}
            </p>
            <p className="text-white text-center text-lg">{item.name}</p>
          </Link>
        ))}
      <Link
        href={`/app/23646`}
        className="cursor-pointer h-full flex flex-col p-2 bg-[#134a9abf] shadow-md border border-bordercl rounded justify-center items-center gap-2"
      >
        <AiOutlineSetting size={80} className="text-white" />
        <p className="text-white text-center  text-2xl font-semibold">
          Hệ thống
        </p>
      </Link>
    </>
  );
};

export default GateWay;
