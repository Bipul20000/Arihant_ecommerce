import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible, setVisible] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems, setShowCart } = useContext(ShopContext);
    
    const profileRef = useRef(null);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        setIsProfileOpen(false)
    }

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileRef]);

    return (
        <div className='flex items-center justify-between py-5 font-medium relative z-50'>

            <Link to='/'><img src={assets.logo} className='w-36' alt="" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>Home</p>
                    <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>Collection</p>
                    <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>About Us</p>
                    <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>Contact</p>
                    <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <img 
                    onClick={() => { setShowSearch(true); navigate('/collection'); }} 
                    src={assets.search_icon} 
                    className='w-5 cursor-pointer' 
                    alt="" 
                />

                {/* --- PROFILE SECTION (Matches Video Design) --- */}
                <div className='relative' ref={profileRef}>
                    <img 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className='w-5 cursor-pointer hover:scale-110 transition-transform' 
                        src={assets.profile_icon} 
                        alt="" 
                    />
                    
                    {/* DROPDOWN CARD */}
                    {isProfileOpen && (
                        <div className='absolute right-0 top-10 w-[280px] bg-white shadow-[0_5px_25px_rgba(0,0,0,0.1)] rounded-xl border border-gray-100 p-5 overflow-hidden transform transition-all duration-200 ease-out'>
                            
                            {/* Header Section */}
                            <div className='mb-4'>
                                <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-2'>Account</p>
                                {token ? (
                                    // Logged In: Show Email
                                    <div className='flex flex-col gap-1'>
                                        <p className='text-sm font-semibold text-gray-800 truncate'>bipul.dtu@gmail.com</p>
                                        <p onClick={logout} className='text-xs text-red-500 hover:text-red-600 cursor-pointer font-medium w-fit'>Log out</p>
                                    </div>
                                ) : (
                                    // Logged Out: Show Sign In Button
                                    <button 
                                        onClick={() => { navigate('/login'); setIsProfileOpen(false); }} 
                                        className='w-full bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors'
                                    >
                                        Sign in
                                    </button>
                                )}
                            </div>

                            {/* Action Grid (Orders & Profile) */}
                            <div className='grid grid-cols-2 gap-3'>
                                {/* Orders Button */}
                                <div 
                                    onClick={() => { navigate('/orders'); setIsProfileOpen(false); }} 
                                    className='flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 p-3 rounded-xl cursor-pointer transition-all duration-200 group'
                                >
                                    {/* SVG Icon for Box/Orders */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
                                    <p className='text-xs font-medium text-gray-600 group-hover:text-black'>Orders</p>
                                </div>

                                {/* Profile Button */}
                                <div 
                                onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                                    className='flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 p-3 rounded-xl cursor-pointer transition-all duration-200 group'
                                >
                                    {/* SVG Icon for User/Profile */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 group-hover:text-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    <p className='text-xs font-medium text-gray-600 group-hover:text-black'>Profile</p>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                <div onClick={() => setShowCart(true)} className='relative cursor-pointer'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-blue-950 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </div>

                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>

            {/* Mobile Sidebar */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} to='/' className='py-2 pl-6 border'>Home</NavLink>
                    <NavLink onClick={() => setVisible(false)} to='/collection' className='py-2 pl-6 border'>Collection</NavLink>
                    <NavLink onClick={() => setVisible(false)} to='/about' className='py-2 pl-6 border'>About Us</NavLink>
                    <NavLink onClick={() => setVisible(false)} to='/contact' className='py-2 pl-6 border'>Contact</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar








// import React, { useContext, useState } from 'react'
// import { assets } from '../assets/assets'
// import { Link, NavLink, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
// import { ShopContext } from '../context/ShopContext';

// const Navbar = () => {

//     const [visible, setVisible] = useState(false);
//     // const {setShowSearch, getCartCount,navigate, token, setToken, setCartItems} = useContext(ShopContext);
//     const {setShowSearch, getCartCount,navigate, token, setToken, setCartItems, setShowCart} = useContext(ShopContext);
//     const logout = ()=>{
//         navigate('/login')
//         localStorage.removeItem('token')
//         setToken('')
//         setCartItems({})
        

//     }
//     // const navigate = useNavigate(); // 2. Initialize the navigate hook

//     return (
//         <div className='flex items-center justify-between py-5 font-medium'>

//             <Link to = '/'><img src={assets.logo} className='w-36' alt="" /></Link>

//             <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
//                 <NavLink to='/' className='flex flex-col items-center gap-1'>
//                     <p>Home</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//                 <NavLink to='/collection' className='flex flex-col items-center gap-1'>
//                     <p>Collection</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//                 <NavLink to='/about' className='flex flex-col items-center gap-1'>
//                     <p>About Us</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//                 <NavLink to='/contact' className='flex flex-col items-center gap-1'>
//                     <p>Contact</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//             </ul>
//             <div className='flex items-center gap-6'>
//                 {/* 3. Update the onClick logic here */}
//                 <img 
//                     onClick={()=> { 
//                         setShowSearch(true); 
//                         navigate('/collection'); 
//                     }} 
//                     src={assets.search_icon} 
//                     className='w-5 cursor-pointer' 
//                     alt="" 
//                 />
                
//                 <div className='group relative'>
//                     {/* <Link to='/login'> */}
//                     <img onClick={()=> token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} />
//                     {/* </Link> */}
//                     {/* drop down */}

//                     {token && 
//                     <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
//                         <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-2xl'>
//                             <p className='cursor-pointer hover:text-black'>My Profile</p>
//                             <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
//                             <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>

//                         </div>
//                     </div>}
                    
//                 </div>
//                 <Link to='/cart' className='relative'>
//                     <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
//                     <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-blue-950 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
//                 </Link>
//                 <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
//             </div>
//             {/* sidebar menu for small screens */}
//             <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
//                 <div className='flex flex-col text-gray-600'>
//                     <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
//                         <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
//                         <p>Back</p>
//                     </div>
//                     <NavLink onClick={()=>setVisible(false)} to='/' className='py-2 pl-6 border'>
//                     Home
//                 </NavLink>
//                 <NavLink onClick={()=>setVisible(false)} to='/collection' className='py-2 pl-6 border'>
//                     Collection
//                 </NavLink>
//                 <NavLink onClick={()=>setVisible(false)} to='/about' className='py-2 pl-6 border'>
//                     About Us
//                 </NavLink>
//                 <NavLink onClick={()=>setVisible(false)} to='/contact' className='py-2 pl-6 border'>
//                     Contact
//                 </NavLink>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default Navbar

// import React, { useContext, useState } from 'react'
// import { assets } from '../assets/assets'
// import { Link, NavLink } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// const Navbar = () => {

//     // Debug line to check if the logo path is correct in the console
//     //   console.log("Logo Path:", assets.logo); 
//     const [visible, setVisible] = useState(false);
//     const {setShowSearch} = useContext(ShopContext);

//     return (
//         <div className='flex items-center justify-between py-5 font-medium'>

//             <Link to = '/'><img src={assets.logo} className='w-36' alt="" /></Link>

//             <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
//                 <NavLink to='/' className='flex flex-col items-center gap-1'>
//                     <p>Home</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//                 <NavLink to='/collection' className='flex flex-col items-center gap-1'>
//                     <p>Collection</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//                 <NavLink to='/about' className='flex flex-col items-center gap-1'>
//                     <p>About Us</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//                 <NavLink to='/contact' className='flex flex-col items-center gap-1'>
//                     <p>Contact</p>
//                     <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' />
//                 </NavLink>
//             </ul>
//             <div className='flex items-center gap-6'>
//                 <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
//                 <div className='group relative'>
//                     <img className='w-5 cursor-pointer' src={assets.profile_icon} />
//                     <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
//                         <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-2xl'>
//                             <p className='cursor-pointer hover:text-black'>My Profile</p>
//                             <p className='cursor-pointer hover:text-black'>Orders</p>
//                             <p className='cursor-pointer hover:text-black'>Logout</p>

//                         </div>
//                     </div>
//                 </div>
//                 <Link to='/cart' className='relative'>
//                     <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
//                     <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-blue-950 text-white aspect-square rounded-full text-[8px]'>69</p>
//                 </Link>
//                 <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
//             </div>
//             {/* sidebar menu for small screens */}
//             <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
//                 <div className='flex flex-col text-gray-600'>
//                     <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
//                         <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
//                         <p>Back</p>
//                     </div>
//                     <NavLink onClick={()=>setVisible(false)} to='/' className='py-2 pl-6 border'>
//                     Home
//                     {/* <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' /> */}
            
//                 </NavLink>
//                 <NavLink onClick={()=>setVisible(false)} to='/collection' className='py-2 pl-6 border'>
//                     Collection
//                     {/* <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' /> */}
            
//                 </NavLink>
//                 <NavLink onClick={()=>setVisible(false)} to='/about' className='py-2 pl-6 border'>
//                     About Us
//                     {/* <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' /> */}
            
//                 </NavLink>
//                 <NavLink onClick={()=>setVisible(false)} to='/contact' className='py-2 pl-6 border'>
//                     Contact
//                     {/* <hr className='w-4/4 border-none h-[1.5px] bg-gray-700 hidden' /> */}
            
//                 </NavLink>
//                 </div>

//             </div>
//         </div>
//     )
// }

// export default Navbar