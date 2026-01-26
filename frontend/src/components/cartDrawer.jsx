import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const CartDrawer = () => {
  const { 
    showCart, setShowCart, cartItems, products, currency, 
    updateQuantity, getCartAmount, navigate, token 
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [noteVisible, setNoteVisible] = useState(false);
  
  // --- CONFIGURATION ---
  const freeShippingThreshold = 1000; // Set your free shipping amount (e.g., ₹1000)

  // Logic to process cart items
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (showCart) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [showCart]);

  // Calculations for Free Shipping Bar
  const totalAmount = getCartAmount();
  const progress = Math.min((totalAmount / freeShippingThreshold) * 100, 100);
  const remainingForFree = freeShippingThreshold - totalAmount;

  // Upsell Products (Simple logic: Show first 4 products not in cart)
  const upsellProducts = products
    .filter(item => !cartItems[item._id])
    .slice(0, 4);

  return (
    <div className={`fixed inset-0 w-full h-full z-50 transition-all duration-500 ${showCart ? 'visible' : 'invisible'}`}>
      
      {/* Overlay */}
      <div onClick={() => setShowCart(false)} className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${showCart ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Drawer Panel */}
      <div className={`absolute top-0 right-0 h-full w-[90%] sm:w-[450px] bg-white shadow-2xl flex flex-col transition-transform duration-500 transform ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* --- 1. HEADER --- */}
        <div className='flex items-center justify-between p-5 border-b'>
            <h2 className='text-xl font-bold uppercase tracking-wide'>Cart ({cartData.length})</h2>
            <img onClick={() => setShowCart(false)} src={assets.cross_icon} className='w-5 cursor-pointer hover:scale-110 transition-transform' alt="Close" />
        </div>

        {/* --- 2. BODY --- */}
        <div className='flex-1 overflow-y-auto'>
            {cartData.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                    <p className='text-2xl font-bold text-gray-800 mb-4'>YOUR CART IS EMPTY</p>
                    <button onClick={() => setShowCart(false)} className='bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors'>
                        Continue Shopping
                    </button>
                    {!token && (
                        <div className='mt-6 pt-6 border-t w-full'>
                            <p className='text-gray-900 font-bold mb-1'>Have an Account?</p>
                            <p className='text-gray-500 text-sm'><span onClick={() => { setShowCart(false); navigate('/login'); }} className='underline cursor-pointer hover:text-black'>Log in</span> to check out faster.</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* --- Free Shipping Progress --- */}
                    <div className='p-5 pb-0'>
                        <div className='bg-gray-100 rounded-full h-2 w-full overflow-hidden mb-2'>
                            <div className='bg-green-500 h-full transition-all duration-1000' style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className='text-xs text-center text-gray-600 font-medium'>
                            {remainingForFree > 0 
                                ? `Spend ${currency}${remainingForFree} more for FREE SHIPPING!` 
                                : "YOUR ORDER WILL BE SHIPPED FOR FREE!"}
                        </p>
                    </div>

                    {/* --- Cart Items --- */}
                    <div className='p-5 flex flex-col gap-6'>
                        {cartData.map((item, index) => {
                            const productData = products.find((product) => product._id === item._id);
                            if (!productData) return null;
                            return (
                                <div key={index} className='flex gap-4'>
                                    <img className='w-24 h-28 object-cover rounded-md border' src={productData.image[0]} alt="" />
                                    <div className='flex-1 flex flex-col justify-between'>
                                        <div>
                                            <div className='flex justify-between items-start'>
                                                <p className='font-bold text-gray-800 truncate w-[180px]'>{productData.name}</p>
                                                <p className='font-bold'>{currency}{productData.price}</p>
                                            </div>
                                            <p className='text-sm text-gray-500 mt-1 uppercase'>{item.size}</p>
                                        </div>
                                        
                                        <div className='flex justify-between items-end'>
                                            {/* Qty Control */}
                                            <div className='flex items-center border border-gray-300 rounded-sm h-8'>
                                                <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className='px-3 text-gray-600 hover:bg-gray-100 h-full'>-</button>
                                                <span className='px-2 text-sm font-medium'>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className='px-3 text-gray-600 hover:bg-gray-100 h-full'>+</button>
                                            </div>
                                            {/* Remove */}
                                            <button onClick={() => updateQuantity(item._id, item.size, 0)} className='text-xs text-gray-500 underline hover:text-red-500'>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* --- Upsell Section ("You May Also Like") --- */}
                    <div className='bg-gray-50 p-5 mt-4'>
                        <h3 className='font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide'>You May Also Like</h3>
                        <div className='flex gap-4 overflow-x-auto no-scrollbar pb-2'>
                            {upsellProducts.map((product) => (
                                <div key={product._id} className='min-w-[120px] bg-white border rounded-md p-2 flex flex-col relative group'>
                                    <img src={product.image[0]} className='w-full h-24 object-cover mb-2' alt="" />
                                    <p className='text-xs font-medium truncate'>{product.name}</p>
                                    <p className='text-xs text-gray-500 mb-2'>{currency}{product.price}</p>
                                    <button 
                                      onClick={() => navigate(`/product/${product._id}`)} // Or implement quick add
                                      className='w-full bg-white border border-black text-black text-[10px] py-1 uppercase font-bold hover:bg-black hover:text-white transition-colors'
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* --- 3. FOOTER --- */}
        {cartData.length > 0 && (
            <div className='p-5 border-t bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]'>
                
                {/* Countdown Timer (Visual Only) */}
                <div className='bg-red-50 border border-red-100 p-2 mb-4 text-center rounded'>
                    <p className='text-xs text-red-600 font-bold uppercase tracking-wider'>Hurry Up! Offers End In:</p>
                    <div className='flex justify-center gap-3 mt-1 text-red-700 font-mono font-bold text-lg'>
                        <span>02</span>:<span>07</span>:<span>55</span>
                    </div>
                </div>

                {/* Subtotal */}
                <div className='flex justify-between items-center mb-2'>
                    <p className='text-gray-600'>Total</p>
                    <p className='text-2xl font-bold'>{currency}{totalAmount}</p>
                </div>
                <p className='text-xs text-gray-400 mb-4'>Taxes and shipping calculated at checkout.</p>

                {/* Order Note */}
                <div className='mb-4'>
                    <div onClick={()=>setNoteVisible(!noteVisible)} className='flex items-center gap-2 cursor-pointer text-gray-600 hover:text-black'>
                        <img src={assets.dropdown_icon} className={`w-3 transition-transform ${noteVisible ? 'rotate-180' : ''}`} alt="" />
                        <span className='text-xs font-medium underline'>Add a Note to Your Order</span>
                    </div>
                    {noteVisible && (
                        <textarea className='w-full border p-2 mt-2 text-sm outline-none resize-none h-20' placeholder='Special instructions for seller...'></textarea>
                    )}
                </div>

                {/* Buttons */}
                <div className='flex gap-3'>
                    <button onClick={() => {setShowCart(false); navigate('/cart')}} className='flex-1 bg-white border border-black text-black py-3 font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors'>
                        View Cart
                    </button>
                    <button onClick={() => {setShowCart(false); navigate('/place-order')}} className='flex-1 bg-black text-white py-3 font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors'>
                        Check Out
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;