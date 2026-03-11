import Calendar from "react-calendar";
import { Box } from "../../core/components/Box";
import { useEffect, useState } from "react";
import { OnArgs, Value } from "react-calendar/dist/shared/types";
import { isSameMonth } from "date-fns";
import {
  bookingsTableDefaultValue,
  BookingsTableResultViewModel,
  BookingStatus,
  BookingsViewModel,
} from "../../models/Bookings";
import { BookingsServices } from "../../services/Bookings";
import { useNavigate } from "react-router";
import { PropertyViewModel } from "../../models/Properties";
import { PropertyServices } from "../../services/Property";

interface Props {
  date: Date;
  changeViewMode: (viewMode: string, selectedDate: Date) => void;
  onClickMonth?: any;
  onClickDay?: any;
}

interface DateToTaskMap {
  [date: string]: BookingsViewModel[];
}

const formatToCalendarDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-CA", options);
};

const bookingsStatusClasses = {
  Pending: "bg-gray-400 hover:bg-gray-500",
  Confirmed: "bg-blue-400 hover:bg-blue-500",
  Cancelled: "bg-yellow-400 hover:bg-yellow-500",
  NoShow: "bg-red-400 hover:bg-red-500",
  Completed: "bg-green-400 hover:bg-green-500",
};

export const BookingListMonthly: React.FC<Props> = ({
  date,
  changeViewMode,
  onClickMonth,
  onClickDay,
}) => {
  const [data, setData] = useState<BookingsTableResultViewModel>(
    bookingsTableDefaultValue
  );
  const [propertyData, setPropertyData] = useState<PropertyViewModel[]>([]);

  const navigate = useNavigate();

  const [calendarValue, setCalendarValue] = useState<Value>(date);
  const handleDayClick = (selectedDate: Date) => {
    changeViewMode("DAY", selectedDate);
  };

  const loadProperty = async () => {
    try {
      const res = await PropertyServices.getList(1, 99999);
      setPropertyData(res.data);
      console.log("propertyData:", res.data);
    } catch (error) {
      console.log("Failed to load Properties", error);
    }
  };

  const loadData = async () => {
    BookingsServices.getList()
      .then((res) => {
        setData(res);
        console.log("bookingsData:", res.data);
      })
      .catch((error: any) => {
        console.error("Failed to load bookings", error);
      })
      .finally(() => {
        console.log("Fetch bookings completed");
      });
  };

  useEffect(() => {
    loadProperty();
    loadData();
  }, []);

  const dateToTasksMap: DateToTaskMap = data.data.reduce((map, row) => {
    if (row.startDateTime && row.endDateTime) {
      const start = new Date(row.startDateTime);
      const end = new Date(row.endDateTime);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const bookingsFormatted = formatToCalendarDate(d.toISOString());
        if (!map[bookingsFormatted]) {
          map[bookingsFormatted] = [];
        }
        map[bookingsFormatted].push(row);
      }
    }

    return map;
  }, {} as DateToTaskMap);

  const handleCalendarChange = (calValue: Value) => {
    setCalendarValue(calValue);
  };

  const handleViewChange = ({ activeStartDate }: OnArgs) => {
    setCalendarValue(activeStartDate);
  };

  const getPropertyName = (propertyId: number | undefined) => {
    const prop = propertyData.find((prop) => prop.id === propertyId);
    return prop ? prop.listingName : "";
  };

  const bookingPropertyName = (row: any) => {
    return `${getPropertyName(row.propertyId)}`;
  };

  return (
    <>
      <Box>
        <div className=" flex justify-between space-x-4 px-6 pb-2 pt-4 bg-gray-50">
          <button
            className="border px-4 py-2 shadow-md rounded-md bg-white"
            onClick={onClickDay}
          >
            Today
          </button>
          <button
            className="border px-4 py-2 shadow-md rounded-md bg-white"
            onClick={onClickMonth}
          >
            This Month
          </button>
        </div>

        {/* calendarView parent component */}
        <div className="w-full bg-gray-50 px-4 py-4">
          <div className="px-4">
            <div>LEGEND: </div>
            <div className="flex space-x-6 pt-2 ">
              <div>
                <span className="bg-gray-400 px-3.5 py-1 mr-2 rounded-full" />{" "}
                <span className="font-semibold">Pending</span>
              </div>
              <div>
                <span className="bg-blue-400 px-3.5 py-1 mr-2 rounded-full" />{" "}
                <span className="font-semibold">Confirmed</span>
              </div>
              <div>
                <span className="bg-yellow-400 px-3.5 py-1 mr-2 rounded-full" />{" "}
                <span className="font-semibold">Cancelled</span>
              </div>
              <div>
                <span className="bg-red-400 px-3.5 py-1 mr-2 rounded-full" />{" "}
                <span className="font-semibold">NoShow</span>
              </div>
              <div>
                <span className="bg-green-400 px-3.5 py-1 mr-2 rounded-full" />{" "}
                <span className="font-semibold">Completed</span>
              </div>
            </div>
          </div>
          {/* space */}
          <div className="mt-6" />

          <Calendar
            onChange={handleCalendarChange}
            onActiveStartDateChange={handleViewChange}
            onClickDay={(selectedDate) => handleDayClick(selectedDate)}
            value={calendarValue}
            calendarType="gregory"
            view={"month"}
            className="rounded space-y-4 text-center w-full h-full"
            prevLabel={
              <div className="border-black border-x mx-3 ">
                <div className="hover:scale-110 px-2">
                  <div className="flex space text-black text-sm">
                    <span>Prev Month</span>
                  </div>
                </div>
              </div>
            }
            nextLabel={
              <div className="border-black border-x mx-3 ">
                <div className="hover:scale-110 px-3">
                  <span className="text-black text-sm">Next Month</span>
                </div>
              </div>
            }
            prev2Label={
              <div className="hover:scale-110">
                <span className="text-black text-sm">Prev Year</span>
              </div>
            }
            next2Label={
              <div className="hover:scale-110">
                <span className="text-black text-sm">Next Year</span>
              </div>
            }
            tileClassName={({ date }) => {
              const dateString = formatToCalendarDate(date.toISOString());
              const tasksForDate = dateToTasksMap[dateString] || [];
              const isSaturday = date.getDay() === 6;
              const isSunday = date.getDay() === 0;

              const baseClasses =
                "items-start space-y-4 px-2 pt-2 pb-4 border hover:text-primary-500 border-gray-300 bg-white text-end grid grid-cols-1";

              const thisMonthsClasses = "border border-gray-300 bg-white";
              const otherMonthClasses =
                "border border-gray-300 bg-[#ECEEF0] text-gray-300 hover:text-gray-300";

              let classes = baseClasses;

              if (isSameMonth(date, calendarValue as Date)) {
                classes += ` ${thisMonthsClasses}`;
              } else {
                classes += ` ${otherMonthClasses}`;
              }

              // Default style
              // let classes =
              //   "space-y-2 mt-2 px-2 pt-2 pb-4 border border-gray-300 bg-white text-end grid grid-cols-1 hover:text-primary-500";

              // Highlight today
              const currentDate = new Date();
              const isToday =
                date.toDateString() === currentDate.toDateString();
              if (isToday) {
                classes += " text-blue-700 font-semibold";
              }

              // If no bookings, keep default
              if (tasksForDate.length === 0) {
                return classes;
              }

              // Determine tile color based on bookings
              // const statuses = tasksForDate.map((task) => task.status);

              if (isSunday || isSaturday) {
                classes += " font-semibold text-red-500";
              }

              // // If any of the bookings are BOOKED
              // if (statuses.includes(BookingStatus.Pending)) {
              //   classes += " bg-primary-100"; // Light primary shade for booked days
              // }
              // // If all are available
              // else if (
              //   statuses.every((status) => status === BookingStatus.Available)
              // ) {
              //   classes += " bg-green-100";
              // }
              // // If any maintenance
              // else if (statuses.includes(BookingStatus.Maintenance)) {
              //   classes += " bg-yellow-100";
              // }

              return classes;
            }}
            tileContent={({ date }) => {
              const dateString = formatToCalendarDate(date.toISOString());
              const tasksForDate = dateToTasksMap[dateString] || [];
              const currentDate = new Date();
              currentDate.setDate(currentDate.getDate() - 1);
              // const isOver = date < currentDate;

              if (tasksForDate.length === 0) {
                return <div className="h-24" />;
              }

              return (
                <>
                  <div className="px-2 space-y-2 w-full">
                    {tasksForDate.map((row, index) => {
                      return (
                        <div
                          key={index}
                          className={`py-2 w-full h-full border rounded-md cursor-pointer text-white ${
                            bookingsStatusClasses[
                              BookingStatus[
                                row.status
                              ] as keyof typeof bookingsStatusClasses
                            ]
                          }`}
                          onClick={() => {
                            const targetUrl = ``;
                            navigate(targetUrl);
                          }}
                        >
                          <div className="w-full">
                            <div className="flex flex-col items-center font-normal justify-center text-black space-y-1">
                              <span className="text-sm font-semibold">
                                {bookingPropertyName(row)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            }}
          />
        </div>
      </Box>
    </>
  );
};
