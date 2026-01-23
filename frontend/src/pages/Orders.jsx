import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])
  
  // --- UX State: Filters & Search ---
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchText, setSearchText] = useState('');

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      
      if (response.data.success) {
        let allOrdersItem = []
        // Flattening the data: 1 Order with 3 Items becomes 3 Order Rows
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse());
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  // --- UX Helper: Dynamic Status Colors ---
  const getStatusColor = (status) => {
    if (status === 'Delivered') return 'bg-green-500';
    if (status === 'Shipped' || status === 'Out for delivery') return 'bg-blue-500';
    if (status === 'Cancelled') return 'bg-red-500';
    return 'bg-green-500'; // Default (Processing/Packing)
  }

  // --- UX Logic: Filtering & Search ---
  const filteredOrders = orderData.filter(item => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className='border-t pt-16 min-h-[80vh]'>
      
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {/* --- UX Section: Search & Filter Tabs --- */}
      <div className='flex flex-col sm:flex-row justify-between gap-4 mb-8'>
        
        {/* Search Input */}
        <div className='w-full sm:w-1/3'>
            <input 
              type="text" 
              placeholder="Search by product name..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black transition-colors'
            />
        </div>

        {/* Filter Buttons */}
        <div className='flex gap-2 overflow-x-auto pb-2 sm:pb-0'>
            {['All', 'Order Placed', 'Shipped', 'Delivered'].map((status) => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 text-sm whitespace-nowrap rounded-full border transition-all ${
                    filterStatus === status 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
            ))}
        </div>
      </div>

      {/* --- Order List --- */}
      <div className='flex flex-col gap-4'>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition-colors p-2'>
                
                {/* Left Side: Product Info */}
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-16 sm:w-20 object-cover rounded shadow-sm' src={item.image[0]} alt="" />
                  <div>
                    <p className='sm:text-base font-semibold text-gray-800'>{item.name}</p>
                    
                    <div className='flex items-center gap-3 mt-1 text-sm text-gray-700'>
                      <p className='font-medium'>{currency}{item.price}</p>
                      <span className='w-px h-4 bg-gray-300'></span>
                      <p>Qty: {item.quantity}</p>
                      <span className='w-px h-4 bg-gray-300'></span>
                      <p>Size: {item.size}</p>
                    </div>

                    <div className='mt-2 text-xs text-gray-500 flex flex-col gap-0.5'>
                        <p>Date: <span className='text-gray-700 font-medium'>{new Date(item.date).toDateString()}</span></p>
                        <p>Payment: <span className='text-gray-700 font-medium uppercase'>{item.paymentMethod}</span></p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Status & Actions */}
                <div className='md:w-1/2 flex justify-between items-center'>
                  
                  {/* Status Indicator */}
                  <div className='flex items-center gap-2'>
                      <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(item.status)} ring-2 ring-gray-100`}></span>
                      <p className='text-sm md:text-base font-medium text-gray-700'>{item.status}</p>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={loadOrderData} 
                    className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm hover:bg-black hover:text-white transition-all duration-300'
                  >
                    Track Order
                  </button>
                </div>

            </div>
          ))
        ) : (
          <div className='text-center py-16 bg-gray-50 rounded-lg'>
             <p className='text-gray-500'>No orders found.</p>
             <button onClick={()=>setFilterStatus('All')} className='text-blue-600 text-sm mt-2 hover:underline'>View all orders</button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Orders





// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import Title from '../components/Title';
// import Cart from './Cart';
// import CartTotal from '../components/cartTotal';
// import { assets } from '../assets/assets';
// import { useState } from 'react';
// import { useEffect } from 'react';
// import axios from 'axios';

// const Orders = () => {

//   const {backendUrl,token, currency} = useContext(ShopContext);

//   const [orderData, setorderData] = useState([])

//   const loadOrderData = async () => {
//       try {
//         if (!token) {
//           return null
//         }

//         const response = await axios.post(backendUrl + '/api/order/userorders', {}, {headers:{token}})
//         // console.log(response.data);
//         if (response.data.success) {
//           let allOrdersItem = []
//           response.data.orders.map((order)=>{
//             order.items.map((item)=>{
//                 item['status'] = order.status
//                 item['payment'] = order.payment
//                 item['paymentMethod'] = order.paymentMethod
//                 item['date'] = order.date

//                 allOrdersItem.push(item)

//             })
//           })
//           setorderData(allOrdersItem.reverse());
          
//         }
        

//       } catch (error) {
//         console.log(error);
//       }
//   }

//   useEffect(()=>{
//     loadOrderData()
//   },[token])


//   return (
//     <div className='border-t pt-16'>
//       <div className='text-2xl'>
//         <Title text1={'MY'} text2={'ORDERS'}/>
//       </div>

//       <div>
//         {
//           orderData.map((item, index)=>(
//             <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
//                 <div className='flex items-start gap-6 text-sm'>
//                   <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
//                   <div>
//                     <p className='sm:text-base font-medium'>{item.name}</p>
//                     <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
//                       <p >{currency}{item.price}</p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Size: {item.size}</p>
//                     </div>
//                     <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
//                     <p className='mt-2'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
//                   </div>
//                 </div>

//                 <div className='md:w-1/2 flex justify-between'>
//                   <div className='flex items-center gap-2'>
//                       <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
//                       <p className='text-sm md:text-base'>{item.status}</p>
//                   </div>
//                   <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
//                 </div>

//             </div>
//           ))
//         }
//       </div>

//     </div>
//   )
// }

// export default Orders
