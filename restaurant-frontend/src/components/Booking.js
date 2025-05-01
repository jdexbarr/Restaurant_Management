import { useState, useEffect } from 'react';
import './Booking.css';
import { FaCalendarAlt, FaClock, FaUserFriends } from 'react-icons/fa';
import TableAvailabilityView from './TableAvailabilityView';

function Booking() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [table, setTable] = useState('');
  const [guests, setGuests] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null); // 👈 nuevo estado

  const todayDateString = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setClientName(user.firstName + ' ' + user.lastName);
      setClientId(user.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tableToUse = selectedTable !== null ? selectedTable : table;
    const hour = parseInt(time.split(":")[0]);
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);

    if (selectedDateTime < now) {
      setMessage('Cannot make reservations in the past');
      setMessageType('error');
      return;
    }

    if (hour < 10 || hour >= 22) {
      setMessage('Reservations allowed only from 10:00 AM to 10:00 PM');
      setMessageType('error');
      return;
    }

    if (tableToUse < 0 || tableToUse > 15) {
      setMessage('Table number must be between 0 and 15');
      setMessageType('error');
      return;
    }

    if (guests <= 0 || guests > 20) {
      setMessage('Guests must be between 1 and 20');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationDate: `${date}T${time}:00`,
          numberOfPeople: guests,
          tableId: tableToUse,
          status: "CONFIRMED",
          client: { id: clientId }
        })
      });

      if (response.ok) {
        setMessage(`Reservation successful for ${clientName}!`);
        setMessageType('success');
        setSelectedTable(null);
        setTable('');
        setGuests('');
      } else {
        const error = await response.text();
        setMessage(error);
        setMessageType('error');
      }
    } catch (err) {
      setMessage("Error making reservation");
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
    }
  };

  return (
    <div className="booking-container">
      <h2>Book a Table</h2>

      {message && <div className={`booking-message ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <FaCalendarAlt className="input-icon" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            min={todayDateString}
          />
        </div>

        <div className="input-wrapper">
          <FaClock className="input-icon" />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
        </div>

        {/* Ocultar el input manual si el usuario seleccionó visualmente una mesa */}
        {!selectedTable && (
          <div className="input-wrapper">
            <FaUserFriends className="input-icon" />
            <input
              type="number"
              name="table"
              placeholder="Table Number (0–15)"
              value={table}
              onChange={e => setTable(e.target.value)}
              required
              min="0"
              max="15"
            />
          </div>
        )}

        <div className="input-wrapper">
          <FaUserFriends className="input-icon" />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests (1–20)"
            value={guests}
            onChange={e => setGuests(e.target.value)}
            required
            min="1"
            max="20"
          />
        </div>


        <div className="button-reserve">
        <button 
          type="submit"
          disabled={loading}
          className={messageType === 'error' ? 'shake' : ''}
        >
          {loading ? "Reserving..." : "Reserve"}
        </button>
        </div>
      </form>

      {/* Tabla visual */}
      {date && time && (
        <TableAvailabilityView
          date={date}
          time={time}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />
      )}
    </div>
  );
}

export default Booking;











