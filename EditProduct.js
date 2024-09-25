import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({ title: '', description: '', price: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://dummyjson.com/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    }).then(() => {
      navigate('/home');
    });
  };

  return (
    <div className="edit-product-container">
      <h1>Editar Produto</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input type="text" name="title" value={product.title} onChange={handleChange} required />
        </label>
        <label>
          Descrição:
          <textarea name="description" value={product.description} onChange={handleChange} required />
        </label>
        <label>
          Preço:
          <input type="number" name="price" value={product.price} onChange={handleChange} required />
        </label>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default EditProduct;
