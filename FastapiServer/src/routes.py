from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import requests
import json
import os
import random





class ProductModel(BaseModel):
    sl_no: int = Field(..., description="Serial number of the product")
    product_name: str = Field(..., min_length=1, description="Name of the product")
    description: str = Field(..., min_length=1, description="Description of the product")
    images: List[str] = Field(default=[], description="List of image URLs")
    sizes: List[str] = Field(default=[], description="Available sizes")
    colors: List[str] = Field(default=[], description="Available colors")
    price: int = Field(..., gt=0, description="Original price in cents")
    offer_price: int = Field(..., gt=0, description="Discounted price in cents")
    affiate_link: Optional[str] = Field(default="", description="Affiliate link URL")
    agent_name: str = Field(..., min_length=1, description="Name of the agent/seller")
    category: str = Field(..., min_length=1, description="Product category")

  

router = APIRouter()

def load_products_from_json():
    """Load products from products.json file"""
    try:
        json_file_path = os.path.join(os.path.dirname(__file__), '..', 'products.json')
        with open(json_file_path, 'r', encoding='utf-8') as file:
            products = json.load(file)
        return products
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="products.json file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format in products.json")

def insert_product_to_database(product_data):
    """Insert a single product into the database via Node.js API"""
    try:
        response = requests.post(
            "http://node:3000/api/products",
            json=product_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            return {"success": True, "product": product_data["product_name"], "data": response.json()}
        else:
            return {"success": False, "error": response.text, "status_code": response.status_code}
            
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/products")
def read_products():
    response = requests.get("http://node:3000/api/products")
    return response.json()


@router.post("/products")
def create_product(product: ProductModel):
    response = requests.post("http://node:3000/api/products", json=product.model_dump())
    return response.json()



@router.post("/insert-all-products")
def insert_all_products():
    """Insert all products from products.json into the database"""
    try:
        products = load_products_from_json()
        
        if not products:
            raise HTTPException(status_code=404, detail="No products found in products.json")
        
        results = []
        success_count = 0
        failure_count = 0
        
        for i, product in enumerate(products):
            # Modify sl_no to make it unique
            import time
            product["sl_no"] = int(time.time()) + i + random.randint(1, 100)
            
            # Insert into database
            result = insert_product_to_database(product)
            results.append({
                "product_name": product["product_name"],
                "result": result
            })
            
            if result["success"]:
                success_count += 1
            else:
                failure_count += 1
        
        return {
            "message": "Bulk insertion completed",
            "total_products": len(products),
            "successful_insertions": success_count,
            "failed_insertions": failure_count,
            "details": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inserting products: {str(e)}")

