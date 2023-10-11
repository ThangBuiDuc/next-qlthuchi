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
      className={`w-[18%] h-screen flex flex-col fixed transition-all duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-[-100%]"
      }`}
    >
      <div className="flex justify-center h-[80px] border-b-2">
        <Link href="/home" className="self-center">
          <div className="flex gap-[10px]">
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
          </div>
        </Link>
      </div>
      {rootData.map((item) => {
        if (!item.subNav) {
          return (
            <Link
              key={item.id}
              className={`text-[#BDE0EC] w-full h-[8vh] items-center flex pl-[15px]  ${
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
