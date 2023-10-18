'use client'
import TextInput from "@/app/component/textInput"
import { useState } from "react"

export default function Page() {

    const [code, setCode] = useState('HI8JG8GGD');
    const [name, setName] = useState('Trường đại học Quản lý và Công nghệ Hải Phòng');
    const [address, setAddress] = useState('Số 36, đường Dân lập, phường Dư Hàng Kênh, quận Lê Chân, thành phố Hải Phòng');
    const [contact, setContact] = useState('0936 821 821');

    return (
        <div className="grid grid-cols-1 gap-[25px]">
            <div className="grid grid-cols-2 grid-rows-1 gap-[25px]">
                <TextInput
                    className="w-[80%]"
                    label={'Tên trường'}
                    value={name}
                    isRequire={false}
                    action={setName}
                />
                <TextInput
                    className="w-[80%]"
                    label={'Mã trường'}
                    value={code}
                    isRequire={false}
                    action={setCode}
                />
            </div>
            <div className="">
                <TextInput
                    className="w-[80%]"
                    label={'Địa chỉ'}
                    value={address}
                    isRequire={false}
                    action={setAddress}
                />
            </div>
            <div className="">
                <TextInput
                    className="w-[80%]"
                    label={'Liên hệ'}
                    value={contact}
                    isRequire={false}
                    action={setContact}
                />
            </div>
        </div>
    )
}