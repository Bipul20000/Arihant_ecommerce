import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Title from '../components/Title'

const Profile = () => {
    const { backendUrl, token, navigate } = useContext(ShopContext);
    
    const [userData, setUserData] = useState({ name: '', email: '' });
    const [addresses, setAddresses] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    
    // Address Form State
    const [addrForm, setAddrForm] = useState({
        firstName: '', lastName: '', email: '', street: '',
        city: '', state: '', zipcode: '', country: '', phone: ''
    });

    // Fetch Profile & Addresses
    const fetchData = async () => {
        try {
            // NOTE: You might need a specific endpoint to get user details, 
            // but for now we can rely on what we have or create a getUser API.
            // Assuming you can get addresses:
            const response = await axios.post(backendUrl + '/api/user/get-addresses', {}, { headers: { token } });
            if (response.data.success) {
                setAddresses(response.data.addresses);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [token])

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/user/add-address', { address: addrForm }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setAddresses([...addresses, { ...addrForm, id: Date.now().toString() }]); // Optimistic update
                setIsAddressModalOpen(false);
                setAddrForm({ firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: '' });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleDeleteAddress = async (id) => {
        try {
            const response = await axios.post(backendUrl + '/api/user/delete-address', { addressId: id }, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                setAddresses(addresses.filter(addr => addr.id !== id));
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='border-t pt-14 min-h-[80vh]'>
            <div className='text-2xl mb-8'>
                <Title text1={'MY'} text2={'PROFILE'} />
            </div>

            {/* --- Profile Details --- */}
            <div className='max-w-md bg-gray-50 p-6 rounded-lg mb-10'>
                <div className='flex justify-between items-start'>
                    <div>
                        <p className='text-xs text-gray-500 uppercase font-bold mb-1'>Name</p>
                        <p className='font-medium text-lg text-gray-800 mb-4'>{userData.name || "User"}</p>
                        <p className='text-xs text-gray-500 uppercase font-bold mb-1'>Email</p>
                        <p className='font-medium text-lg text-gray-800'>{userData.email || "email@example.com"}</p>
                    </div>
                    {/* <button onClick={() => setIsEditModalOpen(true)} className='text-xs underline text-gray-600 hover:text-black'>Edit</button> */}
                </div>
            </div>

            {/* --- Address Book --- */}
            <div>
                <div className='flex items-center gap-4 mb-6'>
                    <h3 className='text-xl font-medium'>Saved Addresses</h3>
                    <button onClick={() => setIsAddressModalOpen(true)} className='border border-black px-4 py-2 text-xs font-medium uppercase hover:bg-black hover:text-white transition-all'>+ Add New</button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {addresses.map((addr, index) => (
                        <div key={index} className='border p-5 rounded-lg relative hover:shadow-md transition-shadow'>
                            <p className='font-bold mb-1'>{addr.firstName} {addr.lastName}</p>
                            <p className='text-sm text-gray-600'>{addr.street}</p>
                            <p className='text-sm text-gray-600'>{addr.city}, {addr.state} {addr.zipcode}</p>
                            <p className='text-sm text-gray-600'>{addr.country}</p>
                            <p className='text-sm text-gray-600 mt-2'>{addr.phone}</p>
                            
                            <button 
                                onClick={() => handleDeleteAddress(addr.id)} 
                                className='absolute top-4 right-4 text-xs text-red-500 hover:text-red-700 font-medium'
                            >
                                DELETE
                            </button>
                        </div>
                    ))}
                    {addresses.length === 0 && <p className='text-gray-500 text-sm'>No saved addresses found.</p>}
                </div>
            </div>

            {/* --- Add Address Modal --- */}
            {isAddressModalOpen && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white p-8 rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto'>
                        <h2 className='text-xl font-bold mb-6'>Add New Address</h2>
                        <form onSubmit={handleAddAddress} className='flex flex-col gap-4'>
                            <div className='flex gap-4'>
                                <input required className='border p-2 w-full rounded' placeholder='First Name' onChange={(e) => setAddrForm({...addrForm, firstName: e.target.value})} />
                                <input required className='border p-2 w-full rounded' placeholder='Last Name' onChange={(e) => setAddrForm({...addrForm, lastName: e.target.value})} />
                            </div>
                            <input required className='border p-2 w-full rounded' placeholder='Email' type="email" onChange={(e) => setAddrForm({...addrForm, email: e.target.value})} />
                            <input required className='border p-2 w-full rounded' placeholder='Street Address' onChange={(e) => setAddrForm({...addrForm, street: e.target.value})} />
                            <div className='flex gap-4'>
                                <input required className='border p-2 w-full rounded' placeholder='City' onChange={(e) => setAddrForm({...addrForm, city: e.target.value})} />
                                <input required className='border p-2 w-full rounded' placeholder='State' onChange={(e) => setAddrForm({...addrForm, state: e.target.value})} />
                            </div>
                            <div className='flex gap-4'>
                                <input required className='border p-2 w-full rounded' placeholder='Zipcode' onChange={(e) => setAddrForm({...addrForm, zipcode: e.target.value})} />
                                <input required className='border p-2 w-full rounded' placeholder='Country' onChange={(e) => setAddrForm({...addrForm, country: e.target.value})} />
                            </div>
                            <input required className='border p-2 w-full rounded' placeholder='Phone' type='number' onChange={(e) => setAddrForm({...addrForm, phone: e.target.value})} />
                            
                            <div className='flex gap-4 mt-4'>
                                <button type='button' onClick={() => setIsAddressModalOpen(false)} className='flex-1 border py-3 rounded text-gray-600 hover:bg-gray-50'>Cancel</button>
                                <button type='submit' className='flex-1 bg-black text-white py-3 rounded hover:bg-gray-800'>Save Address</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile