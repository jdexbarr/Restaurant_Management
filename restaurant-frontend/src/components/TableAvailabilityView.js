import { useEffect, useState } from 'react';
import './TableAvailabilityView.css';

function TableAvailabilityView({ date, time, selectedTable, setSelectedTable }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date && time) {
      const fetchAvailability = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8080/api/reservations/availability?date=${date}&time=${time}`);
          const data = await response.json();
          setTables(data);
        } catch (error) {
          console.error("Error fetching table availability:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAvailability();
    }
  }, [date, time]);

  const handleSelectTable = (tableId, occupied) => {
    if (occupied) return;
    setSelectedTable(prev => prev === tableId ? null : tableId);
  };

  return (
    <div className="table-availability-container">
      <h3>Table Availability</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="tables-grid">
          {tables.map(table => (
            <div
              key={table.tableId}
              className={`table-box ${table.occupied ? 'occupied' : 'available'} ${selectedTable === table.tableId ? 'selected' : ''}`}
              onClick={() => handleSelectTable(table.tableId, table.occupied)}
            >
              <p><strong>Table #{table.tableNumber}</strong></p>
              <p>{table.seats} seats</p>
              <p className="status">{table.occupied ? 'Occupied' : 'Available'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TableAvailabilityView;


