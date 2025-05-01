import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import './UserInterface.css';

function UserInterface() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [profile, setProfile] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/clients/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setImagePreview(`http://localhost:8080${data.profileImage || ''}`);
      });

    fetch(`http://localhost:8080/api/clients/${user.id}/reservations`)
      .then(res => res.json())
      .then(data => setReservations(data));
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('email', profile.email);
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/clients/profile`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        setToast({ type: 'success', message: 'Profile updated!' });
        setEditMode(false);
        const updated = await fetch(`http://localhost:8080/api/clients/${user.id}`).then(res => res.json());
        setProfile(updated);
        setImagePreview(`http://localhost:8080${updated.profileImage}`);
      } else {
        setToast({ type: 'error', message: 'Update failed.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Error updating profile.' });
      console.error(err);
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReservations(prev => prev.filter(r => r.id !== id));
        setToast({ type: 'success', message: 'Reservation deleted!' });
      } else {
        setToast({ type: 'error', message: 'Error deleting reservation.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server error.' });
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/client/${user.id}`);
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error loading order history', err);
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <h2>My Profile</h2>
      <div className="profile-info">
        <div className="profile-image-wrapper">
          <img src={imagePreview || 'https://via.placeholder.com/100'} alt="Profile" />
          {editMode && (
            <>
              <label htmlFor="imageUpload" className="change-image-btn">Change</label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </>
          )}
        </div>

        {editMode ? (
          <>
            <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} />
            <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} />
            <input type="email" name="email" value={profile.email} onChange={handleChange} />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <button onClick={() => setEditMode(true)}>Edit</button>
          </>
        )}
      </div>

      <h3>My Reservations</h3>
      <ul className="reservation-list">
        {reservations.map(res => (
          <li key={res.id}>
            {new Date(res.reservationDate).toLocaleString()} — {res.numberOfPeople} people — {res.status } --- 
            <button onClick={() => navigate(`/editreservation/${res.id}`)} className="edit-btn">Edit</button>
            <button onClick={() => handleDeleteReservation(res.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>

      <div className="order-history">
        <button onClick={() => {
          if (!showOrders) fetchOrders();
          setShowOrders(!showOrders);
        }}>
          {showOrders ? "Hide Order History" : "Show Order History"}
        </button>

        {showOrders && (
          <ul className="order-list">
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map(order => (
                <li key={order.id} className="order-entry">
                  <strong>{new Date(order.orderDate).toLocaleString()}</strong> - {order.status}
                  <ul>
                    {order.items?.map(item => (
                      <li key={item.id}>{item.menuItem.name} × {item.quantity}</li>
                    ))}
                  </ul>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserInterface;



