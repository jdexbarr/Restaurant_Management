import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Toast from './Toast';
import './EditReservationPage.css';

function EditReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reservations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setReservation(data);
        } else {
          console.error('Failed to fetch reservation');
        }
      } catch (error) {
        console.error('Error fetching reservation:', error);
      }
    };

    fetchReservation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation({ ...reservation, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      });

      if (response.ok) {
        setToast({ show: true, message: 'Reservation updated successfully', type: 'success' });
        setTimeout(() => navigate('/myreservations'), 2000);
      } else {
        setToast({ show: true, message: 'Failed to update reservation', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setToast({ show: true, message: 'Server error updating reservation', type: 'error' });
    }
  };

  if (!reservation) return <div className="edit-container">Loading...</div>;

  return (
    <div className="edit-container">
      <h2>Edit Reservation</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <label>Reservation Date</label>
        <input
          type="datetime-local"
          name="reservationDate"
          value={reservation.reservationDate}
          onChange={handleChange}
        />

        <label>Number of People</label>
        <input
          type="number"
          name="numberOfPeople"
          placeholder="Number of People"
          value={reservation.numberOfPeople}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={reservation.status}
          onChange={handleChange}
        >
          <option value="CONFIRMED">✅ Confirmed</option>
          <option value="CANCELLED">❌ Cancelled</option>
        </select>

        <button type="submit">Save Changes</button>
      </form>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false })} />
      )}
    </div>
  );
}

export default EditReservationPage;


