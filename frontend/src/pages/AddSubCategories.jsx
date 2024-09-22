import React, { useState, useEffect } from 'react';
import './AddSubCategories.scss';
import TopNavBar from '../components/TopNavbar';
import LeftNavBar from '../components/LeftSidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSubCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data.categories || []); // Ensure categories are set
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!categoryId || !subCategoryName) {
      setError('Category and Subcategory name are required');
      return;
    }
  
    console.log('Submitting:', { categoryId, subCategoryName });
  
    try {
      const response = await axios.post('http://localhost:5000/api/subcategories/add', {
        categoryId,
        name: subCategoryName,
      });
  
      if (response.data.success) {
        alert('Subcategory added successfully');
        navigate('/view-category');
      } else {
        setError(response.data.message || 'Failed to add subcategory');
      }
    } catch (error) {
      console.error('Failed to add subcategory:', error);
      setError('Failed to add subcategory');
    }
  };
  
  

  return (
    <div className="add-subcategories-page">
      <TopNavBar />
      <div className="page-container">
        <LeftNavBar />
        <div className="content">
          <h2>Add New Subcategory</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="subCategoryName">Subcategory Name:</label>
              <input
                type="text"
                id="subCategoryName"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Enter subcategory name"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-submit">Add Subcategory</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategories;
