import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SymptomsScreen.css';
import symptomIcon from '../../assets/images/symptom_icon.png';

const SymptomsScreen = () => {
    const navigate = useNavigate();
    const [note, setNote] = useState('');
    const [symptoms, setSymptoms] = useState({
        bloating: 0,
        pain: 0,
        gas: 0,
        stool: 0
    });

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

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving symptoms:', { symptoms, note });
        navigate(-1);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const getCurrentDate = () => {
        const options = { day: 'numeric', month: 'long' };
        return new Date().toLocaleDateString('ru-RU', options);
    };

    return (
        <div className="symptoms-container">
            <div className="symptoms-header">
                <span className="date">{getCurrentDate()}</span>
                <span className="new-record">новая запись</span>
            </div>


            <div className="symptoms-section">
                <h2>Симптомы:</h2>

                {/* Bloating Symptom */}
                <div className="symptom-item">
                    <div className="symptom-name">
                        <img src={symptomIcon} alt="Symptom" className="symptom-icon" />
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
                        <img src={symptomIcon} alt="Symptom" className="symptom-icon" />
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
                        <img src={symptomIcon} alt="Symptom" className="symptom-icon" />
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
                        <img src={symptomIcon} alt="Symptom" className="symptom-icon" />
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
                <button className="cancel-button" onClick={handleCancel}>
                    Отмена
                </button>
                <button className="save-button" onClick={handleSave}>
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default SymptomsScreen; 