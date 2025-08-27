/**
 * Product Handler Module
 * 
 * This module contains product-related request handlers for the Node.js server.
 * It provides CRUD operations for products with image upload functionality.
 * 
 * Features:
 * - Create products with multiple image uploads
 * - Image storage on server with URL generation
 * - CRUD operations (Create, Read, Update, Delete)
 * - Database integration using Prisma ORM
 * - File upload handling using Multer
 * 
 * Image Upload:
 * - Images are stored in the server's uploads/products directory
 * - Only image URLs are saved in the database
 * - Supports multiple image uploads per product
 * - Generates unique filenames to prevent conflicts
 * 
 * @author Your Name
 * @version 1.0.0
 * @created 2025-08-27
 */

import prisma from '../db';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/products');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer upload configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files per request
  }
});

// Helper function to generate image URLs
const generateImageUrls = (files: Express.Multer.File[], req): string[] => {
  if (!files || files.length === 0) return [];
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return files.map(file => `${baseUrl}/uploads/products/${file.filename}`);
};





// Create product with image upload
export const createProduct = async (req, res) => {
  try {
    const {
      sl_no,
      product_name,
      description,
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

    // Check if sl_no already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sl_no: parseInt(sl_no) }
    });

    if (existingProduct) {
      return res.status(400).json({
        error: "Product with this serial number already exists",
        existing_product_id: existingProduct.id
      });
    }

    // Handle uploaded images
    const uploadedFiles = req.files as Express.Multer.File[];
    const imageUrls = generateImageUrls(uploadedFiles, req);

    // Safely parse arrays from form data
    let parsedSizes = [];
    let parsedColors = [];

    try {
      if (sizes) {
        if (typeof sizes === 'string') {
          // Handle different formats: "S,M,L" or ["S","M","L"] or "S, M, L"
          if (sizes.trim().startsWith('[') && sizes.trim().endsWith(']')) {
            parsedSizes = JSON.parse(sizes);
          } else {
            // Split comma-separated values
            parsedSizes = sizes.split(',').map(s => s.trim()).filter(s => s);
          }
        } else if (Array.isArray(sizes)) {
          parsedSizes = sizes;
        }
      }
    } catch (error) {
      return res.status(400).json({
        error: "Invalid sizes format. Use JSON array like [\"S\",\"M\",\"L\"] or comma-separated like \"S,M,L\"",
        received: sizes
      });
    }

    try {
      if (colors) {
        if (typeof colors === 'string') {
          // Handle different formats: "Red,Blue,Green" or ["Red","Blue","Green"] or "Red, Blue, Green"
          if (colors.trim().startsWith('[') && colors.trim().endsWith(']')) {
            parsedColors = JSON.parse(colors);
          } else {
            // Split comma-separated values
            parsedColors = colors.split(',').map(c => c.trim()).filter(c => c);
          }
        } else if (Array.isArray(colors)) {
          parsedColors = colors;
        }
      }
    } catch (error) {
      return res.status(400).json({
        error: "Invalid colors format. Use JSON array like [\"Red\",\"Blue\",\"Green\"] or comma-separated like \"Red,Blue,Green\"",
        received: colors
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        sl_no: parseInt(sl_no),
        product_name,
        description,
        images: imageUrls,
        sizes: parsedSizes,
        colors: parsedColors,
        price: parseInt(price),
        offer_price: parseInt(offer_price),
        affiate_link: affiate_link || "",
        agent_name,
        category
      }
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
      uploaded_images: imageUrls
    });

  } catch (error) {
    console.error("Error creating product:", error);
    
    // Handle Prisma unique constraint errors (fallback)
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('sl_no')) {
        return res.status(400).json({
          error: "Product with this serial number already exists",
          field: "sl_no",
          value: req.body.sl_no
        });
      }
      return res.status(400).json({
        error: "Unique constraint violation",
        field: target
      });
    }

    // Handle other Prisma errors
    if (error.code?.startsWith('P')) {
      return res.status(400).json({
        error: "Database error",
        code: error.code,
        message: error.message
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


// Update product with optional image upload
export const updateProduct = async (req, res) => {
  const {id} = req.params;

  try {
    // Get existing product to preserve current images if no new ones uploaded
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle uploaded images
    const uploadedFiles = req.files as Express.Multer.File[];
    let imageUrls = existingProduct.images; // Keep existing images by default

    if (uploadedFiles && uploadedFiles.length > 0) {
      // If new images are uploaded, replace existing ones
      imageUrls = generateImageUrls(uploadedFiles, req);
      
     
    }

    // Parse arrays from form data if they're strings
    const updateData: any = { ...req.body };
    if (updateData.sizes && typeof updateData.sizes === 'string') {
      updateData.sizes = JSON.parse(updateData.sizes);
    }
    if (updateData.colors && typeof updateData.colors === 'string') {
      updateData.colors = JSON.parse(updateData.colors);
    }
    if (updateData.sl_no) {
      updateData.sl_no = parseInt(updateData.sl_no);
    }
    if (updateData.price) {
      updateData.price = parseInt(updateData.price);
    }
    if (updateData.offer_price) {
      updateData.offer_price = parseInt(updateData.offer_price);
    }

    // Update images in the data
    updateData.images = imageUrls;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
      uploaded_images: uploadedFiles && uploadedFiles.length > 0 ? generateImageUrls(uploadedFiles, req) : []
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
}

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

