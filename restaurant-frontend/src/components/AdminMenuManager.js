import { useEffect, useState } from 'react';
import './AdminMenuManager.css';

function AdminMenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({ name: '', description: '', price: '', available: false });
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', available: true, imageFile: null });

  useEffect(() => {
    fetch('http://localhost:8080/api/menuitems')
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/menuitems/${id}`, { method: 'DELETE' });
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditedItem({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedItem({ name: '', description: '', price: '', available: false });
  };

  const handleSave = async () => {
    const response = await fetch(`http://localhost:8080/api/menuitems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedItem)
    });

    if (response.ok) {
      const updatedItem = await response.json();
      setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
      cancelEdit();
    }
  };

  const handleAddItem = async () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", newItem.price);
    formData.append("available", newItem.available);
    if (newItem.imageFile) {
      formData.append("image", newItem.imageFile);
    }

    const response = await fetch('http://localhost:8080/api/menuitems/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const addedItem = await response.json();
      setMenuItems(prev => [...prev, addedItem]);
      setNewItem({ name: '', description: '', price: '', available: true, imageFile: null });
    } else {
      alert("Failed to add item");
    }
  };

  const resolveImageUrl = (url) => {
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  };

  return (
    <div className="admin-menu">
      <h2>Admin Menu Manager</h2>

      <div className="new-item-form">
        <h3>Add New Menu Item</h3>
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewItem({ ...newItem, imageFile: e.target.files[0] })}
        />
        <label>
          <input
            type="checkbox"
            checked={newItem.available}
            onChange={(e) => setNewItem({ ...newItem, available: e.target.checked })}
          /> Available
        </label>
        <button className="add-btn" onClick={handleAddItem}>Add Item</button>
      </div>

      <div className="admin-menu-grid">
        {menuItems.map(item => (
          <div key={item.id} className="admin-menu-card">
            {editingId === item.id ? (
              <div className="edit-form">
                <input type="text" value={editedItem.name} onChange={e => setEditedItem({ ...editedItem, name: e.target.value })} />
                <textarea value={editedItem.description} onChange={e => setEditedItem({ ...editedItem, description: e.target.value })}></textarea>
                <input type="number" value={editedItem.price} onChange={e => setEditedItem({ ...editedItem, price: parseFloat(e.target.value) })} />
                <label>
                  <input type="checkbox" checked={editedItem.available} onChange={e => setEditedItem({ ...editedItem, available: e.target.checked })} /> Available
                </label>
                <div className="edit-buttons">
                  <button onClick={handleSave} className="save-btn">Save</button>
                  <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                {item.imageUrl && (
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="menu-image"
                  />
                )}
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p><strong>${item.price.toFixed(2)}</strong></p>
                <p className={item.available ? 'available' : 'unavailable'}>
                  {item.available ? 'Available' : 'Unavailable'}
                </p>
                <div className="action-buttons">
                  <button onClick={() => startEdit(item)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMenuManager;





