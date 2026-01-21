// import React from 'react';
import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { backendUrl } from '../App';
import axios from 'axios'
import { ToastContainer} from 'react-toastify';

const Login = ({setToken}) => {

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const onSubmitHandler = async (e) => {
    try {
        e.preventDefault();
        const response = await axios.post(backendUrl + '/api/user/admin', {email,password})
        // console.log(response);
        if (response.data.success) {
            setToken(response.data.token)
        } else {
            toast.error(response.data.message)
        }
        
        
    } catch (error) {
        console.log(error);
        toast.error(toast.message)
        
    }
}


  return (
    // Main container with a warm cream background
    <div className="min-h-screen flex w-full bg-[#f8f5e8] font-outfit">
      
      {/* --- Left Side: Image Section --- */}
      <div 
        className="hidden md:flex md:w-[65%] items-end justify-start relative overflow-hidden bg-cover bg-center"
        // TODO: Replace 'boutique_bg' with your new boutique interior image name
        style={{ backgroundImage: `url(${assets.login_bg})` }}
      >
        {/* Warm golden-brown overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3d3125]/80 to-[#3d3125]/40 z-0"></div>
        
       {/* Text Container */}
        <div className="relative z-10 p-12 text-left text-[#f8f5e8] w-full">
            
            <h2 className="text-5xl lg:text-7xl font-prata font-bold mb-6 tracking-wide leading-snug text-[#e0cba8]">
                Welcome to <br/> Arihant Lifestyles
            </h2>
            
            <p className="text-lg font-light tracking-wider">
                Log in to manage your curated collection.
            </p>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full md:w-[35%] flex items-center justify-center p-8 md:p-12 lg:p-16 bg-[#f8f5e8] shadow-xl md:shadow-none">
        <div className="w-full max-w-md space-y-8">
          
          {/* --- LOGO & TITLE SECTION --- */}
          <div className="text-center">
            {/* TODO: Replace with your GOLD Arihant Logo */}
            <img 
                src={assets.logo} 
                className="w-32 mx-auto mb-6" 
                alt="Arihant Lifestyles Logo" 
            />

            {/* Dark Brown Title in Serif Font */}
            <h1 className="text-3xl font-prata font-extrabold text-[#4a3f35]">Admin Login</h1>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="mt-8 space-y-6">
            <div className="space-y-5">
                
                {/* Email Input */}
                <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-[#4a3f35] mb-2 tracking-wide">
                        Email Address
                    </label>
                    <input 
                        onChange={(e)=> setEmail(e.target.value)}
                        value={email}
                        id="email-address"
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                        // Cream background, Gold border, Dark brown text
                        className="appearance-none relative block w-full px-4 py-3 border border-[#d4c4a8] bg-[#fdfcf5] placeholder-[#a09384] text-[#4a3f35] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#d4c4a8] focus:border-[#d4c4a8] sm:text-sm transition-all duration-200"
                    />
                </div>
                
                {/* Password Input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#4a3f35] mb-2 tracking-wide">
                        Password
                    </label>
                    <input 
                        onChange={(e)=> setPassword(e.target.value)}
                        value={password}
                        id="password"
                        type="password" 
                        placeholder="Enter your password" 
                        required 
                        // Cream background, Gold border, Dark brown text
                        className="appearance-none relative block w-full px-4 py-3 border border-[#d4c4a8] bg-[#fdfcf5] placeholder-[#a09384] text-[#4a3f35] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#d4c4a8] focus:border-[#d4c4a8] sm:text-sm transition-all duration-200"
                    />
                </div>

            </div>

            {/* Submit Button */}
            <div>
                <button 
                    type="submit" 
                    // Dark brown background with a slightly darker hover effect
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-sm text-[#f8f5e8] bg-[#3d3125] hover:bg-[#2c221a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3d3125] transition-all duration-300 uppercase tracking-widest"
                >
                    Login
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;




// import React from 'react'

// const Login = () => {
//   return (
//     <div>
//       <div>
//         <h1>Admin Panel</h1>
//         <form>
//           <div>
//             <p>Email Address</p>
//             <input type="email" placeholder='your@email.com' required />
//           </div>
//           <div>
//             <p>Password</p>
//             <input type="password" placeholder='Enter your password' required />
//           </div>
//           <button type="submit"> Login </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Login