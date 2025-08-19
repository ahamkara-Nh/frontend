import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { getBaseUrl } from '../../utils/api';
import './ReplacementMenu.css';

// Determine FODMAP level indicator type based on the highest FODMAP value
const determineFodmapLevel = (product) => {
    if (!product) return 'green';

    // If product has servings, find the highest FODMAP level across all servings
    if (product.servings && product.servings.length > 0) {
        let maxLevel = 0;

        // Check each serving
        product.servings.forEach(serving => {
            const fodmapLevels = [
                serving.fructose_level,
                serving.lactose_level,
                serving.fructan_level,
                serving.mannitol_level,
                serving.sorbitol_level,
                serving.gos_level
            ];

            const servingMaxLevel = Math.max(...fodmapLevels.filter(level => level !== undefined && level !== null));
            maxLevel = Math.max(maxLevel, servingMaxLevel);
        });

        if (maxLevel <= 1) {
            return 'green';
        } else if (maxLevel === 2) {
            return 'yellow';
        } else {
            return 'red';
        }
    }

    // If no servings, use the product's direct FODMAP levels
    const fodmapLevels = [
        product.fructose_level,
        product.lactose_level,
        product.fructan_level,
        product.mannitol_level,
        product.sorbitol_level,
        product.gos_level
    ];

    const maxLevel = Math.max(...fodmapLevels.filter(level => level !== undefined && level !== null));

    if (maxLevel <= 1) {
        return 'green';
    } else if (maxLevel === 2) {
        return 'yellow';
    } else {
        return 'red';
    }
};

const ReplacementMenu = ({ replacementName }) => {
    const navigate = useNavigate();
    const [replacementProduct, setReplacementProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReplacementProduct = async () => {
            if (!replacementName) return;

            setLoading(true);
            try {
                // Get Telegram user ID or use a default for development
                const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';
                const baseUrl = getBaseUrl();

                // Fetch replacement product data
                const response = await fetch(`${baseUrl}/products/get-by-name`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: replacementName,
                        telegramId: telegramId
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();

                // Handle the API response format
                if (data.products && Array.isArray(data.products) && data.products.length > 0) {
                    setReplacementProduct(data.products[0]);
                } else if (data.product) {
                    setReplacementProduct(data.product);
                } else {
                    setReplacementProduct(data);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching replacement product:', err);
                setError('Failed to load replacement product.');
                setLoading(false);
            }
        };

        fetchReplacementProduct();
    }, [replacementName]);

    // Handle clicking on a replacement item
    const handleReplacementClick = () => {
        if (!replacementProduct) return;

        // Navigate to the replacement product detail page
        navigate(`/products/${replacementProduct.product_id}`, {
            state: { productName: replacementProduct.name }
        });
    };

    if (!replacementName || error) {
        return null;
    }

    return (
        <div className="replacement-menu-container">
            <div className="replacement-title">Возможная замена</div>

            {loading ? (
                <LoadingSpinner size="medium" />
            ) : replacementProduct ? (
                <>
                    <div className="replacement-items">
                        <div className="replacement-item" onClick={handleReplacementClick}>
                            <span className="replacement-name">{replacementProduct.name}</span>
                            <div className={`replacement-indicator ${determineFodmapLevel(replacementProduct)}`}></div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default ReplacementMenu; 