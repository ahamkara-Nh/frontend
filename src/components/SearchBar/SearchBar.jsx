import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery, placeholder }) => {
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder={placeholder || "Поиск..."}
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
            />
            <img src="/icons/search-icon.svg" alt="Search" className="search-icon" />
        </div>
    );
};

export default SearchBar; 