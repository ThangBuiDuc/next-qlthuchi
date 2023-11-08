import { AiOutlineSetting } from "react-icons/ai";
import Link from "next/link";
import { getListSchool } from "@/utils/funtionApi";
import GateWay from "./gateway";

const Page = async () => {
  const res = await getListSchool();

  return (
    <div className="grid grid-cols-3 gap-2 justify-center items-center p-2">
      <GateWay listSchoolData={res.data} />
    </div>
  );
};

export default Page;
