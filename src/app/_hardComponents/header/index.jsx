'use client'
import Login from './login'
import Image from 'next/image'
import { FcMenu } from 'react-icons/fc';
export default function Index({ setIsOpen }) {
    return(
        <div className="flex items-center border-b-2 h-[9%] w-full justify-between">
            <div className="flex items-center gap-[40px]">
                <FcMenu 
                    size={30} 
                    className="ml-[20px] cursor-pointer"
                    onClick={() => setIsOpen((pre) => !pre)}
                />
                <div className="flex gap-[10px]">
                    <Image src="/logo2.png" alt="" width="70" height="70" className="w-[70px] h-[70px] object-scale-down cursor-pointer"/>
                    <p className="flex flex-col items-center justify-center">
                        <span className='font-semibold text-[#CA2627]'>HUU NGHI</span>
                        <span className='font-semibold text-[#134A9A]'>SCHOOL</span>
                    </p>
                </div>
            </div>
            <div className="mr-[20px]">
                <Login/>
            </div>
        </div>
    );
}