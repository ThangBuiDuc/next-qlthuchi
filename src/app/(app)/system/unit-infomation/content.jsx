'use client'
import TextInput from "@/app/component/textInput"
import { useReducer } from "react"

function reducer(state, action) {
    switch (action.type) {
        case "change_code": {
            return {
                ...state,
                code: action.payload,
            };
        }

        case "change_name": {
            return {
                ...state,
                name: action.payload,
            };
        }

        case "change_address": {
            return {
                ...state,
                address: action.payload,
            };
        }

        case "change_contact": {
            return {
                ...state,
                contact: action.payload,
            };
        }

        case "change_taxcode": {
            return {
                ...state,
                taxCode: action.payload,
            };
        }

        case "change_bankaccnum": {
            return {
                ...state,
                bankAccNum: action.payload,
            };
        }

        case "change_lawrepresentative": {
            return {
                ...state,
                lawRepresentative: action.payload,
            };
        }

        case "change_chiefaccountant": {
            return {
                ...state,
                chiefAccountant: action.payload,
            };
        }

    }
}

export default function Content() {

    const [info, setInfo] = useReducer(reducer, {
        code: '',
        name: '',
        address: '',
        contact: '',
        taxCode: '',
        bankAccNum: '',
        lawRepresentative: '',
        chiefAccountant: ''
        // phoneNum: '',
    })

    // const [code, setCode] = useState('HI8JG8GGD');
    // const [name, setName] = useState('Trường đại học Quản lý và Công nghệ Hải Phòng');
    // const [address, setAddress] = useState('Số 36, đường Dân lập, phường Dư Hàng Kênh, quận Lê Chân, thành phố Hải Phòng');
    // const [contact, setContact] = useState('0936 821 821');
    // const [taxCode, setTaxCode] = useState('HHHHHHHHHHHHHHHHH')
    // const [bankAccNum, setBankAccNum] = useState('0972383668799')

    return (
        <div className="grid grid-cols-1 gap-[25px]">
            <div className="grid grid-cols-2 grid-rows-2 gap-[25px]">
                <TextInput
                    id={"school_name"}
                    className="w-[80%]"
                    label={'Tên trường'}
                    value={info.name}
                    isRequire={false}
                    action={'change_name'}
                    dispatch={setInfo}
                />
                <TextInput
                    id={"school_code"}
                    className="w-[80%]"
                    label={'Mã trường'}
                    value={info.code}
                    isRequire={false}
                    action={'change_code'}
                    dispatch={setInfo}
                />
                <TextInput
                    id={"tax_code"}
                    className="w-[80%]"
                    label={'Mã số thuế'}
                    value={info.taxCode}
                    isRequire={false}
                    action={'change_taxcode'}
                    dispatch={setInfo}
                />
                <TextInput
                    id={"bank_account_number"}
                    className="w-[80%]"
                    label={'Số tài khoản ngân hàng'}
                    value={info.bankAccNum}
                    isRequire={false}
                    action={'change_bankaccnum'}
                    dispatch={setInfo}
                />
            </div>
            <div className="">
                <TextInput
                    id={"address"}
                    className="w-[80%]"
                    label={'Địa chỉ'}
                    value={info.address}
                    isRequire={false}
                    action={'change_address'}
                    dispatch={setInfo}
                />
            </div>
            <div className="">
                <TextInput
                    id={"contact"}
                    className="w-[80%]"
                    label={'Liên hệ'}
                    value={info.contact}
                    isRequire={false}
                    action={'change_contact'}
                    dispatch={setInfo}
                />
            </div>
            <div className="grid grid-cols-2 gap-[25px]">
                <TextInput
                    id={"law_representative"}
                    className="w-[80%]"
                    label={'Người đại diện pháp luật'}
                    value={info.lawRepresentative}
                    isRequire={false}
                    action={'change_lawrepresentative'}
                    dispatch={setInfo}
                />
                <TextInput
                    id={"chief_accountant"}
                    className="w-[80%]"
                    label={'Kế toán trưởng'}
                    value={info.chiefAccountant}
                    isRequire={false}
                    action={'change_chiefaccountant'}
                    dispatch={setInfo}
                />
            </div>
        </div>
    )
}