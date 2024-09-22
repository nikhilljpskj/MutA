import React, { useState } from 'react';
import './Popup.scss';

const Popup = ({ category, onClose, onUpdate }) => {
  const [name, setName] = useState(category.name);
  const [error, setError] = useState('');

  const handleUpdate = () => {
    if (!name) {
      setError('Category name is required');
      return;
    }

    onUpdate({ name });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Update Category</h3>
        <div className="form-group">
          <label htmlFor="name">Category Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn-update" onClick={handleUpdate}>Update</button>
        <button className="btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
