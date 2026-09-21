import React, { useState } from 'react';
import type { ClickUpConfig, AIConfig } from '../types';
import './ClickUpSettings.css';

interface SettingsProps {
    clickUpConfig: ClickUpConfig | null;
    aiConfig: AIConfig | null;
    onSaveClickUp: (config: ClickUpConfig) => void;
    onSaveAI: (config: AIConfig) => void;
    onClose: () => void;
}

const ClickUpSettings: React.FC<SettingsProps> = ({
    clickUpConfig,
    aiConfig,
    onSaveClickUp,
    onSaveAI,
    onClose
}) => {
    const [clickUpData, setClickUpData] = useState<ClickUpConfig>({
        apiKey: clickUpConfig?.apiKey || '',
        workspaceId: clickUpConfig?.workspaceId || '',
        listId: clickUpConfig?.listId || '',
    });

    const [aiData, setAiData] = useState<AIConfig>({
        deepSeekKey: aiConfig?.deepSeekKey || '',
        enabled: aiConfig?.enabled ?? true,
    });

    const handleSaveClickUp = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveClickUp(clickUpData);
    };

    const handleSaveAI = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveAI(aiData);
    };

    return (
        <div className="settings-overlay fade-in">
            <div className="settings-modal glass-card">
                <div className="settings-header">
                    <h2>ClickUp Integration Settings</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                <div className="settings-content">
                    <form onSubmit={handleSaveClickUp}>
                        <h3>ClickUp Integration</h3>
                        <div className="form-group">
                            <label className="label">ClickUp API Token</label>
                            <input
                                type="password"
                                className="input"
                                value={clickUpData.apiKey}
                                onChange={(e) => setClickUpData({ ...clickUpData, apiKey: e.target.value.trim() })}
                                placeholder="pk_12345678_..."
                                required
                            />
                            <p className="help-text">
                                Settings {'>'} Apps {'>'} API Token.
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="label">ClickUp List ID</label>
                            <input
                                type="text"
                                className="input"
                                value={clickUpData.listId}
                                onChange={(e) => setClickUpData({ ...clickUpData, listId: e.target.value.trim() })}
                                placeholder="e.g. 901234567"
                                required
                            />
                            <p className="help-text">
                                Found at the end of your List URL.
                            </p>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save ClickUp</button>
                    </form>

                    <form onSubmit={handleSaveAI}>
                        <h3>Agentic AI (DeepSeek)</h3>
                        <div className="form-group">
                            <label className="label">DeepSeek API Key</label>
                            <input
                                type="password"
                                className="input"
                                value={aiData.deepSeekKey}
                                onChange={(e) => setAiData({ ...aiData, deepSeekKey: e.target.value.trim() })}
                                placeholder="sk-..."
                                required
                            />
                            <p className="help-text">
                                Get your key from <a href="https://platform.deepseek.com/" target="_blank" rel="noreferrer">platform.deepseek.com</a>
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'none' }}>
                                <input
                                    type="checkbox"
                                    checked={aiData.enabled}
                                    onChange={(e) => setAiData({ ...aiData, enabled: e.target.checked })}
                                />
                                Enable Agentic Features
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--color-success)' }}>Save AI Settings</button>
                    </form>
                </div>

                <div className="settings-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Close Dashboard</button>
                </div>
            </div>
        </div>
    );
};

export default ClickUpSettings;
