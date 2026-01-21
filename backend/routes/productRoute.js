import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, addBulkProducts, updateProductImage, updateProductDetails } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Existing Routes
productRouter.post('/add', adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',adminAuth,singleProduct);
productRouter.get('/list',adminAuth,listProducts);

// --- NEW ROUTES ---
// 1. Bulk Upload (No images, so no 'upload' middleware needed)
productRouter.post('/add-bulk', adminAuth, addBulkProducts);

// 2. Image Update (Needs 'upload' middleware)
productRouter.post('/update-image', adminAuth, upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), updateProductImage);
// No 'upload' middleware needed here because we are only editing text
productRouter.post('/update-details', adminAuth, updateProductDetails);
export default productRouter;





// import express from 'express'
// import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
// import upload from '../middleware/multer.js';
// import adminAuth from '../middleware/adminAuth.js';

// const productRouter = express.Router();

// productRouter.post('/add', adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
// productRouter.post('/remove',adminAuth,removeProduct);
// productRouter.post('/single',adminAuth,singleProduct);
// productRouter.get('/list',adminAuth,listProducts);

// export default productRouter;