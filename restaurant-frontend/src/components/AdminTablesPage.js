import { useEffect, useState } from 'react';
import './AdminTablesPage.css';
import Toast from './Toast';

function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ tableNumber: '', seats: '' });
  const [editingTableId, setEditingTableId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData?.role === 'ADMIN') {
      fetchTables();
    }
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/tables');
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTable),
      });
      if (res.ok) {
        fetchTables();
        setNewTable({ tableNumber: '', seats: '' });
        showToast('✅ Table added successfully');
      } else {
        showToast('❌ Error adding table');
      }
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tables/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTables();
        showToast('🗑️ Table deleted');
      } else {
        showToast('❌ Failed to delete table');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (table) => {
    setEditingTableId(table.id);
    setEditValues({ tableNumber: table.tableNumber, seats: table.seats });
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/tables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues),
      });
      if (res.ok) {
        fetchTables();
        setEditingTableId(null);
        setEditValues({});
        showToast('✏️ Table updated');
      } else {
        showToast('❌ Error saving changes');
      }
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (!user || user.role !== 'ADMIN') {
    return <p className="unauthorized">Access Denied</p>;
  }

  return (
    <div className="admin-tables-container">
      <h2>Manage Tables</h2>

      <div className="add-table-form">
        <input
          type="number"
          placeholder="Table Number"
          value={newTable.tableNumber}
          onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
        />
        <input
          type="number"
          placeholder="Seats"
          value={newTable.seats}
          onChange={(e) => setNewTable({ ...newTable, seats: e.target.value })}
        />
        <button onClick={handleAdd}>Add Table</button>
      </div>

      <div className="tables-list">
        {tables.map((table) => (
          <div key={table.id} className="table-card">
            {editingTableId === table.id ? (
              <>
                <input
                  type="number"
                  value={editValues.tableNumber}
                  onChange={(e) =>
                    setEditValues({ ...editValues, tableNumber: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editValues.seats}
                  onChange={(e) =>
                    setEditValues({ ...editValues, seats: e.target.value })
                  }
                />
                <button onClick={() => handleSaveEdit(table.id)}>Save</button>
              </>
            ) : (
              <>
                <p><strong>Table #{table.tableNumber}</strong></p>
                <p>{table.seats} seats</p>
                <button onClick={() => handleEdit(table)}>Edit</button>
              </>
            )}
            <button onClick={() => handleDelete(table.id)}>Delete</button>
          </div>
        ))}
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
}

export default AdminTablesPage;
