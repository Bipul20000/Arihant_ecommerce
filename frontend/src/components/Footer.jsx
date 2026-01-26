import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
    <div className='mb-5 flex items-center gap-2'>
        
        <img src={assets.logo} className='w-32' alt="Arihant Logo" />
    </div>
    <p className='w-full md:w-2/3 text-gray-600 leading-6'>
      Shree Krishna Market <br />
      Shiv Mandir Chowk, Bada Bazzar, Ktihar<br />
      Bihar - 854105<br />
      <span className='block mt-2 font-medium'>
        contact@arihant.com
      </span>
    </p>
  </div>
        <div>
    <p className='text-xl font-medium mb-5'>COMPANY</p>
    <ul className='flex flex-col gap-1 text-gray-600'>
      <li className='cursor-pointer hover:text-black'>Home</li>
      <li className='cursor-pointer hover:text-black'>About Us</li>
      <li className='cursor-pointer hover:text-black'>Delivery</li>
      <li className='cursor-pointer hover:text-black'>Privacy Policy</li>
    </ul>
  </div>
        <div>
    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
    <ul className='flex flex-col gap-1 text-gray-600'>
      <li>+91-77070-29206</li>
      <li>support@arihant.com</li>
    </ul>
  </div>
  
      </div>
      <div>
    <hr/>
    <p className='py-5 text-sm text-center'>Copyright 2026@ arihantlifestyles.com - All Rights Reserved.</p>
  </div>
    </div>
  )
}

export default Footer
