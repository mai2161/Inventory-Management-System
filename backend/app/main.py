from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import uuid
import qrcode

from . import models, database

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
models.Base.metadata.create_all(bind=database.engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/create-product")
async def create_product(
    name: str = Form(...), 
    db: Session = Depends(get_db),
    file: UploadFile = File(...)
):
    # 1. Generate a unique ID (Product ID)
    product_id = str(uuid.uuid4())[:8] # Short unique ID
    
    # 2. Save the Photo
    file_location = f"static/photos/{product_id}.png"
    os.makedirs("static/photos", exist_ok=True)
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    # 3. Save to Database
    new_product = models.Product(sku=product_id, name=name, stock=0)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    # 4. Generate the QR Code
    qr_path = f"static/qrcodes/{product_id}.png"
    qr_data = product_id # Or a URL like f"https://yourapp.com/product/{product_id}"
    img = qrcode.make(qr_data)
    img.save(qr_path)

    return {"id": product_id, "name": name, "qr_path": qr_path}

@app.get("/product/{sku}")
def get_product(sku: str, db: Session = Depends(get_db)):
    # This searches the 'sku' column for the code from the QR
    product = db.query(models.Product).filter(models.Product.sku == sku).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return {
        "id": product.id,
        "sku": product.sku,
        "name": product.name,
        "stock": product.stock,
        "photo_url": f"http://localhost:8000/static/photos/{product.sku}.png"
    }
@app.put("/product/{sku}/stock")
def update_stock(sku: str, change: int, db: Session = Depends(get_db)):
    # 1. Find the product
    product = db.query(models.Product).filter(models.Product.sku == sku).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Update the stock value
    product.stock += change
    
    # 3. Prevent negative stock
    if product.stock < 0:
        product.stock = 0
    
    # 4. Save to database
    db.commit()
    db.refresh(product)
    
    return {"sku": product.sku, "new_stock": product.stock}

@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products

@app.delete("/product/{sku}")
def delete_product(sku: str, db: Session = Depends(get_db)):
    # 1. Find the product in the database
    product = db.query(models.Product).filter(models.Product.sku == sku).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Define the file paths
    photo_path = f"static/photos/{sku}.png"
    qr_path = f"static/qrcodes/{sku}.png"

    # 3. Delete the Photo file if it exists
    if os.path.exists(photo_path):
        os.remove(photo_path)

    # 4. Delete the QR Code file if it exists
    if os.path.exists(qr_path):
        os.remove(qr_path)

    # 5. Delete the record from the database
    db.delete(product)
    db.commit()
    
    return {"message": f"Product {sku} and its images were deleted successfully"}