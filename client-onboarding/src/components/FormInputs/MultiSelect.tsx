import React from 'react';

interface MultiSelectProps {
    id: string;
    label: string;
    options: string[];
    helpText?: string;
    required?: boolean;
    value: string[];
    onChange: (value: string[]) => void;
    error?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    id,
    label,
    options,
    helpText,
    required,
    value,
    onChange,
    error,
}) => {
    const handleToggle = (option: string) => {
        if (value.includes(option)) {
            onChange(value.filter((v) => v !== option));
        } else {
            onChange([...value, option]);
        }
    };

    return (
        <div className="form-group fade-in" id={id}>
            <p className="label">
                {label} {required && <span className="required-star">*</span>}
            </p>
            <div className="checkbox-grid">
                {options.map((option, index) => (
                    <label
                        key={option}
                        htmlFor={`${id}-${index}`}
                        className={`checkbox-card glass-card ${value.includes(option) ? 'selected' : ''}`}
                    >
                        <input
                            id={`${id}-${index}`}
                            type="checkbox"
                            value={option}
                            checked={value.includes(option)}
                            onChange={() => handleToggle(option)}
                        />
                        <span className="checkbox-label">{option}</span>
                    </label>
                ))}
            </div>
            {helpText && <p className="help-text">{helpText}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default MultiSelect;
