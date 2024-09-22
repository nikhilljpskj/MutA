import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewSubCategories.scss';
import TopNavBar from '../components/TopNavbar';
import LeftNavBar from '../components/LeftSidebar';

const ViewSubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/subcategories?page=${currentPage}`);
        if (response.data.success) {
          setSubCategories(response.data.subCategories || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setError('Failed to fetch subcategories');
        }
      } catch (error) {
        setError('Failed to fetch subcategories');
      }
    };
  
    fetchSubCategories();
  }, [currentPage]);
  
  
  

  const handleViewClick = (subCategory) => {
    setCurrentSubCategory(subCategory);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentSubCategory(null);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/subcategories/update/${currentSubCategory.id}`, {
        name: currentSubCategory.name,
      });
      alert('Subcategory updated successfully');
      handleCloseModal();
      const response = await axios.get(`http://localhost:5000/api/subcategories?page=${currentPage}`);
      setSubCategories(response.data.subCategories || []);
    } catch (error) {
      setError('Failed to update subcategory');
    }
  };

  return (
    <div className="view-subcategories-page">
      <TopNavBar />
      <div className="page-container">
        <LeftNavBar />
        <div className="content">
        <div className="category-header">
            <h2>Categories</h2>
            <a href="/add-sub-category" className="add-category-button">Add Category</a>
        </div>
          {error && <p className="error">{error}</p>}
          <table className="subcategories-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Subcategory</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {subCategories.length > 0 ? (
                subCategories.map((subCategory, index) => (
                <tr key={subCategory.id}>
                    <td>{index + 1}</td>
                    <td>{subCategory.name}</td>
                    <td>{subCategory.category_name}</td> {/* Ensure this matches the key 'category_name' */}
                    <td>
                    <button onClick={() => handleViewClick(subCategory)}>View</button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="4">No subcategories available</td>
                </tr>
            )}
            </tbody>

          </table>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="modal">
          <h3>Update Subcategory</h3>
          <div className="modal-content">
            <label htmlFor="name">Subcategory Name:</label>
            <input
              type="text"
              id="name"
              value={currentSubCategory.name || ''}
              onChange={(e) =>
                setCurrentSubCategory({ ...currentSubCategory, name: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button className="btn-update" onClick={handleUpdate}>
                Update
              </button>
              <button className="btn-close" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubCategories;
