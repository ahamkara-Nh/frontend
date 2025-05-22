import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductItem.css';

const ProductItem = ({ id, name, type }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products/${id}`, {
            state: { productName: name }
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