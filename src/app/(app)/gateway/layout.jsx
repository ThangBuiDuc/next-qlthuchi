import Image from "next/image";
import dynamic from "next/dynamic";
import { currentUser } from "@clerk/nextjs";
import SignOutBtn from "./signOutBtn";
const Clock = dynamic(() => import("./clock"), { ssr: false });

const Layout = async ({ children }) => {
  const user = await currentUser();
  return (
    <div className="flex h-screen">
      <div className="w-[25%] flex flex-col border-r h-full ">
        <div className="h-[35%] relative ">
          <Image
            src={"/default_logo.png"}
            alt="logo HNS"
            fill={true}
            priority
            // style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="bg-[#134a9abf] flex-col h-[65%] flex justify-center items-center text-white">
          <p className=" text-white text-lg font-semibold">XIN CHÀO!</p>
          <p className=" text-white text-2xl font-semibold">
            {user.publicMetadata.full_name}
          </p>
          <Clock />
          <SignOutBtn />
        </div>
      </div>
      <div className="w-[75%] p-20 flex justify-center">{children}</div>
    </div>
  );
};

export default Layout;
