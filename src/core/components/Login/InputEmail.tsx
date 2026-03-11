import { useEffect, useState } from "react";

interface Props {
    label: string;
    dataType?: 'text' | 'number';
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputEmail: React.FC<Props> = ({
    label,
    value,
    onChange,
    dataType = 'text'
}) => {
    const [inputValue, setInputValue] = useState(value);
    const [isValid, setIsValid] = useState(true);
    
    useEffect(() => {
        setInputValue(value);
    }, [value])

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    return (
        <div>
            <div className="text-gray-800 text-sm py-1">{label}</div>
            <input
                datatype={dataType}
                className={`border rounded-md p-2 w-full ${
                    isValid ? 'border-gray-300' : 'border-red-500'
                }`}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsValid(validateEmail(e.target.value));
                    if (onChange) {
                        onChange(e)
                    }
                }} />
            
            {!isValid && inputValue && (
                <div className="text-red-500 text-xs mt-1">Please enter a valid email address.</div>
            )}
        </div>
    )
}
