import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminReservationsPage.css';

function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalReservations: 0,
    confirmed: 0,
    cancelled: 0,
    totalOrders: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllReservations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/reservations');
        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else {
          console.error('Failed to fetch reservations');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchAllReservations();
    fetchStats();
  }, []);

  const handleDelete = async (reservationId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reservation?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${reservationId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Reservation deleted successfully');
        setReservations(reservations.filter(r => r.id !== reservationId));
      } else {
        alert('Failed to delete reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleEdit = (reservationId) => {
    navigate(`/editreservation/${reservationId}`);
  };

  const handleExportReservationsCSV = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const email = user?.email;

      const response = await fetch('http://localhost:8080/api/admin/export-reservations', {
        headers: { email }
      });

      if (!response.ok) {
        alert("Failed to export reservations.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = "reservations.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Export failed", error);
      alert("An error occurred while exporting reservations.");
    }
  };

  const handleExportOrdersCSV = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const email = user?.email;

      const response = await fetch('http://localhost:8080/api/admin/export-orders', {
        headers: { email }
      });

      if (!response.ok) {
        alert("Failed to export orders.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = "orders.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Export failed", error);
      alert("An error occurred while exporting orders.");
    }
  };

  return (
    <div className="admin-reservations-container">
      <h2>Admin Dashboard</h2>

      <div className="stats-cards">
        <div className="card">
          <h4>Total Clients</h4>
          <p>{stats.totalClients}</p>
        </div>
        <div className="card">
          <h4>Total Reservations</h4>
          <p>{stats.totalReservations}</p>
        </div>
        <div className="card">
          <h4>Confirmed</h4>
          <p>{stats.confirmed}</p>
        </div>
        <div className="card">
          <h4>Cancelled</h4>
          <p>{stats.cancelled}</p>
        </div>
        <div className="card">
          <h4>Total Orders</h4>
          <p>{stats.totalOrders}</p>
        </div>
      </div>

      {/* Botones de exportación */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleExportReservationsCSV} className="export-csv-btn">
          📁 Export Reservations as CSV
        </button>
        <button onClick={handleExportOrdersCSV} className="export-csv-btn">
          📁 Export Orders as CSV
        </button>
      </div>

      <h3>All Reservations</h3>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Date</th>
            <th>People</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation.id} className={reservation.status === 'CANCELLED' ? 'cancelled-reservation' : ''}>
              <td>{reservation.client?.firstName} {reservation.client?.lastName}</td>
              <td>{new Date(reservation.reservationDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</td>
              <td>{reservation.numberOfPeople}</td>
              <td>{reservation.status}</td>
              <td>
                <button onClick={() => handleEdit(reservation.id)}>Edit</button>
                <button onClick={() => handleDelete(reservation.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReservationsPage;




