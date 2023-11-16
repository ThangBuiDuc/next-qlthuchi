import Link from "next/link";
import { sideBarData } from "./sideBarData";
import { useState } from "react";
import Image from "next/image";
import { memo } from "react";
import { stringify } from "postcss";

const SideBar = ({ isOpen, pathName }) => {
  const [rootData, setRootData] = useState(
    sideBarData.map((item) =>
      pathName.includes(item.path)
        ? { ...item, isChecked: true }
        : { ...item, isChecked: false }
    )
  );

  console.log(pathName);
  


  return (
    <div
      className={`w-[18%] border-r-[1px] h-screen flex flex-col fixed transition-all duration-300 ${
        isOpen ? "" : "translate-x-[-100%]"
      }`}
    >
      <Link
        href={`/system`}
        className="flex items-center justify-center h-[10vh] gap-[10px]"
      >
        <Image
          src="/logo2.png"
          alt=""
          width="70"
          height="70"
          className="w-[70px] h-[70px] object-scale-down cursor-pointer"
        />
        <p className="flex flex-col items-center justify-center">
          <span className="font-semibold text-[#CA2627]">HUU NGHI</span>
          <span className="font-semibold text-[#134A9A]">SCHOOL</span>
        </p>
      </Link>
      {rootData.map((item) => {
        console.log(item.path)
        return (
          <Link
            key={item.id}
            className={`text-[#5e5f6e] gap-3 font-medium h-[8vh] items-center flex px-[30px] hover:text-[#2f3037] 
              ${item.path.includes(pathName) && "bg-gray-100"}`}
            href={`/${item.path}`}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </div>
  );
};

export default memo(SideBar);
