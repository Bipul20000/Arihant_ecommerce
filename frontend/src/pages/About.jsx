import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
         <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
         <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Arihant was born from a passion to bridge the gap between India's rich textile heritage and the modern lifestyle. We believe that fashion is a language, and ours speaks of the timeless elegance found in the roots of Bihar. Our journey began with a simple vision: to curate clothing that honors traditional craftsmanship while embracing contemporary silhouettes. Every piece we create is a tribute to the artisans who weave stories into fabric, ensuring that you carry a piece of culture wherever you go.</p>
          <p>Beyond just aesthetics, we are committed to uncompromising quality and comfort. We meticulously source the finest fabrics—from breathable cottons to hand-loomed textures—to ensure that our collections feel as good as they look. Whether you are dressing for a festive occasion or seeking everyday elegance, Arihant promises a seamless blend of style and substance. We invite you to explore our world, where every garment is designed with love, rooted in tradition, and crafted for the global citizen.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p> Whether you are dressing for a festive occasion or seeking everyday elegance, Arihant promises a seamless blend of style and substance. We invite you to explore our world, where every garment is designed with love, rooted in tradition, and crafted for the global citizen.</p>
         </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOS US'}/>
      </div>


      <div className='flex flex-col md:flex-row gap-8 mb-20 px-4'>
  
  <div className='flex-1 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 p-10 flex flex-col items-center text-center gap-5 rounded-lg'>
     <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <b className='text-lg text-gray-800'>Quality Assurance</b>
    <p className='text-gray-600 text-sm leading-6'>Meticulously crafted with premium materials to ensure lasting elegance and comfort.</p>
  </div>

  <div className='flex-1 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 p-10 flex flex-col items-center text-center gap-5 rounded-lg'>
    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
    <b className='text-lg text-gray-800'>Convenience</b>
    <p className='text-gray-600 text-sm leading-6'>Seamless shopping experience with fast delivery and an easy exchange policy.</p>
  </div>

  <div className='flex-1 bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 p-10 flex flex-col items-center text-center gap-5 rounded-lg'>
    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <b className='text-lg text-gray-800'>Customer Service</b>
    <p className='text-gray-600 text-sm leading-6'>Our dedicated support team is available 24/7 to assist you with any queries.</p>
  </div>

</div>

<NewsletterBox/>


      {/* <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assuarance:</b>
          <p className='text-gray-600'>Whether you are dressing for a festive occasion or seeking everyday elegance, Arihant promises a seamless blend of style and substance. We invite you to explore our world, where every garment is designed with love, rooted in tradition, and crafted for the global citizen.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convinience:</b>
          <p className='text-gray-600'>Whether you are dressing for a festive occasion or seeking everyday elegance, Arihant promises a seamless blend of style and substance. We invite you to explore our world, where every garment is designed with love, rooted in tradition, and crafted for the global citizen.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Whether you are dressing for a festive occasion or seeking everyday elegance, Arihant promises a seamless blend of style and substance. We invite you to explore our world, where every garment is designed with love, rooted in tradition, and crafted for the global citizen.</p>
        </div>

      </div> */}

    </div>
  )
}

export default About
