import React, { useState } from 'react'
import { assets } from '../assets/assets' // Ensure you have an image to use

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // Your backend logic will go here later
    console.log("Form Submitted"); 
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center w-full'>
      
      {/* Container with Shadow */}
      <div className='bg-white shadow-lg rounded-lg overflow-hidden flex flex-col sm:flex-row w-[90%] sm:max-w-4xl h-auto sm:h-[500px]'>

        {/* LEFT SIDE: Image (Hidden on small screens) */}
        <div className='hidden sm:block w-1/2 relative'>
           {/* Replace assets.about_img with any nice fashion image you have */}
          <img src={assets.about_img} className='w-full h-full object-cover' alt="Login Visual" />
          <div className='absolute inset-0 bg-black/20'></div> {/* Dark overlay for style */}
          <div className='absolute bottom-10 left-10 text-white'>
            <h2 className='text-3xl font-serif font-bold'>Arihant.</h2>
            <p className='text-sm mt-2'>Fashion rooted in tradition.</p>
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className='w-full sm:w-1/2 p-8 sm:p-14 flex flex-col justify-center'>
          
          <div className='flex items-center gap-2 mb-6'>
            <p className='prata-regular text-3xl font-medium'>{currentState}</p>
            <hr className='border-none h-[2px] w-8 bg-gray-800' />
          </div>

          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            
            {/* Name Input - Only shows if Sign Up */}
            {currentState === 'Login' ? '' : (
              <input 
                type="text" 
                className='w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors' 
                placeholder='Full Name' 
                required 
              />
            )}

            <input 
              type="email" 
              className='w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors' 
              placeholder='Email Address' 
              required 
            />
            
            <input 
              type="password" 
              className='w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors' 
              placeholder='Password' 
              required 
            />

            <div className='w-full flex justify-between text-sm mt-1 text-gray-600'>
              <p className='cursor-pointer hover:text-black'>Forgot password?</p>
              {
                currentState === 'Login'
                ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-black font-medium'>Create account</p>
                : <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-black font-medium'>Login Here</p>
              }
            </div>

            <button className='bg-black text-white font-light px-8 py-3 mt-4 active:bg-gray-800 transition-all'>
              {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login