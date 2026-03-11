import { useEffect, useState } from "react";

interface Props {
    label: string;
    dataType?: 'password';
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputPassword: React.FC<Props> = ({
    label,
    value,
    onChange,
    dataType = 'password'
}) => {
    const [inputValue, setInputValue] = useState(value);
    
    useEffect(() => {
        setInputValue(value);
    }, [value])

    return (
        <div>
            <div className="text-gray-800 text-sm py-1">{label}</div>
            <input
                type={dataType}
                className="border rounded-md p-2 w-full border-gray-300"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    if (onChange) {
                        onChange(e)
                    }
                }} />
        </div>
    )
}
