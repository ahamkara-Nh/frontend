import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total }) => {
    if (total <= 0) {
        return null; // Or some other placeholder/error
    }

    const segments = [];
    for (let i = 0; i < total; i++) {
        segments.push(
            <div
                key={i}
                className={`progress-segment ${i < current ? 'completed' : 'incomplete'}`}
            />
        );
    }

    return (
        <div className="progress-bar-container">
            {segments}
        </div>
    );
};

export default ProgressBar; 