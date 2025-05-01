import { useEffect, useState, useContext } from 'react';
import './Menu.css';
import { CartContext } from './CartContext';

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [bouncingId, setBouncingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/menuitems')
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Error fetching menu items:', error));
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setBouncingId(item.id);
    setToastMessage(`${item.name} added to cart!`);
    setTimeout(() => {
      setBouncingId(null);
    }, 300);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>
      
      {toastMessage && <div className="toast">{toastMessage}</div>}

      <div className="menu-grid">
        {menuItems.map(item => (
          <div key={item.id} className="menu-card">
            <img src={item.imageUrl} alt={item.name} className="menu-image" />
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p><strong>${item.price.toFixed(2)}</strong></p>
            <button
              className={bouncingId === item.id ? 'bounce' : ''}
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;





  