import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  placeholder,
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
      <input
        type="text"
        id={id}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {helpText && <p className="help-text">{helpText}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TextInput;
