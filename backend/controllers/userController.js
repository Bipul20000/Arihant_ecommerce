import userModel from "../models/userModel.js";
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}


// route for user login
const loginUser = async (req,res) => {
    // res.json({msg:"Login API Working"})
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }

        // 2. Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Password" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// route for user registration
const registerUser = async (req,res) => {
    try {
        
            const {name, email, password} = req.body;

            // check if user already exists
            const exists = await userModel.findOne({email});
            if (exists) {
                return res.json({success:false, message: "User Already exists"})
            }

            // check email format and strong password
            if (!validator.isEmail(email)) {
                return res.json({success:false, message: "Please enter a valid email"})
            }
            if (password.length<8) {
                return res.json({success:false, message: "Please enter a strong password of length more than 8"})
            }

            // hashing user password

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const newUser = new userModel({
                name,
                email,
                password:hashedPassword
            })

            const user = await newUser.save()

            const token = createToken(user._id)
            res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
    // res.json({msg:"Register API Working"})
}

// route for admin login
const adminLogin = async (req,res) => {
    try {
        const {email,password} = req.body
        if (email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true, token})
        }
        else{
            res.json({success:false, message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
    // res.json({msg:"Admin API Working"})
}

// Add a new address
const addAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        // Add unique ID to address for deletion later
        address.id = Date.now().toString(); 
        
        await userModel.findByIdAndUpdate(userId, { 
            $push: { addresses: address } 
        });
        
        res.json({ success: true, message: "Address Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get all addresses
const getAddresses = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({ success: true, addresses: user.addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;
        await userModel.findByIdAndUpdate(userId, {
            $pull: { addresses: { id: addressId } }
        });
        res.json({ success: true, message: "Address Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Profile (Name/Email)
const updateProfile = async (req, res) => {
    try {
        const { userId, name, email } = req.body;
        await userModel.findByIdAndUpdate(userId, { name, email });
        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// export {loginUser, registerUser, adminLogin}
export { loginUser, registerUser, adminLogin, addAddress, getAddresses, deleteAddress, updateProfile }