import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import './MyProductsScreen.css';
import list1Icon from '../../assets/icons/list-1-icon.svg';
import list2Icon from '../../assets/icons/list-2-icon.svg';
import list3Icon from '../../assets/icons/list-3-icon.svg';
import favoritesIcon from '../../assets/icons/favorites-icon.svg';
import myProductsIcon from '../../assets/icons/my-products-icon.svg';
import plusIcon from '../../assets/icons/plus_icon.svg';

const MyProductsScreen = () => {
    const navigate = useNavigate();

    const handleAddProduct = () => {
        // TODO: Implement add product functionality
        console.log('Add product clicked');
    };

    const categories = [
        { id: 1, name: 'Список - 1 этап', icon: list1Icon },
        { id: 2, name: 'Список - 2 этап', icon: list2Icon },
        { id: 3, name: 'Список - 3 этап', icon: list3Icon },
        { id: 4, name: 'Избранное', icon: favoritesIcon },
        { id: 5, name: 'Мои продукты', icon: myProductsIcon },
    ];

    return (
        <div className="my-products-screen">
            <div className="my-products-content">
                <button className="add-product-button" onClick={handleAddProduct}>
                    <span>Добавить свой продукт</span>
                </button>

                <div className="category-grid">
                    {categories.map((category) => (
                        <div key={category.id} className="category-button">
                            <img src={category.icon} alt={category.name} className="category-icon" />
                            <span className="category-name">{category.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="nav-spacer"></div>
            <BottomNavBar />
        </div>
    );
};

export default MyProductsScreen; 