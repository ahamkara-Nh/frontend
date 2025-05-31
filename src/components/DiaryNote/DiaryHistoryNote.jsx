import React from 'react';
import './DiaryHistoryNote.css';
import calendarIcon from '../../assets/icons/calendar-icon.svg';

const DiaryHistoryNote = ({ entry, showDate = true }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';

        // Parse the UTC date string and convert to local timezone
        const date = new Date(dateString);

        // Format the date in Russian
        const options = { day: 'numeric', month: 'long', timeZone: 'UTC' };
        try {
            // First convert UTC to local time
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return localDate.toLocaleDateString('ru-RU', options);
        } catch (error) {
            // Fallback if Russian locale is not available
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            return localDate.toLocaleDateString(undefined, options);
        }
    };

    // Format time from ISO date string (2025-05-31 11:36:42)
    const formatTime = (dateString) => {
        if (!dateString) return '';

        // Parse the UTC date string and format in local timezone
        const date = new Date(dateString + (dateString.includes('Z') ? '' : 'Z'));
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Function to determine the color class based on the level (1-10)
    const getLevelColorClass = (level) => {
        if (level <= 3) return 'level-low';
        if (level <= 6) return 'level-medium';
        return 'level-high';
    };

    // Function to determine the color class based on FODMAP level (1-3)
    const getFodmapColorClass = (level) => {
        if (level === 1) return 'fodmap-low';
        if (level === 2) return 'fodmap-medium';
        return 'fodmap-high';
    };

    // Check if this is a symptoms entry
    const isSymptomsEntry = entry.entry_type === 'symptoms_diary';

    // Check if this is a food entry
    const isFoodEntry = entry.entry_type === 'food_note';

    return (
        <div className="diary-history-note">
            {showDate && (
                <div className="note-date">
                    <span className="date-text">{formatDate(entry.created_at)}</span>
                    <img src={calendarIcon} alt="Calendar" className="calendar-icon" />
                </div>
            )}

            {isSymptomsEntry && (
                <div className="symptoms-row">
                    <div className="row-header">
                        <span className="header-text">Симптомы</span>
                        <span className="time-text">{formatTime(entry.created_at)}</span>
                    </div>
                    <div className="symptoms-container-diary">
                        {entry.bloat_level !== undefined && (
                            <div className="symptom">
                                <div className={`level-indicator ${getLevelColorClass(entry.bloat_level)}`}>
                                    <span>{entry.bloat_level}</span>
                                </div>
                                <span className="symptom-name-diary">Вздутие</span>
                            </div>
                        )}
                        {entry.wind_level !== undefined && (
                            <div className="symptom">
                                <div className={`level-indicator ${getLevelColorClass(entry.wind_level)}`}>
                                    <span>{entry.wind_level}</span>
                                </div>
                                <span className="symptom-name-diary">Газообразование</span>
                            </div>
                        )}
                        {entry.pain_level !== undefined && (
                            <div className="symptom">
                                <div className={`level-indicator ${getLevelColorClass(entry.pain_level)}`}>
                                    <span>{entry.pain_level}</span>
                                </div>
                                <span className="symptom-name-diary">Боль</span>
                            </div>
                        )}
                        {entry.stool_level !== undefined && (
                            <div className="symptom">
                                <div className={`level-indicator ${getLevelColorClass(entry.stool_level)}`}>
                                    <span>{entry.stool_level}</span>
                                </div>
                                <span className="symptom-name-diary">Послабление стула</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isSymptomsEntry && isFoodEntry && <div className="divider-diary"></div>}

            {isFoodEntry && entry.food_items && entry.food_items.length > 0 && entry.food_items.map((foodItem, foodIndex) => (
                <div key={foodItem.list_item_id} className="food-row">
                    <div className="row-header">
                        <span className="header-text">{foodItem.name}</span>
                        <span className="time-text">{formatTime(entry.created_at)}</span>
                    </div>
                    <div className="fodmap-container">
                        {foodItem.fructose_level > 0 && (
                            <div className="fodmap-item">
                                <div className={`fodmap-indicator ${getFodmapColorClass(foodItem.fructose_level)}`}></div>
                                <span className="fodmap-name">Фруктоза</span>
                            </div>
                        )}
                        {foodItem.lactose_level > 0 && (
                            <div className="fodmap-item">
                                <div className={`fodmap-indicator ${getFodmapColorClass(foodItem.lactose_level)}`}></div>
                                <span className="fodmap-name">Лактоза</span>
                            </div>
                        )}
                        {foodItem.fructan_level > 0 && (
                            <div className="fodmap-item">
                                <div className={`fodmap-indicator ${getFodmapColorClass(foodItem.fructan_level)}`}></div>
                                <span className="fodmap-name">Фруктаны</span>
                            </div>
                        )}
                        {foodItem.mannitol_level > 0 && (
                            <div className="fodmap-item">
                                <div className={`fodmap-indicator ${getFodmapColorClass(foodItem.mannitol_level)}`}></div>
                                <span className="fodmap-name">Маннитол</span>
                            </div>
                        )}
                        {foodItem.sorbitol_level > 0 && (
                            <div className="fodmap-item">
                                <div className={`fodmap-indicator ${getFodmapColorClass(foodItem.sorbitol_level)}`}></div>
                                <span className="fodmap-name">Сорбитол</span>
                            </div>
                        )}
                        {foodItem.gos_level > 0 && (
                            <div className="fodmap-item">
                                <div className={`fodmap-indicator ${getFodmapColorClass(foodItem.gos_level)}`}></div>
                                <span className="fodmap-name">ГОС</span>
                            </div>
                        )}
                    </div>
                    {foodIndex < entry.food_items.length - 1 && <div className="divider food-divider"></div>}
                </div>
            ))}
        </div>
    );
};

export default DiaryHistoryNote; 