'use client'
import TextInput from "@/app/component/textInput"
import { useReducer } from "react"

function reducer(state, action) {
    switch (action.type) {
        case "change_code": {
            return {
                ...state,
                school_code: action.payload,
            };
        }

        case "change_name": {
            return {
                ...state,
                school_name: action.payload,
            };
        }

        // case "change_address": {
        //     return {
        //         ...state,
        //         address: action.payload,
        //     };
        // }

        // case "change_contact": {
        //     return {
        //         ...state,
        //         contact: action.payload,
        //     };
        // }
    }
}

export default async function Page() {

    const [infor, dispatchInfor] = useReducer(reducer, {
        school_code: "HI8JG8GGD",
        school_name: "Trường đại học Quản lý và Công nghệ Hải Phòng",
        address: "Số 36, đường Dân lập, phường Dư Hàng Kênh, quận Lê Chân, thành phố Hải Phòng",
        contact: "0936 821 821"
    })

    return (
        <div className="flex-col">
            <div className="grid grid-col-2 gap-[25px]">
                <TextInput
                    label={'Tên trường'}
                    value={infor.school_name}
                    dispatch={dispatchInfor}
                    isRequire={false}
                    action={"change_name"}
                />
                <TextInput
                    label={'Mã trường'}
                    value={infor.school_code}
                    dispatch={dispatchInfor}
                    isRequire={false}
                    action={"change_code"}
                />
            </div>
        </div>
    )
}