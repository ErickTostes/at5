import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetails.css';
import DeleteModal from './DeleteModal';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, [id]);

  const handleDelete = () => {
    fetch(`https://dummyjson.com/products/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setIsModalOpen(false);
      window.location.href = '/home';
    });
  };

  if (!product) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="product-details-container">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} className="product-details-image" />
      <p>{product.description}</p>
      <p><strong>Preço:</strong> ${product.price}</p>
      <p><strong>Categoria:</strong> {product.category}</p>
      <Link to={`/edit-product/${id}`}>Editar Produto</Link>
      <button onClick={() => setIsModalOpen(true)}>Excluir Produto</button>
      <DeleteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDelete={handleDelete} />
    </div>
  );
};

export default ProductDetails;
