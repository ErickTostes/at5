import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ setIsAuthenticated }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const response = await fetch('https://api-infnet-produtos-privado.vercel.app/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@admin.com',
          password: '123456',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        fetchProducts(data.token);
      }
    };

    const fetchProducts = async (token) => {
      const response = await fetch('https://api-infnet-produtos-privado.vercel.app/produtos', {
        method: 'GET',
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIzNjVkIiwiaWF0IjoxNzI2ODY0NTQ4fQ.oQ6vlVpQEHwsq82736fY9I_OlXXBDyWYQoatf3rr6uk",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
      }
    };

    authenticate();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToFavorites = () => {
    navigate('/favorites');
  };

  const toggleFavorite = (productId) => {
    let updatedFavorites;
    if (favorites.includes(productId)) {
      updatedFavorites = favorites.filter(id => id !== productId);
    } else {
      updatedFavorites = [...favorites, productId];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="home-container">
      <h1>Catálogo de Produtos</h1>
      <div className="home-buttons">
        <button onClick={goToProfile}>Perfil</button>
        <button onClick={goToFavorites}>Favoritos</button>
        <button onClick={handleLogout}>Sair</button>
        <button onClick={toggleViewMode}>
          Mudar para {viewMode === 'grid' ? 'Lista' : 'Grade'}
        </button>
        <button onClick={() => navigate('/create-product')}>Criar Produto</button>
      </div>
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className={`products-container ${viewMode}`}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.url_imagem} alt={product.nome} className="product-image" />
            <h3>{product.nome}</h3>
            <p>{product.descricao}</p>
            <p><strong>Preço:</strong> ${product.preco}</p>
            <button onClick={() => toggleFavorite(product.id)}>
              {favorites.includes(product.id) ? 'Desmarcar Favorito' : 'Marcar como Favorito'}
            </button>
            <button onClick={() => navigate(`/products/${product.id}`)}>Ver Detalhes</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
