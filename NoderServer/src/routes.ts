import Router from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, upload } from "./handlers/product";
import { createNewUser, deleteUser, getAllUsers, getUserById, signin } from "./handlers/user";
import { verifyOtp } from "./handlers/auth";
import { adminSignIn, createNewAdmin, deleteAdmin, updateAdmin } from "./handlers/admin";



const router = Router()

//Product Related Routes
router.get("/products", getProducts)
router.get("/products/:id", getProductById)


// Admin Panel Routes - with image upload support
router.post("/products", upload.array('images', 10), createProduct)
router.put("/products/:id", upload.array('images', 10), updateProduct)
router.delete("/products/:id", deleteProduct)


// USER Related Routes
router.post("/users", createNewUser)
router.post("/users/signin",signin)
router.get("/users", getAllUsers)
router.get("/users/:id", getUserById)
router.delete("/users/:id", deleteUser)


// OTP Verification Route
router.post("/users/verify-otp", verifyOtp);



// Admin Panel Signup
router.post("/admin/signup", createNewAdmin);
router.post("/admin/signin", adminSignIn);
router.put("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin); // Reusing deleteUser for admin deletion for simplicity



export default router;
