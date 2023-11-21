"use client";
import TextInput from "@/app/_component/textInput";
import { useState } from "react";

export default function Page() {
  const [code, setCode] = useState("HI8JG8GGD");
  const [name, setName] = useState(
    "Trường đại học Quản lý và Công nghệ Hải Phòng"
  );
  const [address, setAddress] = useState(
    "Số 36, đường Dân lập, phường Dư Hàng Kênh, quận Lê Chân, thành phố Hải Phòng"
  );
  const [contact, setContact] = useState("0936 821 821");
  const [taxCode, setTaxCode] = useState("HHHHHHHHHHHHHHHHH");
  const [bankAccNum, setBankAccNum] = useState("0972383668799");

  return (
    <div className="grid grid-cols-1 gap-[25px]">
      <div className="grid grid-cols-2 grid-rows-2 gap-[25px]">
        <TextInput
          id={"school_name"}
          className="w-[80%]"
          label={"Tên trường"}
          value={name}
          isRequire={false}
          action={setName}
        />
        <TextInput
          id={"school_code"}
          className="w-[80%]"
          label={"Mã trường"}
          value={code}
          isRequire={false}
          action={setCode}
        />
        <TextInput
          id={"tax_code"}
          className="w-[80%]"
          label={"Mã số thuế"}
          value={taxCode}
          isRequire={false}
          action={setTaxCode}
        />
        <TextInput
          id={"bank_account_number"}
          className="w-[80%]"
          label={"Mã trường"}
          value={bankAccNum}
          isRequire={false}
          action={setBankAccNum}
        />
      </div>
      <div className="">
        <TextInput
          id={"address"}
          className="w-[80%]"
          label={"Địa chỉ"}
          value={address}
          isRequire={false}
          action={setAddress}
        />
      </div>
      <div className="">
        <TextInput
          id={"contact"}
          className="w-[80%]"
          label={"Liên hệ"}
          value={contact}
          isRequire={false}
          action={setContact}
        />
      </div>
    </div>
  );
}
