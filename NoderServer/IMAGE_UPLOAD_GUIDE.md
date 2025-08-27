# Product Image Upload API

## Overview
This API provides product management with image upload functionality. Images are stored on the server filesystem and their URLs are saved in the database.

## Features
- Multiple image upload per product
- Image storage on server with unique filenames
- Image URL generation and database storage
- Support for common image formats (JPEG, PNG, GIF, WebP)
- File size limit: 5MB per image
- Maximum 10 images per product

## API Endpoints

### Create Product with Images
```
POST /api/products
Content-Type: multipart/form-data
```

**Form Data Fields:**
- `sl_no` (required): Serial number (integer)
- `product_name` (required): Product name (string)
- `description` (required): Product description (string)
- `images` (optional): Multiple image files
- `sizes` (optional): JSON array of sizes (string)
- `colors` (optional): JSON array of colors (string)
- `price` (required): Product price (integer)
- `offer_price` (required): Offer price (integer)
- `affiate_link` (optional): Affiliate link (string)
- `agent_name` (required): Agent name (string)
- `category` (required): Product category (string)

**Example using curl:**
```bash
curl -X POST http://localhost:3001/api/products \
  -F "sl_no=123" \
  -F "product_name=Test Product" \
  -F "description=A test product" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "sizes=[\"S\",\"M\",\"L\"]" \
  -F "colors=[\"Red\",\"Blue\"]" \
  -F "price=100" \
  -F "offer_price=80" \
  -F "agent_name=John Doe" \
  -F "category=Electronics"
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "product_id",
    "sl_no": 123,
    "product_name": "Test Product",
    "description": "A test product",
    "images": [
      "http://localhost:3001/uploads/products/uuid1.jpg",
      "http://localhost:3001/uploads/products/uuid2.jpg"
    ],
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"],
    "price": 100,
    "offer_price": 80,
    "affiate_link": "",
    "agent_name": "John Doe",
    "category": "Electronics",
    "created_at": "2025-08-27T...",
    "updated_at": "2025-08-27T..."
  },
  "uploaded_images": [
    "http://localhost:3001/uploads/products/uuid1.jpg",
    "http://localhost:3001/uploads/products/uuid2.jpg"
  ]
}
```

### Update Product with Images
```
PUT /api/products/:id
Content-Type: multipart/form-data
```

**Notes:**
- If new images are uploaded, they replace the existing images
- If no images are uploaded, existing images are preserved
- Same form data fields as create endpoint

### Get Products
```
GET /api/products
```

Returns all products with their image URLs.

### Get Product by ID
```
GET /api/products/:id
```

Returns a specific product with its image URLs.

### Delete Product
```
DELETE /api/products/:id
```

Deletes a product from the database. Note: This doesn't automatically delete image files from the server.

## File Storage

### Directory Structure
```
NoderServer/
├── uploads/
│   └── products/
│       ├── uuid1.jpg
│       ├── uuid2.png
│       └── ...
└── src/
    └── ...
```

### Image Access
Images are accessible via HTTP at:
```
http://your-server:port/uploads/products/filename.ext
```

## Frontend Integration

### HTML Form Example
```html
<form enctype="multipart/form-data">
  <input type="file" name="images" multiple accept="image/*">
  <input type="text" name="product_name" required>
  <input type="number" name="price" required>
  <!-- other fields -->
  <button type="submit">Create Product</button>
</form>
```

### JavaScript Fetch Example
```javascript
const formData = new FormData();
formData.append('product_name', 'My Product');
formData.append('price', '100');
// Add image files
const fileInput = document.querySelector('input[type="file"]');
for (let i = 0; i < fileInput.files.length; i++) {
  formData.append('images', fileInput.files[i]);
}

fetch('/api/products', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## Testing

Use the included `test-upload.html` file to test the upload functionality:

1. Start your server: `npm run dev`
2. Open `test-upload.html` in a browser
3. Fill out the form and select images
4. Submit to test the API

## Error Handling

### Common Errors
- **400 Bad Request**: Missing required fields
- **413 Payload Too Large**: File size exceeds 5MB limit
- **422 Unprocessable Entity**: Invalid file type (only images allowed)
- **500 Internal Server Error**: Server or database error

### File Type Validation
Only these image types are allowed:
- image/jpeg
- image/jpg  
- image/png
- image/gif
- image/webp

### File Size Limits
- Maximum file size: 5MB per image
- Maximum files per request: 10 images

## Environment Setup

Make sure your server is configured to serve static files from the uploads directory. This is already configured in the `server.ts` file:

```typescript
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

## Security Considerations

1. **File Type Validation**: Only image files are allowed
2. **File Size Limits**: Prevents large file uploads
3. **Unique Filenames**: Uses UUID to prevent filename conflicts
4. **Directory Traversal Protection**: Multer handles secure file paths

## Production Deployment

For production environments, consider:

1. **External Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
2. **CDN**: Serve images through a CDN for better performance
3. **Image Optimization**: Implement image compression and resizing
4. **Cleanup Jobs**: Regular cleanup of orphaned image files
5. **Backup Strategy**: Backup uploaded files regularly
