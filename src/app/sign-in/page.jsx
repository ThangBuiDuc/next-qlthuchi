import Image from "next/image";
import dynamic from "next/dynamic";
const Clock = dynamic(() => import("./clock"), { ssr: false });
import LogIn from "./logIn";
// import { SignIn } from "@clerk/nextjs";

const Page = () => {
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
          <Clock />
        </div>
      </div>
      <LogIn />
    </div>
    // <>
    //   <p>aa</p>
    //   <SignIn />
    // </>
  );
};

export default Page;
