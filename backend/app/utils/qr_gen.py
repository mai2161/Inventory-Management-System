import qrcode
def generate_qr_code(product_id):
    # The URL your app will open when scanned
    data = f"https://yourinventoryapp.com/product/{product_id}"
    qr = qrcode.make(data)
    qr.save(f"static/qrcodes/{product_id}.png")