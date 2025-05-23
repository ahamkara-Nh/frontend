import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import ProductItem from '../../components/ProductItem/ProductItem';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ProductListScreen.css';

const ProductListScreen = () => {
    const { listType } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const listTypeToTitle = {
        'phase1': 'Список - 1 этап',
        'phase2': 'Список - 2 этап',
        'phase3': 'Список - 3 этап',
        'favourites': 'Избранное',
        'user_created': 'Мои продукты'
    };

    // Determine FODMAP level indicator type based on the highest FODMAP value
    const determineFodmapLevel = (product) => {
        const fodmapLevels = [
            product.fructose_level,
            product.lactose_level,
            product.fructan_level,
            product.mannitol_level,
            product.sorbitol_level,
            product.gos_level
        ];

        const maxLevel = Math.max(...fodmapLevels);

        if (maxLevel <= 1) {
            return 'green';
        } else if (maxLevel === 2) {
            return 'yellow';
        } else {
            return 'red';
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
                if (!telegramId) {
                    throw new Error('Telegram user ID not found');
                }

                const response = await fetch(`/users/${telegramId}/lists/${listType}/items`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [listType]);

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        const handleBack = () => {
            navigate(-1);
        };

        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.onEvent('backButtonClicked', handleBack);

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', handleBack);
            };
        }
    }, [navigate]);

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h1 className="product-list-title">{listTypeToTitle[listType] || 'Список продуктов'}</h1>
            </div>

            <div className="product-list-content">
                {loading ? (
                    <LoadingSpinner size="large" />
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : products.length > 0 ? (
                    <div className="products-list">
                        {products.map(product => (
                            <ProductItem
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                type={determineFodmapLevel(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-message">
                        <p>В этом списке пока нет продуктов</p>
                        <p>Добавьте продукты из каталога или создайте свои</p>
                    </div>
                )}
            </div>

            <div className="nav-spacer"></div>
            <BottomNavBar />
        </div>
    );
};

export default ProductListScreen; 