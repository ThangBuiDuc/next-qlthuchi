'use client'

import React from "react";
import { useState } from "react";
import Image from "next/image";

export default function Index() {

    const [tongle,setTongle] = useState(false);
    const handleTogle = () => {
      setTongle(true);
    }

    return(
        <>
            {tongle ? 
                <>
                  <div>
                    <Image src="/defaultAvt.png" alt="" width={70} height={70}/>
                  </div>
                </> 
                : 
                <>
                  <button 
                    className="btn btn-sm" 
                    onClick={handleTogle}
                  >
                    Đăng nhập
                  </button>
                </>
            }
        </>
    );
}