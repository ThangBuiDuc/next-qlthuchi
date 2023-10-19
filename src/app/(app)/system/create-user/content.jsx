'use client'
import TextInput from "@/app/component/textInput";
import { useReducer } from "react";

// const render = [
//     { value: 1, lable: 'Lưu' },
//     { value: 2, lable: 'Thanh' },
//     { value: 3, lable: 'Hoàng' },
// ]

const reducer = (state, action) => {
    switch (action.type) {

        case "change_username": {
            return {
                ...state,
                username: action.payload,
            }
        }

        case "change_password": {
            return {
                ...state,
                password: action.payload,
            }
        }

        case "change_email": {
            return {
                ...state,
                email: action.payload,
            }
        }

        case "change_firstname": {
            return {
                ...state,
                firstName: action.payload,
            }
        }

        case "change_lastname": {
            return {
                ...state,
                lastName: action.payload,
            }
        }

        case "change_address": {
            return {
                ...state,
                address: action.payload,
            }
        }

        case "change_phonenumber": {
            return {
                ...state,
                phoneNum: action.payload,
            }
        }

        case "change_role": {
            return {
                ...state,
                role: action.payload,
            }
        }

    }
}

const Content = () => {

    const [info, setInfo] = useReducer(reducer, {
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        phoneNum: '',
        role: ''
    })

    return (
        <div className="grid grid-cols-2 gap-[25px]">
            <TextInput
                id={"username"}
                className="w-[80%]"
                label={'Tài khoản'}
                value={info.username}
                isRequire={true}
                action={'change_username'}
                dispatch={setInfo}
            />
            <TextInput
                id={"email"}
                className="w-[80%]"
                label={'E-mail'}
                value={info.email}
                isRequire={true}
                action={'change_email'}
                dispatch={setInfo}
            />
            <TextInput
                id={"firstname"}
                className="w-[80%]"
                label={'Họ'}
                value={info.firstName}
                isRequire={true}
                action={'change_firstname'}
                dispatch={setInfo}
            />
            <TextInput
                id={"lastname"}
                className="w-[80%]"
                label={'Tên'}
                value={info.lastName}
                isRequire={true}
                action={'change_lastname'}
                dispatch={setInfo}
            />
            <TextInput
                id={"address"}
                className="w-[80%]"
                label={'Địa chỉ'}
                value={info.address}
                isRequire={false}
                action={'change_address'}
                dispatch={setInfo}
            />
            <TextInput
                id={"username"}
                className="w-[80%]"
                label={'Tài khoản'}
                value={info.username}
                isRequire={true}
                action={'change_username'}
                dispatch={setInfo}
            />
            <TextInput
                id={"username"}
                className="w-[80%]"
                label={'Tài khoản'}
                value={info.username}
                isRequire={true}
                action={'change_username'}
                dispatch={setInfo}
            />
            <TextInput
                id={"username"}
                className="w-[80%]"
                label={'Tài khoản'}
                value={info.username}
                isRequire={true}
                action={'change_username'}
                dispatch={setInfo}
            />
            <TextInput
                id={"username"}
                className="w-[80%]"
                label={'Tài khoản'}
                value={info.username}
                isRequire={true}
                action={'change_username'}
                dispatch={setInfo}
            />
        </div>
    )
}

export default Content;