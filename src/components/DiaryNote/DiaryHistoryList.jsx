import React, { useState, useEffect } from 'react';
import DiaryHistoryNote from './DiaryHistoryNote';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
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

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="diary-error-message">{error}</div>;
    }

    if (diaryEntries.length === 0) {
        return <div className="diary-empty-message">Нет записей в дневнике</div>;
    }

    return (
        <div className="diary-history-list">
            {diaryEntries.map((entry) => (
                <DiaryHistoryNote key={`${entry.entry_type}-${entry.entry_id}`} entry={entry} />
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