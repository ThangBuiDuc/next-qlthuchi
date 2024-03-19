"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const LogIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState("");

  const { isLoaded, signIn, setActive } = useSignIn();

  async function logIn(e) {
    e.preventDefault();
    setProgress("");
    if (email === "") {
      setProgress("blankEmail");
    } else {
      // var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // Check the sign in response to
      // decide what to do next.
      await signIn
        .create({
          identifier: email,
          password,
        })
        .then(async (result) => {
          if (result.status === "complete") {
            setActive({
              session: result.createdSessionId,
              beforeEmit: () => {
                if (searchParams.get("redirect_url"))
                  router.push(searchParams.get("redirect_url"));
                else router.push("/");
              },
            });
            // router.push("/gateway");
            // return searchParams.get("redirect_url")
            //   ? router.push("/gateway")
            //   : router.push("/");
          }
        })
        .catch((err) => {
          if (email === "") setProgress("blankEmail");
          else setProgress(err.errors[0].message);
        });
    }
  }

  return (
    <div className="flex flex-col p-[20px] gap-[20px] w-[75%] h-full items-center justify-center">
      <h2 style={{ color: "black", textAlign: "center" }}>Đăng nhập</h2>
      <form
        className="flex flex-col gap-[20px] p-[20px] [&>div]:w-[280px] [&>div]:gap-[5px] [&>div]:flex [&>div]:justify-center items-center"
        onSubmit={logIn}
      >
        <div className="flex-col">
          {/* <label>Email hoặc mã sinh viên</label> */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input border-solid border-bordercl text-black"
            placeholder="Email"
          />
          {progress === "blankEmail" ? (
            <p style={{ color: "red", fontSize: "14px" }}>
              Vui lòng nhập email!
            </p>
          ) : progress === "Couldn't find your account." ? (
            <p style={{ color: "red", fontSize: "14px" }}>
              Tài khoản không tồn tại!
            </p>
          ) : (
            <></>
          )}
        </div>
        <div className="flex-col">
          {/* <label htmlFor="password">Mật khẩu</label> */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full input border-solid border-bordercl text-black "
            placeholder="Mật khẩu"
          />
          {progress === "Enter password." && email !== "" ? (
            <p style={{ color: "red", fontSize: "14px" }}>
              Vui lòng nhập mật khẩu!
            </p>
          ) : progress ===
            "Password is incorrect. Try again, or use another method." ? (
            <p style={{ color: "red", fontSize: "14px" }}>
              Mật khẩu không chính xác!
            </p>
          ) : (
            <></>
          )}
        </div>
        <div>
          {!isLoaded ? (
            <button>
              <span className="loading loading-spinner loading-sm bg-primary"></span>
            </button>
          ) : (
            <button className="btn btn-primary text-white">Đăng nhập</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LogIn;
