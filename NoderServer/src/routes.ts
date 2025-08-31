import Router from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, upload } from "./handlers/product";
import { createNewUser, deleteUser, getAllUsers, getUserById, getUserStats, signin, updateUser } from "./handlers/user";
import { verifyOtp } from "./handlers/auth";
import { adminSignIn, createNewAdmin, deleteAdmin, getAllAdmins, updateAdmin, updateSelfProfile } from "./handlers/admin";
import { protect } from "./modules/auth";
import { addToWishlist, getWishlist } from "./handlers/wishlist";
import { getProductsSearch } from "./handlers/search";



const router = Router()

// USER Authentication Routes
router.post("/users/signup", createNewUser)
router.post("/users/signin",signin)

// USER PROFILE UPDATE

router.put("/users/update",upload.array('image', 1), protect, updateUser);


//Product Related Routes
router.get("/products", getProducts)
router.get("/products/:id", getProductById)


// Admin Panel Routes - with image upload support
router.post("/products", upload.array('images', 10),protect, createProduct)
router.put("/products/:id", upload.array('images', 10),protect, updateProduct)

// Delete Products by admin
router.delete("/products/:id", protect, deleteProduct)




// User Management
router.get("/users/stats",protect, getUserStats)
router.get("/users/all",protect, getAllUsers)
router.get("/users/:id",protect, getUserById)
router.delete("/users/:id",protect, deleteUser)


// OTP Verification Route
router.post("/users/verify-otp", verifyOtp);



// Admin Panel Signup
router.post("/admin/signup", protect, createNewAdmin);
router.post("/admin/signin", adminSignIn);
router.put("/admin/:id", protect, updateAdmin);
router.put("/admin/self", upload.array('image', 1), protect, updateSelfProfile);
router.delete("/admin/:id", protect, deleteAdmin);

// Admin Panel
router.get("/admin/all",protect, getAllAdmins);


// Searching Products routes - support both GET and POST
router.get("/search", getProductsSearch)   // GET with query parameters


// add wishlist routes
router.post("/wishlist/:id",protect, addToWishlist);
router.get("/wishlist",protect, getWishlist);





export default router;
