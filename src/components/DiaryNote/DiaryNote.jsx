import React from 'react';
import './DiaryNote.css';
import calendarIcon from '../../assets/icons/calendar-icon.svg';

const DiaryNote = ({ date, isEmpty = true, children }) => {
    const formatDate = (dateString) => {
        // If a date is provided, use it, otherwise use current date
        const dateToFormat = dateString ? new Date(dateString) : new Date();

        // Format the date in Russian
        const options = { day: 'numeric', month: 'long' };
        try {
            return dateToFormat.toLocaleDateString('ru-RU', options);
        } catch (error) {
            // Fallback if Russian locale is not available
            return dateToFormat.toLocaleDateString(undefined, options);
        }
    };

    return (
        <div className="diary-note-container">
            <div className="note-date">
                <span className="date-text">{formatDate(date)}</span>
                <img src={calendarIcon} alt="Calendar" className="calendar-icon" />
            </div>

            {isEmpty ? (
                <p className="empty-note-text">Здесь пока ничего нет (˘･_･˘)</p>
            ) : (
                <div className="note-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export default DiaryNote; 
