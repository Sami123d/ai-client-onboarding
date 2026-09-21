import React from 'react';

interface RadioGroupProps {
    id: string;
    label: string;
    options: string[];
    helpText?: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
    id,
    label,
    options,
    helpText,
    required,
    value,
    onChange,
    error,
}) => {
    return (
        <div className="form-group fade-in">
            <p className="label">
                {label} {required && <span className="required-star">*</span>}
            </p>
            <div className="radio-grid">
                {options.map((option) => (
                    <label key={option} className={`radio-card glass-card ${value === option ? 'selected' : ''}`}>
                        <input
                            type="radio"
                            name={id}
                            value={option}
                            checked={value === option}
                            onChange={(e) => onChange(e.target.value)}
                            required={required}
                        />
                        <span className="radio-label">{option}</span>
                    </label>
                ))}
            </div>
            {helpText && <p className="help-text">{helpText}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default RadioGroup;
