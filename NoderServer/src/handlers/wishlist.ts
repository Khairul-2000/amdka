import prisma from "../db";

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const wishlistEntry = await prisma.wishlist.upsert({
            where: {
                userId_productId: { userId, productId }
            },
            update: {}, // No updates needed if it exists
            create: { userId, productId }
        });
            
        res.status(201).json({ 
            message: "Product added to wishlist", 
            data: wishlistEntry 
        });
    } catch (error) {
        res.status(500).json({ error: "Could not add to wishlist" });
    }
};


export const getWishlist = async (req, res)=>{
    try{
        const userId = req.user.id;

        const wishlistItems = await prisma.wishlist.findMany({
            where: { userId },
            include: { product: true } // Include product details
        });

        res.status(200).json({ data: wishlistItems });
    }catch(error){
        res.status(500).json({ error: "Could not fetch wishlist" });
    }
}


