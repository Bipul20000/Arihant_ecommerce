import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      {/* Title Section */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Main Content */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 md:gap-20 mb-28 max-w-7xl mx-auto px-4'>
        
        {/* Left Side: Image */}
        <div className='w-full md:max-w-[480px]'>
             {/* Added rounded corners and shadow for a polished look */}
            <img className='w-full h-full object-cover rounded-sm shadow-md' src={assets.contact_img} alt="Arihant Store" />
        </div>

        {/* Right Side: Information */}
        <div className='flex flex-col justify-center items-start gap-8'>
            
            {/* Store Information Section */}
            <div>
                <h3 className='font-semibold text-2xl text-gray-800 mb-6'>Our Store</h3>
                
                <div className='flex flex-col gap-6 text-gray-600'>
                    
                    {/* Address with Icon */}
                    <div className='flex items-start gap-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-1 text-gray-800">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <p className='leading-relaxed'>
                            Arihant Lifestyles <br /> 
                            Suite 350, Gandhi Maidan Road, <br />
                            Patna, Bihar - 800001
                        </p>
                    </div>

                    {/* Phone & Email with Icon */}
                    <div className='flex items-start gap-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-1 text-gray-800">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <div className='flex flex-col gap-1'>
                            <p>Tel: +91 63700 67724</p>
                            <p>Email: admin@arihantlifestyle.com</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Divider Line */}
            <hr className='w-full border-gray-200' />

            {/* Careers Section */}
            <div>
                <h3 className='font-semibold text-2xl text-gray-800 mb-4'>Careers at Arihant</h3>
                <p className='text-gray-600 mb-6 max-w-md'>
                    Passionate about fashion and heritage? Join our team and help us bring Bihar's roots to the modern world.
                </p>
                <button className='border border-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg'>
                    Explore Job Openings
                </button>
            </div>

        </div>
      </div>

      <NewsletterBox/>

    </div>
  )
}

export default Contact