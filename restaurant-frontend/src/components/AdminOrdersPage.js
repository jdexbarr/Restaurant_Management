import { useEffect, useState } from 'react';
import './AdminOrdersPage.css';
import Toast from './Toast';

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [pendingStatus, setPendingStatus] = useState({}); // { orderId: "newStatus" }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const handleStatusSelect = (orderId, newStatus) => {
    setPendingStatus(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const confirmStatusChange = async (orderId) => {
    const newStatus = pendingStatus[orderId];
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setToast(`Order #${orderId} updated to ${newStatus}`);
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setPendingStatus(prev => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setToast(`Order #${orderId} deleted`);
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="admin-orders-container">
      <h2>Manage Orders</h2>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="orders-grid">
        {orders.map(order => {
          const tempStatus = pendingStatus[order.id] ?? order.status;
          return (
            <div key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
              <p><strong>Order #{order.id}</strong></p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong></p>
              <select
                value={tempStatus}
                onChange={(e) => handleStatusSelect(order.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {pendingStatus[order.id] && pendingStatus[order.id] !== order.status && (
                <button
                  className="confirm-button"
                  onClick={() => confirmStatusChange(order.id)}
                >
                  Confirm
                </button>
              )}

              <p><strong>Client:</strong> {order.client?.firstName} {order.client?.lastName}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>{item.menuItem.name} × {item.quantity}</li>
                ))}
              </ul>
              <button className="delete-button" onClick={() => handleDelete(order.id)}>Delete Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminOrdersPage;



