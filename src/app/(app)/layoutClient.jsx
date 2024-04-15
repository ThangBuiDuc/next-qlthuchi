"use client";
import "react-datetime/css/react-datetime.css";
import { useState } from "react";
import Header from "@/app/_hardComponents/header";
import SideBar from "@/app/_hardComponents/sidebar/sideBar";
import { sideBarData } from "@/app/_hardComponents/sidebar/sideBarData";
import { usePathname } from "next/navigation";
import { memo } from "react";
import { ToastContainer } from "react-toastify";
import { useParams } from "next/navigation";
import { Scrollbars } from "react-custom-scrollbars-2";
import "react-toastify/dist/ReactToastify.css";
const LayoutClient = ({ children }) => {
  const pathName = usePathname();
  const breadCrumbs = sideBarData.find((item) => pathName.includes(item.path));
  const [isOpen, setIsOpen] = useState(true);
  const params = useParams();

  return (
    <>
      <ToastContainer className={"!z-[100000]"} />
      <div className="flex">
        <SideBar isOpen={isOpen} pathName={pathName} />
        <div
          className={`flex flex-col w-[82%] absolute top-0 bottom-0 right-0 transition-all duration-300 ${
            isOpen ? "ml-[18%]" : "!w-[100%]"
          }`}
        >
          {/* <div className="flex flex-col h-[10%] sticky top-0"> */}
          <Header setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="text-sm overflow-y-hidden breadcrumbs h-[5%] pl-[10px] flex items-center border-t-bordercl border-t-[1px] bg-white">
            <ul className="text-[#7D7D7D]">
              {!breadCrumbs ? (
                <li>Trang chủ</li>
              ) : (
                <>
                  <li>{breadCrumbs.title}</li>
                  {breadCrumbs.subNav ? (
                    pathName.includes("refund-ticket") ? (
                      <li>Hoàn trả tiền thừa vé ăn</li>
                    ) : (
                      <li>
                        {
                          breadCrumbs.subNav.find((item) =>
                            pathName.includes(item.path)
                          ).title
                        }
                      </li>
                    )
                  ) : (
                    <></>
                  )}
                  {params?.student_code && <li>{params.student_code}</li>}
                </>
              )}
            </ul>
          </div>
          {/* </div> */}
          {/* <div className="h-[85%]"> */}
          <Scrollbars
            hideTracksWhenNotNeeded
            universal
            // autoHeightMin={"82vh"}
            // autoHeightMax={"82vh"}
            autoHide
            // autoHeight
            style={{ width: "100%", height: "85%" }}
          >
            <div
              className={`bg-white w-full  ${
                pathName.includes("/norm/create") ? "h-full" : "h-fit"
              } p-[10px]`}
            >
              {children}
            </div>
          </Scrollbars>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default memo(LayoutClient);
