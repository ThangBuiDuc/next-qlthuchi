"use client"

import { useState } from "react";
import Header from "../_hardComponents/header";
import SideBar from "../_hardComponents/sidebar/sideBar";
import { sideBarData } from "../_hardComponents/sidebar/sideBarData";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathName = usePathname();
  const breadCrumbs = sideBarData.find((item) => pathName.includes(item.path));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      <SideBar isOpen={isOpen} />
      <div
        className={`flex flex-col w-[82%] h-screen transition-all duration-300 ${
          isOpen ? "ml-[18%]" : "!w-[100%]"
        }`}
      >
        <Header setIsOpen={setIsOpen} />
        <div className="text-sm breadcrumbs h-[5%] pl-[10px] flex items-center border-t-bordercl border-[1px]">
          <ul>
            {pathName === '/home'?<li>Trang chủ</li>:<><li>{breadCrumbs.title}</li>
            {breadCrumbs.subNav ? (
              <li>
                {
                  breadCrumbs.subNav.find((item) => item.path === pathName)
                    .title
                }
              </li>
            ) : (
              <></>
            )}</>}
          </ul>
        </div>
        <div className="bg-[#EBEDEF] w-full h-[85%]">{children}</div>
      </div>
    </div>
  );
}
