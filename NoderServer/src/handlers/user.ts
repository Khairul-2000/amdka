import sendOtpEmail from "../config/emailService";
import prisma from "../db"
import { hashPassword, createJWT, comparePassword } from "../modules/auth";





// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



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
        user.otpCode = generateOTP();
        user.otpExpires = new Date(Date.now() + 10 * 60000); // OTP expires in 10 minutes
        await prisma.user.update({
            where: { id: user.id },
            data: { otpCode: user.otpCode, otpExpires: user.otpExpires }
        });

        // Send OTP email
        const emailSent = await sendOtpEmail(user.email, user.otpCode);
        if (!emailSent) {
        return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }
        res.json({"success":"User created successfully!", "user": user}) 
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





// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const verifiedUsers = await prisma.user.count({
            where: { isVerified: true }
        });
        const usersToday = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        });
        const usersThisWeek = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        res.json({
            total_users: totalUsers,
            verified_users: verifiedUsers,
            unverified_users: totalUsers - verifiedUsers,
            users_today: usersToday,
            users_this_week: usersThisWeek,
            verification_rate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0
        });
    } catch (error) {
        console.error("Error getting user stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};





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




