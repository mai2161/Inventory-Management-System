import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Generator = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', image);

    try {
      const response = await axios.post('http://localhost:8000/create-product', formData);
      setResult(response.data);
      alert("Product Created!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Product Name" 
          onChange={(e) => setName(e.target.value)} required 
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <input 
    type="file" 
    accept="image/*" 
    onChange={(e) => setImage(e.target.files[0])} 
    required 
    style={{ 
        display: 'block', 
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px'
    }}
    />
    {image && (
  <div style={{ marginTop: '10px' }}>
    <p>Selected Preview:</p>
    <img 
      src={URL.createObjectURL(image)} 
      alt="preview" 
      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} 
    />
  <button 
        type="button" 
        onClick={() => setImage(null)}
        style={{ fontSize: '12px', color: 'red', cursor: 'pointer', background: 'none', border: 'none', padding: '5px 0' }}
      >
        ✕ Remove photo
      </button>
    </div>
)}
        
        {/* Container for Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Create Product & QR
          </button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h4>New ID: {result.id}</h4>
          <p>Product: {result.name}</p>
          <img src={`http://localhost:8000/${result.qr_path}`} alt="QR Code" style={{ width: '150px' }} />
          <br />
          <small>Right-click to save and print</small>
        </div>
      )}
    </div>
  );
};

export default Generator;