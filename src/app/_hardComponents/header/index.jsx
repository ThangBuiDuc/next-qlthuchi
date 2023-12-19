"use client";
import Image from "next/image";
import { FcMenu } from "react-icons/fc";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    
    <button
      onClick={() =>
        signOut(() =>
          router.push(
            "/sign-in"
          )
        )
      }
    >
      Đăng xuất
    </button>
  );
};

export default function Index({ setIsOpen, isOpen }) {
  return (
    <div className="flex items-center h-[10vh] w-full justify-between p-[10px]">
      <div className="flex items-center gap-[20px]">
        <FcMenu
          size={30}
          className=" cursor-pointer"
          onClick={() => setIsOpen((pre) => !pre)}
        />
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link className="flex gap-[10px]" href='/home'>
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
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <SignOutButton />
      </div>
    </div>
  );
}
