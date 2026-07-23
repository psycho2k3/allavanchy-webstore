# ALLAVANCHY API Testing Documentation

Base URL:

```text
http://localhost:5000
```

## Authentication

### Register User

Method:

```text
POST
```

URL:

```text
/api/auth/register
```

Headers:

```json
{
  "Content-Type": "application/json"
}
```

Body example:

```json
{
  "name": "Jane Admin",
  "email": "jane@example.com",
  "password": "password123"
}
```

Expected response:

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "Jane Admin",
    "email": "jane@example.com",
    "role": "customer"
  }
}
```

### Login User

Method:

```text
POST
```

URL:

```text
/api/auth/login
```

Headers:

```json
{
  "Content-Type": "application/json"
}
```

Body example:

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Expected response:

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "name": "Jane Admin",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

## Products

### Get All Products

Method:

```text
GET
```

URL:

```text
/api/products
```

Headers:

```json
{}
```

Body example:

```text
No request body required.
```

Expected response:

```json
[
  {
    "id": 1,
    "name": "Luxury Handbag",
    "description": "Premium ALLAVANCHY handbag",
    "price": "250.00",
    "image_url": "https://res.cloudinary.com/example/image/upload/product.jpg",
    "stock": 15,
    "category": "Bags",
    "created_at": "2026-07-23T10:00:00.000Z",
    "updated_at": "2026-07-23T10:00:00.000Z"
  }
]
```

### Get Single Product

Method:

```text
GET
```

URL:

```text
/api/products/:id
```

Example:

```text
/api/products/1
```

Headers:

```json
{}
```

Body example:

```text
No request body required.
```

Expected response:

```json
{
  "id": 1,
  "name": "Luxury Handbag",
  "description": "Premium ALLAVANCHY handbag",
  "price": "250.00",
  "image_url": "https://res.cloudinary.com/example/image/upload/product.jpg",
  "stock": 15,
  "category": "Bags",
  "created_at": "2026-07-23T10:00:00.000Z",
  "updated_at": "2026-07-23T10:00:00.000Z"
}
```

Missing product response:

```json
{
  "message": "Product not found"
}
```

### Create Product

Admin only.

Method:

```text
POST
```

URL:

```text
/api/products
```

Headers:

```json
{
  "Authorization": "Bearer JWT_TOKEN_HERE"
}
```

Body example:

Use `multipart/form-data`.

```text
name: Luxury Handbag
description: Premium ALLAVANCHY handbag
price: 250.00
stock: 15
category: Bags
image: product-image.jpg
```

Expected response:

```json
{
  "id": 1,
  "name": "Luxury Handbag",
  "image_url": "https://res.cloudinary.com/example/image/upload/product.jpg",
  "price": "250.00",
  "stock": 15
}
```

Invalid input response:

```json
{
  "message": "Invalid product input",
  "errors": [
    "Name is required",
    "Product image is required"
  ]
}
```

Non-admin response:

```json
{
  "message": "Admin access required"
}
```

### Update Product

Admin only.

Method:

```text
PUT
```

URL:

```text
/api/products/:id
```

Example:

```text
/api/products/1
```

Headers:

```json
{
  "Authorization": "Bearer JWT_TOKEN_HERE"
}
```

Body example:

Use `multipart/form-data`. The image field is optional when updating.

```text
name: Updated Luxury Handbag
description: Updated product description
price: 275.00
stock: 10
category: Bags
image: updated-product-image.jpg
```

Expected response:

```json
{
  "id": 1,
  "name": "Updated Luxury Handbag",
  "description": "Updated product description",
  "price": "275.00",
  "image_url": "https://res.cloudinary.com/example/image/upload/updated-product.jpg",
  "stock": 10,
  "category": "Bags",
  "created_at": "2026-07-23T10:00:00.000Z",
  "updated_at": "2026-07-23T11:00:00.000Z"
}
```

Missing product response:

```json
{
  "message": "Product not found"
}
```

### Delete Product

Admin only.

Method:

```text
DELETE
```

URL:

```text
/api/products/:id
```

Example:

```text
/api/products/1
```

Headers:

```json
{
  "Authorization": "Bearer JWT_TOKEN_HERE"
}
```

Body example:

```text
No request body required.
```

Expected response:

```json
{
  "message": "Product deleted",
  "product": {
    "id": 1,
    "name": "Luxury Handbag",
    "description": "Premium ALLAVANCHY handbag",
    "price": "250.00",
    "image_url": "https://res.cloudinary.com/example/image/upload/product.jpg",
    "stock": 15,
    "category": "Bags",
    "created_at": "2026-07-23T10:00:00.000Z",
    "updated_at": "2026-07-23T10:00:00.000Z"
  }
}
```

Missing product response:

```json
{
  "message": "Product not found"
}
```
