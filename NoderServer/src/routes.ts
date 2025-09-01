import Router from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, upload } from "./handlers/product";
import { createNewUser, deleteUser, getAllUsers, getUserById, getUserStats, signin, updateUser } from "./handlers/user";
import { verifyOtp } from "./handlers/auth";
import { adminSignIn, createNewAdmin, deleteAdmin, getAllAdmins, updateAdmin, updateSelfProfile } from "./handlers/admin";
import { protect } from "./modules/auth";
import { addToWishlist, getWishlist } from "./handlers/wishlist";
import { getProductsSearch } from "./handlers/search";



const router = Router()

// Auth
router.post("/auth/users/signup", createNewUser);
router.post("/auth/users/signin", signin);
router.post("/auth/admins/signup", protect, createNewAdmin);
router.post("/auth/admins/signin", adminSignIn);

// User
router.get("/users", protect, getAllUsers);
router.get("/users/stats", protect, getUserStats);
router.get("/users/:id", protect, getUserById);
router.put("/users/self", upload.array('image', 1), protect, updateUser);
router.delete("/users/:id", protect, deleteUser);
router.post("/users/verify-otp", verifyOtp);

// Admin
router.get("/admins", protect, getAllAdmins);
router.put("/admins/self", upload.array('image', 1), protect, updateSelfProfile);
router.put("/admins/:id", protect, updateAdmin);
router.delete("/admins/:id", protect, deleteAdmin);

// Products
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", upload.array('images', 10), protect, createProduct);
router.put("/products/:id", upload.array('images', 10), protect, updateProduct);
router.delete("/products/:id", protect, deleteProduct);

// Search
router.get("/search", getProductsSearch);

// Wishlist
router.post("/wishlist/:id", protect, addToWishlist);
router.get("/wishlist", protect, getWishlist);





export default router;
