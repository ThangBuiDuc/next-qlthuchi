import Link from "next/link";
import { sideBarData } from "./sideBarData";
import NestedNav from "./nestedNav";
import { useState } from "react";
import Image from "next/image";
import { memo } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

const SideBar = ({ isOpen, pathName, code }) => {
  const [rootData, setRootData] = useState(
    sideBarData.map((item) =>
      pathName.includes(item.path)
        ? { ...item, isChecked: true }
        : { ...item, isChecked: false }
    )
  );

  return (
    <div
      className={`w-[18%] border-r-[1px] top-0 bottom-0 left-0 flex flex-col fixed transition-all duration-300 ${
        isOpen ? "" : "translate-x-[-100%]"
      }`}
    >
      {/* <div className=" "> */}
      <Link
        href={`/home`}
        className="flex items-center justify-center h-[10%] gap-[10px]"
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
      <Scrollbars
        style={{ height: "90%", width: "100%" }}
        hideTracksWhenNotNeeded
        autoHide
        universal
      >
        {rootData.map((item) => {
          if (!item.subNav) {
            return (
              <Link
                key={item.id}
                className={` w-full  items-center flex pl-[15px] pr-[25px] pt-[20px] pb-[20px] ${
                  pathName === item.path
                    ? "bg-[#134a9abf] text-white"
                    : "hover:bg-[#134a9abf] hover:text-white"
                }`}
                href={`${item.path}`}
              >
                {item.title}
              </Link>
            );
          }

          return (
            <NestedNav
              key={item.id}
              data={item}
              setRootData={setRootData}
              pathName={pathName}
              code={code}
            />
          );
        })}
      </Scrollbars>
      {/* <div className="flex flex-col h-[90%] overflow-auto"></div> */}
    </div>
  );
};

export default memo(SideBar);
