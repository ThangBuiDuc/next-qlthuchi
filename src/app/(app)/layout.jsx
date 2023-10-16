"use client";

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
        <div className="flex flex-col h-[18vh]">
          <Header setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="text-sm breadcrumbs h-[8vh] pl-[10px] flex items-center border-t-bordercl border-t-[1px]">
            <ul>
              {pathName === "/home" ? (
                <li>Trang chủ</li>
              ) : (
                <>
                  <li>{breadCrumbs.title}</li>
                  {breadCrumbs.subNav ? (
                    <li>
                      {
                        breadCrumbs.subNav.find(
                          (item) => item.path === pathName
                        ).title
                      }
                    </li>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="bg-[#EBEDEF] w-full min-h-[82vh] p-[10px]">
          {children}
        </div>
      </div>
    </div>
  );
}
