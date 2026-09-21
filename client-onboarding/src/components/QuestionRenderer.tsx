import React from 'react';
import type { Question } from '../types';
import TextInput from './FormInputs/TextInput';
import TextArea from './FormInputs/TextArea';
import Select from './FormInputs/Select';
import MultiSelect from './FormInputs/MultiSelect';
import RadioGroup from './FormInputs/RadioGroup';

interface QuestionRendererProps {
    question: Question;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
    question,
    value,
    onChange,
    error,
}) => {
    const commonProps = {
        id: question.id,
        label: question.label,
        placeholder: question.placeholder,
        helpText: question.helpText,
        required: question.required,
        value: value || (question.type === 'multiselect' ? [] : ''),
        onChange,
        error,
    };

    switch (question.type) {
        case 'text':
        case 'number':
        case 'date':
            return <TextInput {...commonProps} />;
        case 'textarea':
            return <TextArea {...commonProps} />;
        case 'select':
            return <Select {...commonProps} options={question.options || []} />;
        case 'multiselect':
            return <MultiSelect {...commonProps} options={question.options || []} />;
        case 'radio':
            return <RadioGroup {...commonProps} options={question.options || []} />;
        default:
            return null;
    }
};

export default QuestionRenderer;
