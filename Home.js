import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api-infnet-produtos-privado.vercel.app/produtos', {
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIzNjVkIiwiaWF0IjoxNzI2ODY0NTQ4fQ.oQ6vlVpQEHwsq82736fY9I_OlXXBDyWYQoatf3rr6uk",
          },
        });
        
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'grid' ? 'list' : 'grid'));
  };

  return (
    <div className="home-container">
      <h1>Bem-vindo à Página Inicial!</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/create-product')}>Criar Produto</button>
      <button onClick={toggleViewMode}>
        Alternar para {viewMode === 'grid' ? 'Lista' : 'Grade'}
      </button>
      <h2>Lista de Produtos</h2>
      {loading ? (
        <p>Carregando produtos...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className={`product-list ${viewMode}`}>
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className={`product-item ${viewMode}`}>
                <h3>{product.nome}</h3>
                <p>Preço: R$ {product.preco}</p>
                <img src={product.url_imagem} alt={product.nome} />
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
