import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductItem.css';

const ProductItem = ({ id, name, type, isUserCreated }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        // For user-created products, we'll pass additional state to indicate it's a user product
        navigate(`/products/${id}`, {
            state: {
                productName: name,
                isUserCreated: isUserCreated || location.pathname.includes('/lists/user_created')
            }
        });
    };

    return (
        <div className="product-item" onClick={handleClick}>
            <div className="product-info">
                <span className="product-name">{name}</span>
            </div>
            <div className={`product-indicator ${type}`}></div>
        </div>
    );
};

export default ProductItem; 