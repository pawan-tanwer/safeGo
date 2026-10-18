import React from 'react'
import { LuCopyright } from "react-icons/lu";

const Footer = () => {
  return (
    <div className='w-full flex justify-around items-center  border-t border-gray-600 p-4 text-gray-400'>
        <h6 className='flex items-center'><LuCopyright/> SafeGo. All rights reserved.</h6>
        <h6>Privacy Policy</h6>
        <h6>Terns & Conditions</h6>
    </div>
  )
}

export default Footer