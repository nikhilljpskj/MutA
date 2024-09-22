import React, { useState } from 'react';
import './AddCategories.scss';
import LeftNavBar from '../components/LeftSidebar';
import TopNavbar from '../components/TopNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCategories = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Category name is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/categories/add', {
        name,
      });

      if (response.data.success) {
        alert('Category added successfully');
        navigate('/view-category');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to add category');
    }
  };

  return (
    <div className="add-categories-page">
      {/* TopNavBar and LeftNavBar */}
      <TopNavbar />
      <div className="page-container">
        <LeftNavBar />
        <div className="content">
          <h2>Add New Category</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Category Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-submit">Add Category</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
