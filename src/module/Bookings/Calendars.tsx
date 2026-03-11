/* eslint-disable no-lone-blocks */
import { useState } from "react";
import { BookingListMonthly } from "./BookingListMonthly";

type VIEWMODE = 'MONTH' | 'DAY' | 'YEAR';

export const Calendars = () => {
    const [calendarView, setCalendarView] = useState<VIEWMODE>('MONTH');
    const [calendarCurrentDate, setCalendarCurrentDate] = useState(new Date());

    const handleCalendarViewChange = (viewMode: string, selectedDate: Date) => {
    setCalendarView(viewMode as VIEWMODE);
    setCalendarCurrentDate(selectedDate);
    };
    
    const handleThisDayClick = () => {
    setCalendarView('DAY');
    setCalendarCurrentDate(new Date());
    console.log('Today', calendarCurrentDate);
    };
    
    const handleThisMonthClick = () => {
    {
      setCalendarView('YEAR');
      setCalendarCurrentDate(new Date());

      setTimeout(() => {
        setCalendarView('MONTH');
      }, 1);
    }
  };

    if (calendarView === 'DAY') {

        return (
            <>
                DAILY VIEW
            </>
        )
    } else if (calendarView === 'MONTH') {
        return (
            <>
                <BookingListMonthly
                    date={calendarCurrentDate}
                    changeViewMode={handleCalendarViewChange}
                    onClickMonth={() => {
                        handleThisMonthClick()
                    }}
                    onClickDay={() => {
                        handleThisDayClick()
                    }}
             />
            </>
        )
    } else {
        return (
            <>
                <div className="h-full bg-gray-50" />
                <BookingListMonthly date={calendarCurrentDate}
                changeViewMode={handleCalendarViewChange} />
            </>
        )
    }
}
