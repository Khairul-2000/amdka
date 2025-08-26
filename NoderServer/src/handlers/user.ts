import prisma from "../db"
import { hashPassword, createJWT, comparePassword } from "../modules/auth";


export const createNewUser = async (req, res, next)=>{

    try{

        const user = await prisma.user.create({
            data:{
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: await hashPassword(req.body.password)
            }
        })
        const token = createJWT(user);
        res.json({"accessToken": token, "success":"User created successfully!", "user": user}) 
    } catch(e){
        e.type = 'input'
        next(e)
    }

}

export const signin =  async(req, res)=>{

    const user = await prisma.user.findUnique({
        where:{
            email:req.body.email
        }
    })

    const isValid = await comparePassword(req.body.password, user.password);


    if(!isValid){
        res.status(401)
        res.json({message: 'nope'})
        return
    }

    const token = createJWT(user);
    res.json({"accesstoken": token})



}



export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
       res.status(500).json({ message: "Internal server error" });
    }
};


export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await prisma.user.delete({
            where: { id }
        });
        res.json({
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};