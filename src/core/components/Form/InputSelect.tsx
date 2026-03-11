import { useEffect, useState } from "react";

export interface SelectionOptions {
    selected?: boolean;
    value: string;
    text: string | number;
    id?: number;
}

type Props = {
    label: string;
    value?: string | number;
    selection: SelectionOptions[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const InputSelect: React.FC<Props> = ({
    label,
    value,
    selection,
    onChange,
}) => {
        const [selectValue, setSelectValue] = useState(value);
        
        useEffect(() => {
            setSelectValue(value);
        }, [value])
    
        return (
          <div>
            <div className="text-gray-800 text-sm py-1">{label}</div>
            <select
              className="border rounded-md p-2 w-full border-gray-300"
              value={selectValue}
              onChange={(e) => {
                setSelectValue(e.target.value);
                if (onChange) {
                  onChange(e);
                }
              }}
            >
              <option value=""></option>

              {selection.map((row, index) => (
                <option key={index} value={row.value}>
                  {row.text}
                </option>
              ))}
            </select>
          </div>
        );
}
