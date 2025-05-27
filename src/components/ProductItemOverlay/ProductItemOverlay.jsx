import React from 'react';
import './ProductItemOverlay.css';

const ProductItemOverlay = ({ name, type, onClick }) => {
    return (
        <div className="product-item-overlay" onClick={onClick}>
            <div className="product-info-overlay">
                <span className="product-name-overlay">{name}</span>
            </div>
            <div className={`product-indicator-overlay ${type}`}></div>
        </div>
    );
};

export default ProductItemOverlay; 