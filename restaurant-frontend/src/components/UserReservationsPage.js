import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import './UserReservationsPage.css';

function UserReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [toast, setToast] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reservations/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else {
          console.error('Failed to fetch user reservations');
        }
      } catch (error) {
        console.error('Error fetching user reservations:', error);
      }
    };

    fetchReservations();
  }, [user.id]);

  const navigate = useNavigate();

  const handleEdit = (reservationId) => {
    navigate(`/editreservation/${reservationId}`);
  };

  const handleDelete = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setToast('Reservation deleted successfully');
        setReservations(reservations.filter(r => r.id !== reservationId));
      } else {
        setToast('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  return (
    <div className="user-reservations-container">
      <h2>My Reservations</h2>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <div className="reservation-table-wrapper">
        <table className="styled-reservation-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>People</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>{new Date(reservation.reservationDate).toLocaleString()}</td>
                <td>{reservation.numberOfPeople}</td>
                <td>{reservation.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(reservation.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(reservation.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserReservationsPage;
