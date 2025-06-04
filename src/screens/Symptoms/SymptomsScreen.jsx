import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SymptomsScreen.css';
import symptomIcon1 from '../../assets/images/symptom1.png';
import symptomIcon2 from '../../assets/images/symptom2.png';
import symptomIcon3 from '../../assets/images/symptom3.png';
import symptomIcon4 from '../../assets/images/symptom4.png';

const SymptomsScreen = () => {
    const navigate = useNavigate();
    const [note, setNote] = useState('');
    const [symptoms, setSymptoms] = useState({
        bloating: 0,
        pain: 0,
        gas: 0,
        stool: 0
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.show();
            tg.BackButton.onClick(handleCancel);
        }

        // Cleanup
        return () => {
            if (tg) {
                tg.BackButton.hide();
                tg.BackButton.offClick(handleCancel);
            }
        };
    }, [handleCancel]);

    const getSeverityColor = (value) => {
        if (value <= 2) return 'green';
        if (value <= 6) return 'yellow';
        return 'red';
    };

    const handleSymptomChange = (symptom, value) => {
        setSymptoms(prev => ({
            ...prev,
            [symptom]: value
        }));
    };

    const handleSave = async () => {
        // Get Telegram user ID
        const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        if (!telegramId) {
            setError('User ID not available');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/users/${telegramId}/symptoms-diary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wind_level: symptoms.gas,
                    bloat_level: symptoms.bloating,
                    pain_level: symptoms.pain,
                    stool_level: symptoms.stool,
                    notes: note.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to save symptoms');
            }

            // Navigate back after successful save
            navigate(-1);
        } catch (err) {
            console.error('Error saving symptoms:', err);
            setError(err.message || 'Failed to save symptoms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentDate = () => {
        const options = { day: 'numeric', month: 'long' };
        return new Date().toLocaleDateString('ru-RU', options);
    };

    return (
        <div className="symptoms-container">
            {error && <div className="error-message">{error}</div>}
            <div className="symptoms-header">
                <span className="date">{getCurrentDate()}</span>
                <span className="new-record">новая запись</span>
            </div>

            <div className="symptoms-section">
                <h2>Симптомы:</h2>

                {/* Bloating Symptom */}
                <div className="symptom-item">
                    <div className="symptom-name">
                        <img src={symptomIcon1} alt="Symptom" className="symptom-icon" />
                        <p>Насколько сильным было вздутие живота?</p>
                    </div>
                    <div className="symptom-slider">
                        <div className="slider-labels">
                            <span>нет вздутия</span>
                            <span>очень сильное вздутие</span>
                        </div>
                        <div className="number-slider">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                    key={num}
                                    className={`number-button ${symptoms.bloating >= num ? `active ${getSeverityColor(symptoms.bloating)}` : ''}`}
                                    onClick={() => handleSymptomChange('bloating', num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="divider"></div>

                {/* Pain Symptom */}
                <div className="symptom-item">
                    <div className="symptom-name">
                        <img src={symptomIcon2} alt="Symptom" className="symptom-icon" />
                        <p>Насколько сильной была боль в животе?</p>
                    </div>
                    <div className="symptom-slider">
                        <div className="slider-labels">
                            <span>нет боли</span>
                            <span>очень сильная боль</span>
                        </div>
                        <div className="number-slider">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                    key={num}
                                    className={`number-button ${symptoms.pain >= num ? `active ${getSeverityColor(symptoms.pain)}` : ''}`}
                                    onClick={() => handleSymptomChange('pain', num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="divider"></div>

                {/* Gas Symptom */}
                <div className="symptom-item">
                    <div className="symptom-name">
                        <img src={symptomIcon3} alt="Symptom" className="symptom-icon" />
                        <p>Насколько выраженным было повышенное газообразование?</p>
                    </div>
                    <div className="symptom-slider">
                        <div className="slider-labels">
                            <span>нет избыточных газов</span>
                            <span>очень сильное газообразование</span>
                        </div>
                        <div className="number-slider">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                    key={num}
                                    className={`number-button ${symptoms.gas >= num ? `active ${getSeverityColor(symptoms.gas)}` : ''}`}
                                    onClick={() => handleSymptomChange('gas', num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="divider"></div>

                {/* Stool Symptom */}
                <div className="symptom-item">
                    <div className="symptom-name">
                        <img src={symptomIcon4} alt="Symptom" className="symptom-icon" />
                        <p>Насколько сильно выражено послабление стула?</p>
                    </div>
                    <div className="symptom-slider">
                        <div className="slider-labels">
                            <span>нормальный, оформленный стул</span>
                            <span>водянистый стул / сильная диарея</span>
                        </div>
                        <div className="number-slider">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                    key={num}
                                    className={`number-button ${symptoms.stool >= num ? `active ${getSeverityColor(symptoms.stool)}` : ''}`}
                                    onClick={() => handleSymptomChange('stool', num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="note-section">
                <h2>Заметка:</h2>
                <div className="note-input">
                    <textarea
                        placeholder="Ваш текст ..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
            </div>

            <div className="action-buttons">
                <button className="cancel-button" onClick={handleCancel} disabled={loading}>
                    Отмена
                </button>
                <button className="save-button" onClick={handleSave} disabled={loading}>
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
            </div>
        </div>
    );
};

export default SymptomsScreen; 