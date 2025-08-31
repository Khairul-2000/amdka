import prisma from "../db";



export const getProductsSearch = async (req, res)=>{
    try {
        const { query } = req;
        const searchTerm = query.q;

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { product_name: { contains: searchTerm, mode: "insensitive" } },
                    { description: { contains: searchTerm, mode: "insensitive" } },
                    { category: { contains: searchTerm, mode: "insensitive" } },
                ]
            }
        });

        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch products" });
    }
}