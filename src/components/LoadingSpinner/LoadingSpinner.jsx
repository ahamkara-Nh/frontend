import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
    const spinnerClass = `loading-spinner ${size}`;

    return (
        <div className="spinner-container">
            <div className={spinnerClass}></div>
        </div>
    );
};

export default LoadingSpinner; 