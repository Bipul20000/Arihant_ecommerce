import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App' // <--- Correct Admin Imports
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState('All'); // For Tabs
  const [searchText, setSearchText] = useState(''); // For Search

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Status Updated")
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  // --- Filter Logic ---
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    // Search by Customer Name or City
    const matchesSearch = 
      (order.address.firstName + " " + order.address.lastName).toLowerCase().includes(searchText.toLowerCase()) ||
      order.address.city.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className='w-full p-4'>
      <h3 className='mb-4 text-2xl font-bold text-gray-800'>Order Management</h3>

      {/* --- Top Bar: Search & Filter --- */}
      <div className='flex flex-col lg:flex-row justify-between gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
        
        {/* Search */}
        <div className='w-full lg:w-1/3'>
          <input 
            type="text" 
            placeholder="Search by Customer Name or City..." 
            value={searchText}
            onChange={(e)=>setSearchText(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Status Tabs */}
        <div className='flex gap-2 overflow-x-auto pb-2 lg:pb-0'>
            {['All', 'Order Placed', 'Packing', 'Shipped', 'Delivered', 'Out for delivery'].map(status => (
              <button 
                key={status}
                onClick={()=>setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  filterStatus === status 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
        </div>
      </div>

      {/* --- Orders List --- */}
      <div className='flex flex-col gap-4'>
        {filteredOrders.length === 0 ? (
           <div className='text-center py-10 text-gray-500'>No orders found.</div>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className='bg-white border border-gray-200 rounded-lg shadow-sm p-5 md:p-6 grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr] gap-6 items-start animate-fade-in'>
              
              {/* 1. Icon & Items */}
              <div className='flex gap-4 md:col-span-2'>
                <div className='p-3 bg-gray-50 rounded-full h-fit'>
                   <img className='w-8' src={assets.parcel_icon} alt="" />
                </div>
                
                <div className='flex-1'>
                  <p className='font-bold text-gray-800 mb-2'>Order Items</p>
                  <div className='flex flex-col gap-2'>
                    {order.items.map((item, idx) => (
                      <div key={idx} className='text-sm text-gray-600 border-l-2 border-gray-200 pl-3'>
                         <span className='font-medium text-black'>{item.name}</span> 
                         <span className='text-gray-500'> x {item.quantity} </span>
                         <span className='bg-gray-100 text-xs px-2 py-0.5 rounded ml-2'>{item.size}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className='mt-4 pt-4 border-t border-gray-100'>
                     <p className='font-bold text-gray-800 mb-1'>Delivery Address</p>
                     <p className='text-sm text-gray-600 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                     <p className='text-xs text-gray-500 mt-1'>{order.address.street}, {order.address.city}</p>
                     <p className='text-xs text-gray-500'>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                     <p className='text-xs text-gray-500 mt-1'>Phone: {order.address.phone}</p>
                  </div>
                </div>
              </div>

              {/* 2. Order Info */}
              <div className='flex flex-col gap-2 text-sm text-gray-600'>
                <p className='font-bold text-gray-800'>Order Info</p>
                <p>Items: <span className='font-medium text-black'>{order.items.length}</span></p>
                <p>Method: <span className='font-medium text-black'>{order.paymentMethod}</span></p>
                <p>Payment: <span className={`font-medium px-2 py-0.5 rounded text-xs ${order.payment ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{ order.payment ? 'Done' : 'Pending' }</span></p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p className='mt-2 text-lg font-bold text-black'>{currency}{order.amount}</p>
              </div>

              {/* 3. Status Action */}
              <div className='flex flex-col gap-2'>
                <p className='font-bold text-gray-800 text-sm'>Order Status</p>
                <select 
                  onChange={(event)=>statusHandler(event, order._id)} 
                  value={order.status} 
                  className={`p-2.5 rounded-md font-semibold text-sm border outline-none cursor-pointer transition-colors ${
                    order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                    order.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                    'bg-gray-50 border-gray-300 text-gray-700'
                  }`}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders