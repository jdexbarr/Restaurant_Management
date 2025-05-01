// CartPage.js (Simulated Payment with Elegant Modal)
import { useEffect, useState } from 'react';
import './CartPage.css';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [message, setMessage] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ fullName: '', cardNumber: '', expiry: '', cvv: '' });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = JSON.parse(localStorage.getItem('user'));
    setCart(savedCart);
    if (user) setClientId(user.id);
  }, []);

  const handleQuantityChange = (index, newQty) => {
    const updated = [...cart];
    updated[index].quantity = newQty;
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleRemove = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async () => {
    const { fullName, cardNumber, expiry, cvv } = paymentData;
    if (!fullName || !cardNumber || !expiry || !cvv) {
      alert("Please fill all payment fields");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { id: clientId },
          status: 'PENDING',
          items: cart.map(item => ({
            quantity: item.quantity,
            menuItem: { id: item.id }
          }))
        })
      });

      if (response.ok) {
        setMessage("Payment successful! Order placed.");
        setCart([]);
        localStorage.removeItem('cart');
      } else {
        setMessage("Failed to place order.");
      }
    } catch (error) {
      setMessage("Server error.");
    } finally {
      setShowPayment(false);
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price} ×
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                />
                <button onClick={() => handleRemove(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Tax (10%):</strong> ${tax.toFixed(2)}</p>
            <p className="total-amount"><strong>Total:</strong> ${total.toFixed(2)}</p>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        </>
      )}

      {showPayment && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <h3>Payment Details</h3>
            <label>Card holder full name</label>
            <input
              name="fullName"
              placeholder="Enter your full name"
              value={paymentData.fullName}
              onChange={handlePaymentChange}
            />
            <label>Card Number</label>
            <input
              name="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={paymentData.cardNumber}
              onChange={handlePaymentChange}
            />
            <label>Expiry Date / CVV</label>
            <div className="expiry-cvv-row">
              <input
                name="expiry"
                placeholder="01/23"
                value={paymentData.expiry}
                onChange={handlePaymentChange}
              />
              <input
                name="cvv"
                placeholder="CVV"
                value={paymentData.cvv}
                onChange={handlePaymentChange}
              />
            </div>

            <div className="modal-breakdown">
              <p><span>Subtotal:</span> ${subtotal.toFixed(2)}</p>
              <p><span>Tax (10%):</span> ${tax.toFixed(2)}</p>
              <p className="modal-total"><strong>Total:</strong> ${total.toFixed(2)}</p>
            </div>

            <button className="confirm-btn" onClick={handlePaymentSubmit}>Checkout</button>
            <button onClick={() => setShowPayment(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {message && <p className="cart-message">{message}</p>}
    </div>
  );
}

export default CartPage;



