"use client";
import { useClerk } from "@clerk/nextjs";

const SignOutBtn = () => {
  const { signOut } = useClerk();
  return (
    <button className="w-fit h-fit font-semibold" onClick={() => signOut()}>
      Đăng xuất
    </button>
  );
};

export default SignOutBtn;
