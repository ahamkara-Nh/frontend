import React, { useState, useEffect } from 'react';
import DiaryHistoryNote from './DiaryHistoryNote';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import calendarIcon from '../../assets/icons/calendar-icon.svg';
import './DiaryHistoryList.css';

const DiaryHistoryList = ({ telegramId }) => {
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchDiaryHistory();
    }, [telegramId, currentPage]);

    const fetchDiaryHistory = async () => {
        if (!telegramId) {
            setError('Telegram ID is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`/users/${telegramId}/diary-history?page=${currentPage}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch diary history: ${response.status}`);
            }

            const data = await response.json();

            setDiaryEntries(data.entries || []);
            setTotalPages(data.total_pages || 1);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching diary history:', err);
            setError('Failed to load diary history. Please try again later.');
            setLoading(false);
        }
    };

    const loadNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const loadPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Format date with timezone adjustment
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

    // Group entries by date
    const groupEntriesByDate = (entries) => {
        const groups = {};

        entries.forEach(entry => {
            // Extract just the date part (YYYY-MM-DD) from the created_at timestamp
            const dateOnly = entry.created_at.split(' ')[0];

            if (!groups[dateOnly]) {
                groups[dateOnly] = [];
            }

            groups[dateOnly].push(entry);
        });

        // Convert the groups object to an array of objects with date and entries
        return Object.keys(groups).map(date => ({
            date,
            entries: groups[date]
        }));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="diary-error-message">{error}</div>;
    }

    if (diaryEntries.length === 0) {
        return <div className="diary-empty-message">Нет записей в дневнике</div>;
    }

    // Group the entries by date
    const groupedEntries = groupEntriesByDate(diaryEntries);

    return (
        <div className="diary-history-list">
            {groupedEntries.map((group, groupIndex) => (
                <div key={group.date} className="diary-date-group">
                    <div className="note-date">
                        <span className="date-text">
                            {formatDate(group.date)}
                        </span>
                        <img src={calendarIcon} alt="Calendar" className="calendar-icon" />
                    </div>

                    {group.entries.map((entry, entryIndex) => (
                        <React.Fragment key={`${entry.entry_type}-${entry.entry_id}`}>
                            <DiaryHistoryNote
                                entry={entry}
                                showDate={false}
                            />
                            {entryIndex < group.entries.length - 1 && <div className="divider-diary"></div>}
                        </React.Fragment>
                    ))}

                    {groupIndex < groupedEntries.length - 1 && <div className="divider-diary"></div>}
                </div>
            ))}

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        className="pagination-button"
                        onClick={loadPreviousPage}
                        disabled={currentPage === 1}
                    >
                        Назад
                    </button>
                    <span className="pagination-info">
                        {currentPage} из {totalPages}
                    </span>
                    <button
                        className="pagination-button"
                        onClick={loadNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
};

export default DiaryHistoryList; 