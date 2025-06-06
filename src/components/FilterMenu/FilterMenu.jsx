import React, { useState, useEffect } from 'react';
import './FilterMenu.css';

const FilterMenu = ({ isOpen, onClose }) => {
    // console.log('[FilterMenu] Props received - isOpen:', isOpen);
    const [activeLevels, setActiveLevels] = useState({}); // State to track active level per category
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fodmapCategories = [
        { id: 'fructose', name: 'Фруктоза' },
        { id: 'lactose', name: 'Лактоза' },
        { id: 'mannitol', name: 'Маннитол' },
        { id: 'sorbitol', name: 'Сорбитол' },
        { id: 'gos', name: 'ГОС' },
        { id: 'fructans', name: 'Фруктаны' },
    ];

    const levels = [
        { id: 0, style_class: 'level-dot-active-indicator' }, // Gray (default)
        { id: 1, style_class: 'level-dot-green' },   // Green gradient
        { id: 2, style_class: 'level-dot-yellow' },  // Yellow gradient
        { id: 3, style_class: 'level-dot-red' },     // Red gradient
    ];

    // Get Telegram user ID
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    // Fetch user preferences when menu opens
    useEffect(() => {
        const fetchPreferences = async () => {
            if (!isOpen || !telegramId) return;

            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/users/${telegramId}/preferences`);

                if (!response.ok) {
                    throw new Error('Failed to fetch preferences');
                }

                const data = await response.json();
                const preferences = data.preferences;

                // Map preferences to active levels
                setActiveLevels({
                    fructose: preferences.fructose_filter_level,
                    lactose: preferences.lactose_filter_level,
                    fructans: preferences.fructan_filter_level,
                    mannitol: preferences.mannitol_filter_level,
                    sorbitol: preferences.sorbitol_filter_level,
                    gos: preferences.gos_filter_level,
                });
            } catch (err) {
                console.error('Error fetching preferences:', err);
                setError('Failed to load preferences');
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [isOpen, telegramId]);

    if (!isOpen) {
        // console.log('[FilterMenu] Not rendering because isOpen is false.');
        return null;
    }
    // console.log('[FilterMenu] Rendering because isOpen is true. Active levels:', activeLevels);

    const handleLevelSelect = async (fodmapId, levelId) => {
        if (!telegramId) {
            setError('User ID not available');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Update local state immediately for better UX
            setActiveLevels(prev => ({
                ...prev,
                [fodmapId]: levelId
            }));

            // Prepare the update payload
            const payload = {
                fructose_filter_level: fodmapId === 'fructose' ? levelId : activeLevels.fructose,
                lactose_filter_level: fodmapId === 'lactose' ? levelId : activeLevels.lactose,
                fructan_filter_level: fodmapId === 'fructans' ? levelId : activeLevels.fructans,
                mannitol_filter_level: fodmapId === 'mannitol' ? levelId : activeLevels.mannitol,
                sorbitol_filter_level: fodmapId === 'sorbitol' ? levelId : activeLevels.sorbitol,
                gos_filter_level: fodmapId === 'gos' ? levelId : activeLevels.gos,
            };

            // Send update to backend
            const response = await fetch(`/users/${telegramId}/preferences/fodmap`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to update preferences');
            }
        } catch (err) {
            console.error('Error updating preferences:', err);
            setError('Failed to update preferences');

            // Revert the local state change on error
            setActiveLevels(prev => ({
                ...prev,
                [fodmapId]: prev[fodmapId]
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleAutoFilter = async () => {
        if (!telegramId) {
            setError('User ID not available');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Step 1: Check current phase
            const phaseResponse = await fetch(`/users/${telegramId}/phase-tracking`);
            if (!phaseResponse.ok) {
                throw new Error('Failed to fetch user phase');
            }

            const phaseData = await phaseResponse.json();
            const currentPhase = phaseData.current_phase;

            let newLevels = {
                fructose: 0,
                lactose: 0,
                fructans: 0,
                mannitol: 0,
                sorbitol: 0,
                gos: 0,
            };

            // Apply filter logic based on current phase
            if (currentPhase === 0) {
                // Phase 0: Do nothing, keep all filters at default
            }
            else if (currentPhase === 1) {
                // Phase 1: Set all filters to level 1 (green)
                newLevels = {
                    fructose: 1,
                    lactose: 1,
                    fructans: 1,
                    mannitol: 1,
                    sorbitol: 1,
                    gos: 1,
                };
            }
            else if (currentPhase === 2) {
                // Phase 2: Check current_group and set only that group to level 3
                const phase2Response = await fetch(`/users/${telegramId}/phase2-tracking`);
                if (!phase2Response.ok) {
                    throw new Error('Failed to fetch phase 2 tracking data');
                }

                const phase2Data = await phase2Response.json();
                const currentGroup = phase2Data.current_group;

                // Set the current test group to level 3, others to 0
                if (currentGroup && Object.keys(newLevels).includes(currentGroup)) {
                    newLevels[currentGroup] = 3;
                }
            }
            else if (currentPhase === 3) {
                // Phase 3: Check each group's value and set level 1 for groups with value 3
                const phase2Response = await fetch(`/users/${telegramId}/phase2-tracking`);
                if (!phase2Response.ok) {
                    throw new Error('Failed to fetch phase 2 tracking data');
                }

                const phase2Data = await phase2Response.json();

                // For each group that has value 3, set filter to level 1
                Object.keys(newLevels).forEach(group => {
                    // Handle the special case for fructans vs fructan naming difference
                    const apiKey = group === 'fructans' ? 'fructan' : group;
                    if (phase2Data[apiKey] === 3) {
                        newLevels[group] = 1;
                    }
                });
            }

            // Update local state
            setActiveLevels(newLevels);

            // Send update to backend
            const response = await fetch(`/users/${telegramId}/preferences/fodmap`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fructose_filter_level: newLevels.fructose,
                    lactose_filter_level: newLevels.lactose,
                    fructan_filter_level: newLevels.fructans,
                    mannitol_filter_level: newLevels.mannitol,
                    sorbitol_filter_level: newLevels.sorbitol,
                    gos_filter_level: newLevels.gos,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update preferences');
            }
        } catch (err) {
            console.error('Error updating preferences:', err);
            setError('Failed to auto-configure filter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`filter-menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className="filter-menu-container" onClick={(e) => e.stopPropagation()}>
                <div className="filter-menu-header">
                    {error && <div className="error-message">{error}</div>}
                </div>
                <div className="filter-menu-actions">
                    <button
                        className="save-filter-button"
                        onClick={handleAutoFilter}
                        disabled={loading}
                    >
                        {loading ? 'Настройка...' : 'Автоматически настроить фильтр'}
                    </button>
                </div>
                <div className="fodmap-picker-list">
                    {fodmapCategories.map((category) => (
                        <div key={category.id} className="fodmap-picker-row">
                            <span className="fodmap-name">{category.name}</span>
                            <div className="level-picker">
                                {levels.map((level) => {
                                    const isSelected = activeLevels[category.id] === level.id;
                                    return (
                                        <div
                                            key={level.id}
                                            className={`level-dot ${level.style_class} ${isSelected ? 'selected' : ''}`}
                                            onClick={() => !loading && handleLevelSelect(category.id, level.id)}
                                            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                                        >
                                            {isSelected && (
                                                <img
                                                    src={level.style_class === 'level-dot-active-indicator'
                                                        ? "/icons/level-active-check.svg"
                                                        : "/icons/level-active-check-black.svg"}
                                                    alt="selected"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterMenu; 