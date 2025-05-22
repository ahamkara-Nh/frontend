import React from 'react';
import './ProductItem.css';

const ProductItem = ({ name, type }) => {
    return (
        <div className="product-item">
            <div className="product-info">
                <span className="product-name">{name}</span>
            </div>
            <div className={`product-indicator ${type}`}></div>
        </div>
    );
};

export default ProductItem; 