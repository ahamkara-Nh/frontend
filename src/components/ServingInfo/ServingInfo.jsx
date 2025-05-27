import React from 'react';
import './ServingInfo.css';

// Map FODMAP names to their Russian translations
const FODMAP_NAMES = {
    'fructose': 'Фруктоза',
    'lactose': 'Лактоза',
    'mannitol': 'Маннитол',
    'sorbitol': 'Сорбитол',
    'gos': 'ГОС',
    'fructan': 'Фруктаны'
};

// Determine FODMAP level indicator type based on the level value
const determineFodmapLevelType = (level, isUserCreated) => {
    // Default to green if level is undefined or null
    if (level === undefined || level === null) return 'green';

    if (isUserCreated) {
        // For user-created products, the scale is reversed:
        // 0 - high (red), 1 - medium (yellow), 2 - low (green)
        if (level === 0) {
            return 'red';
        } else if (level === 1) {
            return 'yellow';
        } else {
            return 'green';
        }
    } else {
        // For regular products: ≤1 - low (green), 2 - medium (yellow), >2 - high (red)
        if (level <= 1) {
            return 'green';
        } else if (level === 2) {
            return 'yellow';
        } else {
            return 'red';
        }
    }
};

// Get a safe value for the level, defaulting to 1 (green) if undefined
const getSafeLevel = (level) => {
    return level === undefined || level === null ? 1 : level;
};

const ServingInfo = ({ servings, selectedServing, onSelectServing, isUserCreated = false }) => {
    if (!servings || servings.length === 0 || !selectedServing) {
        return null;
    }

    // Create an array of FODMAP indicators with safe values
    const fodmapIndicators = [
        { name: 'fructose', level: getSafeLevel(selectedServing.fructose_level) },
        { name: 'lactose', level: getSafeLevel(selectedServing.lactose_level) },
        { name: 'mannitol', level: getSafeLevel(selectedServing.mannitol_level) },
        { name: 'sorbitol', level: getSafeLevel(selectedServing.sorbitol_level) },
        { name: 'gos', level: getSafeLevel(selectedServing.gos_level) },
        { name: 'fructan', level: getSafeLevel(selectedServing.fructan_level) }
    ];

    // Get the serving size with a fallback
    const displayServingSize = selectedServing.serving_size || "1 порция";

    return (
        <div className="serving-info-container">
            <div className="fodmap-indicators">
                {fodmapIndicators.map((fodmap) => (
                    <div className="fodmap-item" key={fodmap.name}>
                        <div className={`fodmap-indicator ${determineFodmapLevelType(fodmap.level, isUserCreated)}`}></div>
                        <span className="fodmap-name">{FODMAP_NAMES[fodmap.name]}</span>
                    </div>
                ))}
            </div>
            {servings.length > 1 ? (
                <div className="serving-selector">
                    {servings.map((serving) => (
                        <div
                            key={serving.serving_id}
                            className={`serving-option ${selectedServing.serving_id === serving.serving_id ? 'active' : ''}`}
                            onClick={() => onSelectServing(serving)}
                        >
                            {serving.serving_size || "1 порция"}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="serving-size">{displayServingSize}</div>
            )}

        </div>
    );
};

export default ServingInfo; 