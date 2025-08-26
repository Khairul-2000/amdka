import prisma from '../db'





// Create product
export const createProduct = async (req, res) => {
  try {
    const {
      sl_no,
      product_name,
      description,
      images,
      sizes,
      colors,
      price,
      offer_price,
      affiate_link,
      agent_name,
      category
    } = req.body;

    // Validate required fields
    if (!sl_no || !product_name || !description || !price || !offer_price || !agent_name || !category) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["sl_no", "product_name", "description", "price", "offer_price", "agent_name", "category"]
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        sl_no,
        product_name,
        description,
        images: images || [],
        sizes: sizes || [],
        colors: colors || [],
        price,
        offer_price,
        affiate_link: affiate_link || "",
        agent_name,
        category
      }
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });

  } catch (error) {
    console.error("Error creating product:", error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: "Product with this serial number already exists"
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
}




// Get Products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json({"products": products});
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
};


//Get Products by ID

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id }
    });
    res.json({
      message: "Product deleted successfully",
      product: deletedProduct
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
};