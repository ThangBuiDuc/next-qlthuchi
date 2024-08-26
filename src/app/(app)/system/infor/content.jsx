"use client";
import TextInput from "@/app/_component/textInput";
import { Spinner } from "@nextui-org/spinner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const Content = ({ user }) => {
  //   console.log(user.result[0]);
  const [pass, setPass] = useState("");
  const [mutating, setMutating] = useState(false);
  const mutation = useMutation({
    mutationFn: async () =>
      await axios({
        url: "/api/clerk",
        method: "patch",
        data: {
          userId: user.result[0].clerk_user_id,
          password: pass,
        },
      }),
    onSuccess: () => {
      setMutating(false);
      setPass("");
      toast.success("Cập nhật mật khẩu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },

    onError: () => {
      setMutating(false);
      toast.error("Cập nhật mật khẩu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-[20px]">
        <TextInput
          disable
          label={"Họ đệm"}
          value={user.result[0].first_name}
          id={"first_name"}
          // className={"w-[70%]"}
        />
        <TextInput
          disable
          label={"Tên"}
          value={user.result[0].last_name}
          id={"last_name"}
          // className={"w-[30%]"}
        />

        <TextInput
          disable
          label={"Giới tính"}
          value={user.result[0].gender.description}
          id={"gender"}
          // className={"w-[30%]"}
        />

        <TextInput
          disable
          label={"Ngày sinh"}
          value={user.result[0].date_of_birth.split("-").reverse().join("-")}
          id={"dob"}
        />

        <TextInput
          disable
          label={"Số điện thoại"}
          value={user.result[0].phone_number}
          id={"phoneNumber"}
        />

        <TextInput
          disable
          label={"Email"}
          value={user.result[0].email}
          id={"add_email"}
        />
        <TextInput
          disable
          label={"Địa chỉ"}
          value={user.result[0].address}
          id={"add_address"}
        />
        <TextInput
          disable
          label={"Tỉnh / Thành phố"}
          value={user.result[0].province.name}
          id={"province"}
        />
        <TextInput
          disable
          label={"Quận huyện"}
          value={user.result[0].district.name}
          id={"district"}
        />
        <TextInput
          disable
          label={"Phường / Xã"}
          value={user.result[0].ward.name}
          id={"ward"}
        />

        <TextInput
          type="password"
          label={"Mật khẩu"}
          value={pass}
          action={setPass}
          id={"pass"}
        />
      </div>
      {mutating ? (
        <Spinner color="primary" />
      ) : (
        <button
          onClick={() => {
            setMutating(true);
            mutation.mutate();
          }}
          disabled={!pass}
          className="btn w-fit self-center"
        >
          Cập nhật mật khẩu
        </button>
      )}
    </div>
  );
};

export default Content;
