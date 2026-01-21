import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

    const [list, setList] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } })
            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // --- FIXED: Image Upload Handler ---
    const handleImageUpdate = async (id, files) => {
        
        // BUG FIX 1: Stop if user cancels or selects nothing
        if (!files || files.length === 0) return;

        const formData = new FormData();
        formData.append('productId', id);
        
        // BUG FIX 2: Explicitly handle up to 4 images
        // Note: This REPLACES existing images. User must select ALL images they want to show.
        const fileCount = Math.min(files.length, 4);
        
        for (let i = 0; i < fileCount; i++) {
            formData.append(`image${i + 1}`, files[i]);
        }

        try {
            const toastId = toast.loading("Updating images...");
            const response = await axios.post(backendUrl + '/api/product/update-image', formData, { headers: { token } });
            
            if (response.data.success) {
                toast.update(toastId, { render: "Images Updated!", type: "success", isLoading: false, autoClose: 3000 });
                await fetchList(); 
            } else {
                toast.update(toastId, { render: response.data.message, type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const removeProduct = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this product?\n\nThis action cannot be undone.");
        if (isConfirmed) {
            try {
                const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
                if (response.data.success) {
                    toast.success(response.data.message);
                    await fetchList(); 
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    }

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/product/update-details', {
                productId: editingProduct._id,
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                category: editingProduct.category,
                subCategory: editingProduct.subCategory,
                bestseller: String(editingProduct.bestseller),
                sizes: JSON.stringify(editingProduct.sizes)
            }, { headers: { token } });

            if (response.data.success) {
                toast.success("Product Updated!");
                setEditingProduct(null);
                await fetchList(); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
       <div className='font-outfit w-full max-w-[1200px]'>
            <p className='mb-4 font-bold text-2xl text-[#4a3f35]'>All Products List</p>
            
            <div className='flex flex-col gap-3'>
                
                <div className='hidden md:grid grid-cols-[1.5fr_3fr_1fr_1fr_1.5fr] items-center py-3 px-4 border bg-[#e0cba8] text-[#4a3f35] text-sm font-bold uppercase tracking-wider'>
                    <span>Images</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Price</span>
                    <span className='text-center'>Actions</span>
                </div>

                {list.map((item, index) => (
                    <div 
                        key={index} 
                        className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1.5fr_3fr_1fr_1fr_1.5fr] items-center gap-4 py-4 px-4 border border-[#d4c4a8] bg-[#fdfcf5] hover:bg-[#fcf6e9] transition-all'
                    >
                        {/* 1. IMAGES COLUMN */}
                        <div className='flex flex-col gap-2 w-full'>
                            
                            {/* Display Images */}
                            <div className='flex gap-1 flex-wrap'>
                                {item.image && item.image.length > 0 ? (
                                    item.image.map((img, i) => (
                                        <img key={i} className='w-10 h-12 object-cover border border-[#d4c4a8]' src={img} alt="" />
                                    ))
                                ) : (
                                    <p className='text-xs text-gray-400'>No Image</p>
                                )}
                            </div>

                            {/* Upload Button */}
                            <label htmlFor={`upload-${item._id}`} className='cursor-pointer w-fit px-3 py-1 bg-[#fdfcf5] border border-[#d4c4a8] text-[#4a3f35] text-xs font-bold rounded-sm hover:bg-[#e0cba8] transition-colors shadow-sm text-center'>
                                {item.image && item.image.length > 0 ? "Replace Images" : "Add Images"}
                                <input 
                                    id={`upload-${item._id}`} 
                                    type="file" 
                                    hidden 
                                    multiple // Use Ctrl+Click to select multiple
                                    onChange={(e) => handleImageUpdate(item._id, e.target.files)} 
                                />
                            </label>
                            {/* Helper Text */}
                            <p className='text-[10px] text-gray-500 leading-tight'>Select up to 4 files<br/>(Replaces old)</p>
                        </div>
                        
                        <p className='font-medium text-lg text-[#4a3f35] truncate'>{item.name}</p>
                        <p className='text-[#4a3f35]'>{item.category} / {item.subCategory}</p>
                        <p className='font-medium text-[#4a3f35] text-lg'>{currency}{item.price}</p>
                        
                        <div className='flex justify-end md:justify-center gap-2'>
                            <button 
                                onClick={() => setEditingProduct(item)}
                                className='px-3 py-1 text-sm text-[#4a3f35] border border-[#4a3f35] rounded-sm hover:bg-[#e0cba8] transition-all'
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => removeProduct(item._id)} 
                                className='px-3 py-1 text-sm text-[#8a2b2b] border border-[#8a2b2b] rounded-sm hover:bg-[#8a2b2b] hover:text-white transition-all'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal (Same as before) */}
            {editingProduct && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-[#fdfcf5] p-6 rounded shadow-xl w-full max-w-lg border-2 border-[#d4c4a8] max-h-[90vh] overflow-y-auto'>
                        <h2 className='text-xl font-bold text-[#4a3f35] mb-4'>Edit Product</h2>
                        
                        <form onSubmit={handleEditSave} className='flex flex-col gap-3'>
                            <div>
                                <label className='text-xs font-bold text-[#4a3f35]'>Name</label>
                                <input 
                                    value={editingProduct.name} 
                                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                    className='w-full border border-[#d4c4a8] p-2' required 
                                />
                            </div>
                            <div>
                                <label className='text-xs font-bold text-[#4a3f35]'>Description</label>
                                <textarea 
                                    value={editingProduct.description} 
                                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                    className='w-full border border-[#d4c4a8] p-2' required 
                                />
                            </div>
                            <div className='flex gap-4'>
                                <div className='flex-1'>
                                    <label className='text-xs font-bold text-[#4a3f35]'>Price</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.price} 
                                        onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                                        className='w-full border border-[#d4c4a8] p-2' required 
                                    />
                                </div>
                                <div className='flex-1'>
                                    <label className='text-xs font-bold text-[#4a3f35]'>Category</label>
                                    <select 
                                        value={editingProduct.category} 
                                        onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                                        className='w-full border border-[#d4c4a8] p-2'
                                    >
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex gap-2 items-center mt-2'>
                                <input 
                                    type="checkbox" 
                                    checked={editingProduct.bestseller} 
                                    onChange={(e) => setEditingProduct({...editingProduct, bestseller: e.target.checked})}
                                    id="edit-bestseller"
                                />
                                <label htmlFor="edit-bestseller" className='cursor-pointer text-[#4a3f35]'>Bestseller</label>
                            </div>
                            <div className='flex justify-end gap-2 mt-4'>
                                <button type="button" onClick={() => setEditingProduct(null)} className='px-4 py-2 border border-gray-400 text-gray-600 hover:bg-gray-100'>Cancel</button>
                                <button type="submit" className='px-4 py-2 bg-black text-white hover:bg-gray-800'>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default List











// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { backendUrl, currency } from '../App'
// import { toast } from 'react-toastify'

// const List = ({ token }) => {

//     const [list, setList] = useState([])

//     // --- 1. Fetch Data ---
//     const fetchList = async () => {
//         try {
//             const response = await axios.get(backendUrl + '/api/product/list', { headers: { token } })
//             if (response.data.success) {
//                 setList(response.data.products);
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.message);
//         }
//     }

//     // --- 2. Delete Data (Now with Confirmation) ---
//     const removeProduct = async (id) => {
        
//         // 1. The Safety Check
//         // The code stops here until the user clicks "OK" or "Cancel"
//         const isConfirmed = window.confirm("Are you sure you want to delete this product?\n\nThis action cannot be undone.");

//         // 2. Only proceed if they clicked "OK"
//         if (isConfirmed) {
//             try {
//                 const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })
//                 if (response.data.success) {
//                     toast.success(response.data.message);
//                     await fetchList(); 
//                 } else {
//                     toast.error(response.data.message);
//                 }
//             } catch (error) {
//                 console.log(error);
//                 toast.error(error.message);
//             }
//         }
//     }

//     useEffect(() => {
//         fetchList()
//     }, [])

//     // --- Image Upload Handler ---
//     const handleImageUpdate = async (id, files) => {
//         const formData = new FormData();
//         formData.append('productId', id);
        
//         // Map the selected files to image1, image2...
//         Array.from(files).forEach((file, index) => {
//             if (index < 4) {
//                 formData.append(`image${index + 1}`, file);
//             }
//         });

//         try {
//             // Show loading toast (optional but good UX)
//             const toastId = toast.loading("Uploading images...");
            
//             const response = await axios.post(backendUrl + '/api/product/update-image', formData, { headers: { token } });
            
//             if (response.data.success) {
//                 toast.update(toastId, { render: "Images Updated!", type: "success", isLoading: false, autoClose: 3000 });
//                 await fetchList(); // Refresh list to see the new images
//             } else {
//                 toast.update(toastId, { render: response.data.message, type: "error", isLoading: false, autoClose: 3000 });
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     }

//     return (
//        <div className='font-outfit w-full max-w-[1000px]'>
//             <p className='mb-4 font-bold text-2xl text-[#4a3f35]'>All Products List</p>
            
//             <div className='flex flex-col gap-3'>
                
//                 {/* --- Table Header --- */}
//                 <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border bg-[#e0cba8] text-[#4a3f35] text-sm font-bold uppercase tracking-wider'>
//                     <span>Image</span>
//                     <span>Name</span>
//                     <span>Category</span>
//                     <span>Price</span>
//                     <span className='text-center'>Action</span>
//                 </div>

//                 {/* --- Table Body --- */}
//                 {list.map((item, index) => (
//                     <div 
//                         key={index} 
//                         className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-4 py-4 px-4 border border-[#d4c4a8] bg-[#fdfcf5] hover:bg-[#fcf6e9] transition-all'
//                     >
//                         {/* 1. Larger Image for better visibility */}
//                         <div className='relative'>
//                              {item.image && item.image.length > 0 ? (
//                                 <img className='w-16 h-20 object-cover border border-[#d4c4a8]' src={item.image[0]} alt="Product" />
//                             ) : (
//                                 <label htmlFor={`upload-${item._id}`} className='flex flex-col items-center justify-center w-16 h-20 bg-[#fdfcf5] border-2 border-dashed border-[#d4c4a8] cursor-pointer hover:bg-[#f8f0e0]'>
//                                     <span className='text-xs text-center font-bold text-[#4a3f35] leading-tight'>Add<br/>Img</span>
//                                     <input 
//                                         id={`upload-${item._id}`} 
//                                         type="file" 
//                                         hidden 
//                                         multiple
//                                         onChange={(e) => handleImageUpdate(item._id, e.target.files)} 
//                                     />
//                                 </label>
//                             )}
//                         </div>
//                         {/* <img className='w-16 h-20 object-cover border border-[#d4c4a8]' src={item.image[0]} alt="Product" /> */}
                        
//                         {/* 2. Larger, clearer Name text */}
//                         <p className='font-medium text-lg text-[#4a3f35] truncate'>{item.name}</p>
                        
//                         {/* 3. Category */}
//                         <p className='text-[#4a3f35]'>{item.category}</p>
                        
//                         {/* 4. Price */}
//                         <p className='font-medium text-[#4a3f35] text-lg'>
//                             {currency}{item.price}
//                         </p>
                        
//                         {/* 5. "Delete" Button (Replacing the 'X') */}
//                         {/* This is much easier for older people to understand and click */}
//                         <div className='text-right md:text-center'>
//                             <button 
//                                 onClick={() => removeProduct(item._id)} 
//                                 className='px-4 py-1 text-sm text-[#8a2b2b] border border-[#8a2b2b] rounded-sm hover:bg-[#8a2b2b] hover:text-white transition-all duration-300 uppercase tracking-wider'
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}

//             </div>
//         </div>
//     )
// }

// export default List