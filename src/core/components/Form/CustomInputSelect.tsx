import { PlusIcon } from "@heroicons/react/24/outline";
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
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CustomInputSelect: React.FC<Props> = ({
    label,
    value,
    selection,
    onChange,
    onClick
}) => {
        const [selectValue, setSelectValue] = useState(value);
        
        useEffect(() => {
            setSelectValue(value);
        }, [value])
    
        return (
          <div>
            <div className="text-gray-800 text-sm py-1">{label}</div>
            <div className="flex">
              <select
                className="border-l w-full rounded-l-md border-y pl-2 py-2 pr-10 border-gray-300"
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
              <button
                onClick={onClick}
                type="button"
                className="bg-white rounded-r-md relative inline-flex items-center gap-x-1.5 p-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
              >
                <PlusIcon className="w-6" />
              </button>
            </div>
          </div>
        );
}
