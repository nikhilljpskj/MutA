import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewProducts.scss';
import TopNavBar from '../components/TopNavbar';
import LeftNavBar from '../components/LeftSidebar';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_day: '',
    availability: '',
    stock: '',
    image_urls: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  const handleView = (product) => {
    setSelectedProduct(product);
    setFormData(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, formData);
      setProducts(products.map(p => (p.id === selectedProduct.id ? formData : p)));
      setShowPopup(false);
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  return (
    <div className="view-products-page">
      <TopNavBar />
      <div className="page-container">
        <LeftNavBar />
        <div className="content">
          <h2>View Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price Per Day</th>
                  <th>Availability</th>
                  <th>Stock</th>
                  <th hidden>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price_per_day}</td>
                    <td>{product.availability}</td>
                    <td>{product.stock}</td>
                    <td className="product-images" >
                      {product.image_urls && product.image_urls.length > 0 ? (
                        product.image_urls.map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:5000${image}`}
                            alt={product.name}
                            className="product-image"
                          />
                        ))
                      ) : (
                        <p>No Images</p>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleView(product)}>View</button>
                      <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup">
                <h2>Update Product</h2>
                <form>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price_per_day">Price Per Day</label>
                    <input
                      id="price_per_day"
                      type="number"
                      value={formData.price_per_day}
                      onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <input
                      id="availability"
                      type="number"
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Images</label>
                    {formData.image_urls && formData.image_urls.length > 0 ? (
                      formData.image_urls.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000${image}`}
                          alt={`Image ${index}`}
                          className="product-image"
                        />
                      ))
                    ) : (
                      <p>No Images</p>
                    )}
                  </div>
                  <button className='btn-update' type="button" onClick={handleUpdate}>Update</button>
                  <button className='btn-close' type="button" onClick={handleClosePopup}>Close</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
