import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('http://localhost:8000/products');
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

   const updateStock = async (sku, amount) => {
    // Ensure the amount is a number
    const change = parseInt(amount);
    if (isNaN(change) || change === 0) return;

    try {
        await axios.put(`http://localhost:8000/product/${sku}/stock?change=${change}`);
        fetchInventory(); // Refresh the numbers on screen
    } catch (error) {
        console.error("Error updating stock:", error);
    }
};

    const deleteItem = async (sku) => {
        if (window.confirm(`Are you sure you want to delete item: ${sku}?`)) {
            try {
                await axios.delete(`http://localhost:8000/product/${sku}`);
                fetchInventory(); 
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer' }}>
                ← Back to Scanner
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>📋 Warehouse Inventory</h2>
                <button onClick={fetchInventory} style={{ padding: '10px', cursor: 'pointer' }}>🔄 Refresh Data</button>
            </div>
            
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <th style={cellStyle}>Photo</th>
                        <th style={cellStyle}>QR Code</th>
                        <th style={cellStyle}>Name</th>
                        <th style={cellStyle}>SKU</th>
                        <th style={cellStyle}>Stock Level</th>
                        <th style={cellStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.sku} style={{ borderBottom: '1px solid #ddd' }}>
                                {/* Product Photo */}
                                <td style={rowStyle}>
                                    <img 
                                        src={`http://localhost:8000/static/photos/${item.sku}.png`} 
                                        alt="Product" 
                                        style={imgStyle}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/60?text=No+Photo'} 
                                    />
                                </td>
                                {/* QR Code Photo */}
                                <td style={rowStyle}>
                                    <img 
                                        src={`http://localhost:8000/static/qrcodes/${item.sku}.png`} 
                                        alt="QR" 
                                        style={imgStyle}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/60?text=No+QR'} 
                                    />
                                </td>
                                <td style={rowStyle}>{item.name}</td>
                                <td style={rowStyle}><code>{item.sku}</code></td>
                                
                                {/* Stock Control */}
                               
                                <td style={rowStyle}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        
                                        {/* Row 1: Simple +/- 1 buttons */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button onClick={() => updateStock(item.sku, -1)} style={qtyBtn}>-1</button>
                                            <span style={{ fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                                                {item.stock}
                                            </span>
                                            <button onClick={() => updateStock(item.sku, 1)} style={qtyBtn}>+1</button>
                                        </div>

                                        {/* Row 2: Bulk Input UI */}
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <input 
                                                type="number" 
                                                placeholder="Qty"
                                                id={`bulk-${item.sku}`} // This ID helps the button find the right input
                                                style={{ 
                                                    width: '60px', 
                                                    padding: '4px', 
                                                    borderRadius: '4px', 
                                                    border: '1px solid #ccc',
                                                    fontSize: '12px' 
                                                }}
                                            />
                                            <button 
                                                onClick={() => {
                                                    const input = document.getElementById(`bulk-${item.sku}`);
                                                    updateStock(item.sku, input.value);
                                                    input.value = ''; // Clears the box after you click
                                                }}
                                                style={{ 
                                                    padding: '4px 8px', 
                                                    fontSize: '12px', 
                                                    backgroundColor: '#2ecc71', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                Add Bulk
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                {/* Delete Action */}
                                <td style={rowStyle}>
                                    <button onClick={() => deleteItem(item.sku)} style={deleteBtn}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No items found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Simple Styles for cleanliness
const cellStyle = { padding: '12px', border: '1px solid #ddd' };
const rowStyle = { padding: '10px' };
const imgStyle = { width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #eee' };
const qtyBtn = { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '4px' };
const deleteBtn = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' };

export default InventoryList;