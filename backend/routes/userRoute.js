import express from 'express';
import { 
    loginUser, 
    registerUser, 
    adminLogin, 
    addAddress, 
    getAddresses, 
    deleteAddress, 
    updateProfile 
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js'; // Ensure you import your auth middleware

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

// 👇 ADD THESE NEW ROUTES (Protected by authUser)
userRouter.post('/add-address', authUser, addAddress)
userRouter.post('/get-addresses', authUser, getAddresses)
userRouter.post('/delete-address', authUser, deleteAddress)
userRouter.post('/update-profile', authUser, updateProfile)

export default userRouter;




// import express from 'express';
// import { loginUser,registerUser,adminLogin } from '../controllers/userController.js';

// const userRouter = express.Router();

// userRouter.post('/register', registerUser)
// userRouter.post('/login', loginUser)
// userRouter.post('/admin', adminLogin)

// export default userRouter;
