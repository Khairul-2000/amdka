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





@router.get("/products")
def get_products():
    response = requests.get("http://node:3000/api/products")
    return response.json()


@router.post("/chats")
def create_chat():
    return {"message": "Chat created successfully"}
