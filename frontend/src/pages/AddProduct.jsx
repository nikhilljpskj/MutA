import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.scss';
import TopNavBar from '../components/TopNavbar';
import LeftNavBar from '../components/LeftSidebar';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [availability, setAvailability] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          console.error('Unexpected data format for categories:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when categoryId changes
  useEffect(() => {
    if (categoryId) {
      const fetchSubCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/subcategories/category/${categoryId}`);
          // Ensure response.data is an array
          if (Array.isArray(response.data)) {
            setSubCategories(response.data);
          } else {
            console.error('Unexpected data format for subcategories:', response.data);
          }
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]); // Clear subcategories if no category is selected
    }
  }, [categoryId]);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('sub_category_id', subCategoryId);
    formData.append('price_per_day', pricePerDay);
    formData.append('availability', availability);
    formData.append('stock', stock);
    images.forEach((image) => formData.append('images', image));
  
    try {
      const response = await axios.post('http://localhost:5000/api/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      if (response.data.success) {
        alert('Product added successfully');
        window.location.reload(); // Reload the page on success
      } else {
        setError(response.data.message || 'Failed to add Product');
      }
    } catch (error) {
      console.error('Failed to add Product:', error);
      setError('Failed to add Product');
    }
  };
  


  return (
    <div className="add-product-page">
      <TopNavBar />
      <div className="page-container">
        <LeftNavBar />
        <div className="content">
          <h2>Add New Product</h2>
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
              <label htmlFor="subCategory">Subcategory:</label>
              <select
                id="subCategory"
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!categoryId}
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((subCat) => (
                  <option key={subCat.id} value={subCat.id}>
                    {subCat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="productName">Product Name:</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pricePerDay">Price Per Day:</label>
              <input
                type="number"
                id="pricePerDay"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                placeholder="Enter price per day"
              />
            </div>
            <div className="form-group">
              <label htmlFor="availability">Availability:</label>
              <input
                type="text"
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Enter availability status"
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock:</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter stock quantity"
              />
            </div>
            <div className="form-group">
              <label htmlFor="images">Product Images:</label>
              <input
                type="file"
                id="images"
                multiple
                onChange={(e) => setImages([...e.target.files])}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-submit">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
