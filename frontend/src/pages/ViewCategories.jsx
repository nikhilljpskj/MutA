import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewCategories.scss'; // Ensure this file exists and is correctly imported
import TopNavBar from '../components/TopNavbar'; // Ensure these components exist
import LeftNavBar from '../components/LeftSidebar'; // Ensure these components exist

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/categories?page=${currentPage}`);
        console.log('Fetched categories:', response.data); // Debugging
        setCategories(response.data.categories || []); // Adjust if response is directly an array
        setTotalPages(response.data.totalPages || 1); // Adjust based on API response
      } catch (error) {
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [currentPage]);

  const handleViewClick = (category) => {
    setCurrentCategory(category);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentCategory(null);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/categories/update/${currentCategory.id}`, {
        name: currentCategory.name,
      });
      alert('Category updated successfully');
      handleCloseModal();
      window.location.reload();
      const response = await axios.get(`http://localhost:5000/api/categories?page=${currentPage}`);
      setCategories(response.data); // Refresh categories after update
    } catch (error) {
      setError('Failed to update category');
    }
  };
  

  return (
    <div className="view-categories-page">
      <TopNavBar />
      <div className="page-container">
        <LeftNavBar />
        <div className="content">
        <div className="category-header">
            <h2>Categories</h2>
            <a href="/add-category" className="add-category-button">Add Category</a>
        </div>
          {error && <p className="error">{error}</p>}
          <table className="categories-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <button onClick={() => handleViewClick(category)}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No categories available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {modalVisible && currentCategory && (
        <div className="modal">
          <h3>Category Details</h3>
          <div className="modal-content">
            <label htmlFor="name">Category Name:</label>
            <input
              type="text"
              id="name"
              value={currentCategory.name || ''}
              onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
            />
            <div className="modal-buttons">
              <button className="btn-update" onClick={handleUpdate}>Update</button>
              <button className="btn-close" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCategories;
