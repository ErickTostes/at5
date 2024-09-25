import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);

    fetch('https://dummyjson.com/products')
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data.products);
      });
  }, []);

  const favoriteProducts = allProducts.filter(product => favorites.includes(product.id));

  return (
    <div className="favorites-container">
      <h1>Produtos Favoritos</h1>
      <div className="products-grid">
        {favoriteProducts.length > 0 ? (
          favoriteProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.thumbnail} alt={product.title} className="product-image" />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p><strong>Preço:</strong> ${product.price}</p>
            </div>
          ))
        ) : (
          <p>Nenhum produto favorito encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
