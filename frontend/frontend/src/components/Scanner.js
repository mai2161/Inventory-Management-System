import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const Scanner = () => {
  const [product, setProduct] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);

  const startScanner = () => {
    setScannerActive(true);
    
    // We use setTimeout to ensure the "reader" div exists in the DOM before starting
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner('reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        async (decodedText) => {
          scanner.clear(); // Stop scanning on success
          setScannerActive(false);
          try {
            const cleanSku = decodedText.trim(); // Removes accidental spaces or enters
            const response = await axios.get(`http://localhost:8000/product/${cleanSku}`);
            setProduct(response.data);
          } catch (err) {
            alert("Product not found in database!");
          }
        },
        (error) => {
          // Silent failure during scan frames
        }
      );
    }, 100);
  };

const handleUpdateStock = async (sku, amount) => {
  try {
    // We send the 'amount' (1 or -1) as a query parameter
    const response = await axios.put(`http://localhost:8000/product/${sku}/stock?change=${amount}`);
    
    // Update your React state with the new number
    setProduct(prev => ({ ...prev, stock: response.data.new_stock }));
    
    alert(`Stock updated! New total: ${response.data.new_stock}`);
  } catch (error) {
    console.error("Failed to update stock", error);
  }
};
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {!scannerActive && !product && (
        <button 
          onClick={startScanner}
          style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Open Camera Scanner
        </button>
      )}

      {/* This DIV is vital. The scanner looks for the ID 'reader' */}
      <div id="reader" style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}></div>

      {product && (
  <div style={{ border: '2px solid #28a745', padding: '20px', marginTop: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
    {/* 1. Display the Product Photo */}
    <img 
      src={`http://localhost:8000/static/photos/${product.sku}.png`} 
      alt={product.name} 
      style={{ width: '100%', maxWidth: '200px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }} 
    />
    
    <h2 style={{ margin: '5px 0' }}>{product.name}</h2>
    <p style={{ color: '#666' }}>ID: {product.sku}</p>
    <p style={{ fontSize: '20px' }}>Current Stock: <strong>{product.stock}</strong></p>
    
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => handleUpdateStock(1)} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>+ Add</button>
      <button onClick={() => handleUpdateStock(-1)} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>- Remove</button>
    </div>
    
    <button onClick={() => { setProduct(null); window.location.reload(); }} style={{ color: '#007bff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Scan Next Item</button>
  </div>
)}
    </div>
  );
};

export default Scanner;