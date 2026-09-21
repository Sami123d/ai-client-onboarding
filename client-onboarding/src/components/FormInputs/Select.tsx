import React from 'react';

interface SelectProps {
    id: string;
    label: string;
    options: string[];
    helpText?: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const Select: React.FC<SelectProps> = ({
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
            <label htmlFor={id} className="label">
                {label} {required && <span className="required-star">*</span>}
            </label>
            <select
                id={id}
                className={`input ${error ? 'input-error' : ''}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
            >
                <option value="" disabled>Select an option...</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {helpText && <p className="help-text">{helpText}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Select;
