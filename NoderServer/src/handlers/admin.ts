import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";



export const createNewAdmin = async (req, res) => {
    const { email, name, phone, role } = req.body;
    if (!email || !name || !role) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    

    try {
        const newAdmin = await prisma.admin.create({
            data: {
                email,
                name,
                phone,
                password: await hashPassword(req.body.password),
                role
            }
        });
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: "Failed to create admin" });
    }
};



export const adminSignIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { email }
        });


        const isValid = await comparePassword(req.body.password, admin.password);
        
        
        if(!isValid){
            res.status(401)
            res.json({ error: "Invalid email or password" })
            return
            }

            const token = createJWT(admin);

        res.status(200).json({ message: "Admin signed in successfully", "accesstoken": token });
    } catch (error) {
        res.status(500).json({ error: "Failed to sign in admin" });
    }
};


export const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    if (!data.email || !data.name || !data.phone) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const updatedAdmin = await prisma.admin.update({
            where: { id },
            data: data
        });
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: "Failed to update admin" });
    }
};


export const deleteAdmin = async (req, res)=> {

    const {id} = req.params;

    try {

        const admin = await prisma.admin.findUnique({
            where: { id }
        })

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        if (admin.role === "SUPERADMIN") {
            return res.status(403).json({ error: "Cannot delete superadmin" });
        }

        await prisma.admin.delete({
            where: { id }
        });
        res.status(204).send({"message":"Admin deleted successfully"});
    } catch (error) {
        res.status(500).json({ error: "Failed to delete admin" });
    }
}