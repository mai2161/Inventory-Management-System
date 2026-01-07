import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Scanner from './components/Scanner';
import Generator from './components/Generator';
import InventoryList from './components/Inventory';
function App() {
  return (
    <Router>
      <nav style={{ 
        display: 'flex',          // 1. MUST add this for 'gap' to work
        padding: '15px 20px', 
        gap: '20px',              // 2. This creates even space between all links
        background: '#282c34', 
        alignItems: 'center' 
      }}>
        <Link to="/" style={linkStyle}>Scanner</Link>
        <Link to="/inventory" style={linkStyle}>View Database</Link>
        <Link to="/generator" style={linkStyle}>Add Product</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/inventory" element={<InventoryList />} />
      </Routes>
    </Router>
  );
}

// Keep your styles clean by defining them here
const linkStyle = { 
  color: 'white', 
  textDecoration: 'none', 
  fontWeight: '500' 
};

export default App;
