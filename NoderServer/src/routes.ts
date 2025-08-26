import Router from "express"
import { createProduct, deleteProduct, getProductById, getProducts } from "./handlers/product";
import { createNewUser, deleteUser, getAllUsers, getUserById, signin } from "./handlers/user";



const router = Router()

//Product Related Routes
router.post("/products", createProduct)
router.get("/products", getProducts)
router.get("/products/:id", getProductById)
router.delete("/products/:id", deleteProduct)


// USER Related Routes
router.post("/users", createNewUser)
router.post("/users/signin",signin)
router.get("/users", getAllUsers)
router.get("/users/:id", getUserById)
router.delete("/users/:id", deleteUser)

export default router;
