"use client";

import { useState } from "react";
import Header from "@/app/_hardComponents/header";
import SideBar from "@/app/_hardComponents/sidebar/sideBar";
import { sideBarData } from "@/app/_hardComponents/sidebar/sideBarData";
import { usePathname } from "next/navigation";
import { memo } from "react";
import { ToastContainer } from "react-toastify";

const LayoutClient = ({ children }) => {
  const pathName = usePathname();
  const breadCrumbs = sideBarData.find((item) => pathName.includes(item.path));
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <ToastContainer className={"!z-[100000]"} />
      <div className="flex">
        <SideBar isOpen={isOpen} pathName={pathName} />
        <div
          className={`flex flex-col w-[82%] h-screen transition-all duration-300 ${
            isOpen ? "ml-[18%]" : "!w-[100%]"
          }`}
        >
          <div className="flex flex-col h-[18vh]">
            <Header setIsOpen={setIsOpen} isOpen={isOpen} />
            <div className="text-sm breadcrumbs h-[8vh] pl-[10px] flex items-center border-t-bordercl border-t-[1px]">
              <ul className="text-[#7D7D7D]">
                {!breadCrumbs ? (
                  <li>Trang chủ</li>
                ) : (
                  <>
                    <li>{breadCrumbs.title}</li>
                    {breadCrumbs.subNav ? (
                      <li>
                        {
                          breadCrumbs.subNav.find((item) =>
                            pathName.includes(item.path)
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
          <div className="bg-white w-full min-h-[82vh] p-[10px]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(LayoutClient);
