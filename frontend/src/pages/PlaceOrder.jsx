// import React, { useContext, useState } from 'react'
import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:''
  })

  // 👇 NEW: Fetch addresses when page loads
  useEffect(() => {
    if (token) {
        const fetchAddresses = async () => {
            try {
                const response = await axios.post(backendUrl + '/api/user/get-addresses', {}, { headers: { token } });
                if (response.data.success) {
                    setSavedAddresses(response.data.addresses);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAddresses();
    }
  }, [token, backendUrl]);

  // 👇 NEW: Function to fill form when address is clicked
  const handleSelectAddress = (address) => {
    // Exclude the 'id' field so it doesn't mess up the form
    const { id, ...addressData } = address;
    setFormData(addressData);
    toast.success("Address Auto-filled!");
  }

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    
    setFormData(data=>({...data,[name]:value}))

  }

  // --- 1. ADD THIS FUNCTION: Handles Razorpay Popup & Verification ---
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          // Verify Payment on Backend
          const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, {headers:{token}});
          if (data.success) {
            navigate('/orders');
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }
  
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if (cartItems[items][item]>0) {
            const itemInfo = structuredClone(products.find(product => product._id===items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      // console.log(orderItems);
    let orderData = {
    address: formData,
    items: orderItems,
    amount: getCartAmount() + delivery_fee
}

switch (method) {

    // API Calls for COD
    case 'cod':
        const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: { token } })
        console.log(response.data);
        
        if (response.data.success) {
            setCartItems({})
            navigate('/orders')
        } else{
          toast.error(response.data.message)
        }
        break;



    case 'stripe':
        const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData,{headers:{token}});
        if (responseStripe.data.success) {
          const{ session_url } = responseStripe.data
          window.location.replace(session_url)
        } else{
          toast.error(responseStripe.data.message)
        }

        break;

    case 'razorpay':
            const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}});
            if (responseRazorpay.data.success) {
              initPay(responseRazorpay.data.order); // Open the popup
            }else{
          toast.error(responseRazorpay.data.message)
        }
            break;



    default:
        break;
}
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'}/>
          </div>
          {/* --- SAVED ADDRESS SELECTOR START --- */}
            {savedAddresses.length > 0 && (
                <div className='mb-3'>
                    <p className='text-sm font-medium text-gray-500 mb-2'>Select from saved addresses:</p>
                    <div className='flex gap-3 overflow-x-auto pb-2 no-scrollbar'>
                        {savedAddresses.map((addr, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleSelectAddress(addr)}
                                className='min-w-[150px] border p-3 rounded-md cursor-pointer hover:border-black hover:bg-gray-50 transition-colors flex-shrink-0'
                            >
                                <p className='font-bold text-sm'>{addr.firstName} {addr.lastName}</p>
                                <p className='text-xs truncate text-gray-600'>{addr.street}</p>
                                <p className='text-xs text-gray-500'>{addr.city}, {addr.state}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* --- SAVED ADDRESS SELECTOR END --- */}

            <div className='flex gap-3'>
                <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name'/>
                <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name'/>
            </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email Address'/>
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street Address'/>
            <div className='flex gap-3'>
                <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City'/>
                <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State'/>
            </div>
            <div className='flex gap-3'>
                <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Pin Code'/>
                <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country'/>
            </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='+91 Phone'/>
      </div>

      {/* right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal/>
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          <div className='flex gap-3 flex-col lg:flex-row'>
              {/* pay methods */}
              <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                <img className='h-5 mx-4'src={assets.stripe_logo} alt="" />
              </div>
              <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                <img className='h-5 mx-4'src={assets.razorpay_logo} alt="" />
              </div>
              <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                <p className='text-gray-500 text-sm font-medium mx-4' >CASH ON DELIVERY</p>
              </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white text-sm py-3 px-16'>PLACE ORDER</button>
          </div>

        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
