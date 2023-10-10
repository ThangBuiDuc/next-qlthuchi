// 'use client'

import Image from 'next/image'
import { FcMenu } from 'react-icons/fc';
export default async function Index() {
    return(
        <div className="flex items-center border-b-2 h-[80px] w-[100%]">
            <FcMenu/>
            <div className="flex">
                <Image src="/logo2.png" alt="" width="70" height="70" className="w-[70px] h-[70px] object-scale-down cursor-pointer"/>
                <p className="flex flex-col items-center justify-center">
                    <span>HUU NGHI</span>
                    <span>SCHOOL</span>
                </p>
            </div>
        </div>
    );
}