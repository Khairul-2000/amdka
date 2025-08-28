import Router from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, upload } from "./handlers/product";
import { createNewUser, deleteUser, getAllUsers, getUserById, getUserStats, signin } from "./handlers/user";
import { verifyOtp } from "./handlers/auth";
import { adminSignIn, createNewAdmin, deleteAdmin, getAllAdmins, updateAdmin } from "./handlers/admin";
import { protect } from "./modules/auth";



const router = Router()

//Product Related Routes
router.get("/products", getProducts)
router.get("/products/:id", getProductById)


// Admin Panel Routes - with image upload support
router.post("/products", upload.array('images', 10), createProduct)
router.put("/products/:id", upload.array('images', 10), updateProduct)
router.delete("/products/:id", deleteProduct)


// USER Authentication Routes
router.post("/users/signup", createNewUser)
router.post("/users/signin",signin)


// User Management
router.get("/users/stats",protect, getUserStats)
router.get("/users/all",protect, getAllUsers)
router.get("/users/:id", getUserById)
router.delete("/users/:id",protect, deleteUser)


// OTP Verification Route
router.post("/users/verify-otp", verifyOtp);



// Admin Panel Signup
router.post("/admin/signup", createNewAdmin);
router.post("/admin/signin", adminSignIn);
router.put("/admin/:id",protect, updateAdmin);
router.delete("/admin/:id", protect, deleteAdmin);

// Admin Panel
router.get("/admin/all",protect, getAllAdmins);


// // Searching Products routes - support both GET and POST
// router.get("/search", getSearchProducts)   // GET with query parameters


// // add wishlist routes
// router.post("/wishlist", protect)





export default router;
