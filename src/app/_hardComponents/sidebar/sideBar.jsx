import Link from "next/link";
import { usePathname } from "next/navigation";
import { sideBarData } from "./sideBarData";
import NestedNav from "./nestedNav";
import { useState } from "react";
import Image from "next/image";

const SideBar = ({ isOpen }) => {
  const pathName = usePathname();
  const [rootData, setRootData] = useState(
    sideBarData.map((item) =>
      pathName.includes(item.path)
        ? { ...item, isChecked: true }
        : { ...item, isChecked: false }
    )
  );
  return (
    <div
      className={`w-[18%] border-r-[1px] h-screen flex flex-col fixed transition-all duration-300 ${
        isOpen ? "" : "translate-x-[-100%]"
      }`}
    >
      {/* <div className=" "> */}
      <Link
        href="/home"
        className="flex items-center justify-center h-[10vh] gap-[10px]"
      >
        {/* <div className="flex "> */}
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
        {/* </div> */}
      </Link>
      {/* </div> */}
      {rootData.map((item) => {
        if (!item.subNav) {
          return (
            <Link
              key={item.id}
              className={`text-[#000000] w-full h-[8vh] items-center flex pl-[15px]  ${
                pathName === item.path ? "bg-[#46546C]" : "hover:bg-[#46546C]"
              }`}
              href={item.path}
            >
              <p>{item.title}</p>
            </Link>
          );
        }

        return (
          <NestedNav key={item.id} data={item} setRootData={setRootData} />
        );
      })}
    </div>
  );
};

export default SideBar;
