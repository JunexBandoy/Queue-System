import { useRef, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface Props {
  label: string;
  value?: Date;
  onChange?: (date: Date) => void;
}

export const InputDate: React.FC<Props> = ({ label, value, onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const datePickerRef = useRef<any>(null);

  const dateFormatted = (date: Date | null): Date | null => {
    if (!date) return null;
    const formatted = new Date(date);
    formatted.setHours(12, 0, 0, 0);
    return formatted;
  };

  useEffect(() => {
    setSelectedDate(value || null);
  }, [value]);

  const handleDateChange = (date: Date | null) => {
    const formatted = dateFormatted(date);
    setSelectedDate(formatted);
    onChange?.(formatted!);
  };

  return (
    <div>
      <div className="text-gray-800 text-sm py-1">{label}</div>
      <div className="flex">
        <DatePicker
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat={"MM/dd/yyyy"}
          className="border-l border-y rounded-l-md p-2 w-full border-gray-300"
          showPopperArrow={false}
        />
        <div className="bg-white rounded-r-md relative inline-flex items-center gap-x-1.5 p-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
          <CalendarDaysIcon className="w-6" />
        </div>
      </div>
    </div>
  );
};
