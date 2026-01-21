// import connectCloudinary from "../config/cloudinary"
import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js"



// function for add product
const addProduct = async (req, res) => {
    try {
        const {name,description, price, category, subCategory, sizes, bestseller} = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item)=> item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )
        

        const productData = {
            name,
            description,
            category,
            price:Number(price),
            subCategory,
            bestseller: bestseller==="true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }
        console.log(productData);

        // adding to database
        const product = new productModel(productData);
        await product.save()
        

        res.json({success:true, message: "Product Added"})
        
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// function for removing prod
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message: "Product Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// func for single prod info
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true, product})
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

// --- NEW: Function for Bulk Upload (CSV) ---
const addBulkProducts = async (req, res) => {
    try {
        const products = req.body.products; // Expects an array of objects from Frontend
        
        // Add timestamp to each product and ensure image array exists
        const productsWithDate = products.map(prod => ({
            ...prod,
            date: Date.now(),
            image: prod.image || [] 
        }));

        await productModel.insertMany(productsWithDate);
        res.json({ success: true, message: `${products.length} Products Added Successfully` });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- NEW: Function to Update Image Only ---
const updateProductImage = async (req, res) => {
    try {
        const { productId } = req.body;
        
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // Update the specific product
        await productModel.findByIdAndUpdate(productId, { image: imagesUrl });

        res.json({ success: true, message: "Images Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- NEW: Update Product Details (Text Only) ---
const updateProductDetails = async (req, res) => {
    try {
        const { productId, name, description, price, category, subCategory, bestseller, sizes } = req.body;

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true", // Convert string to boolean
            sizes: JSON.parse(sizes) // Parse the stringified array
        };

        await productModel.findByIdAndUpdate(productId, updateData);

        res.json({ success: true, message: "Product Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, removeProduct, singleProduct, addBulkProducts, updateProductImage, updateProductDetails }
// export { listProducts, addProduct, removeProduct, singleProduct }