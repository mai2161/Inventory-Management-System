# 🌍 QR Inventory Management System

Full-stack inventory management system that allows users to register products, store them in a database, and automatically generate **unique QR codes** for each item.

---

## 🛠️ Tech Stack

**Frontend**
- React.js

**Backend**
- FastAPI (Python)

**Database**
- SQLAlchemy 

**QR Code Generation**
- python-qrcode

---

## 🚀 Installation and Setup

### 1️⃣ Prerequisites

- Python **3.8+**
- Node.js & npm

---

### 2️⃣ Backend Setup (FastAPI)

The backend handles API routes, database management, and QR code generation.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install fastapi uvicorn sqlalchemy qrcode[pil] python-multipart

# Start the FastAPI server
uvicorn app.main:app --reload
```

📌 **Backend URLs**
- API: http://127.0.0.1:8000  
- Swagger UI: http://127.0.0.1:8000/docs  

---

### 3️⃣ Frontend Setup (React)

The frontend provides the user interface for managing inventory and viewing QR codes.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

📌 The app runs at:  
**http://localhost:3000**


## 🔧 Troubleshooting

### Port Conflicts
```bash
uvicorn app.main:app --reload --port 8001
```

### Missing Python Modules
```bash
pip install fastapi uvicorn sqlalchemy qrcode[pil] python-multipart
```

### To DOOO
Need a proper host to launch the application and a database.

## 📄 License

This project is licensed under the **MIT License**.

---

**Built with ❤️ using React and FastAPI**
