import { BookingsViewModel } from "../../models/Bookings";
import { clientTableDefaultValue } from "../../models/Layaway";

import { BookingsServices } from "../../services/Bookings";

import { Formik, Field } from "formik";

interface Props {
  onClick: () => void;
  booking: BookingsViewModel | null;
}

export const BookingEdit: React.FC<Props> = ({ onClick, booking }) => {
  const handleSubmit = async (values: BookingsViewModel) => {
    try {
      if (booking) {
        // UPDATE existing booking
        await BookingsServices.create({
          ...values,
          id: booking.id, // ensure correct id
        });
        console.log("Booking updated");
      } else {
        // CREATE new booking
        await BookingsServices.create(values);
        console.log("Booking created");
      }

      onClick(); // close modal
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };
  return (
    <>
      <div>
        <div className="relative bg-white rounded-lg ">
          <div className="flex items-center justify-between p-4 md:p-5 ">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Edit Host Initial Booking
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClick}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>

        <form className="p-4 md:p-5">
          {/* Property */}
          <div className="mb-4">
            <label className="block mb-2 text-xs font-medium text-gray-900">
              Property
            </label>
            <Field
              as="select"
              name="propertyId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg w-full p-2.5"
            >
              <option value={0}>Select Property</option>
            </Field>
          </div>

          {/* Provider */}
          <div className="col-span-2 ">
            <div className="border-b-2 border-gray-300 py-2 font-semibold">
              <label className="text-sm">Guest Details</label>
            </div>

            <div className="col-span-2">
              <label className="block mb-2 pt-4 text-xs font-medium text-gray-400">
                Guest Name
              </label>

              <div className="flex items-center relative w-full">
                <div className="w-[90%]">
                  <select className="bg-gray-50 border rounded-tl-lg rounded-bl-lg border-gray-300 text-gray-400 text-xs w-full p-2.5">
                    <option>Junex</option>
                    <option>John</option>
                    <option>Melvin</option>
                  </select>
                </div>

                <div
                  className="flex justify-center items-center cursor-pointer border g-gray-50 rounded-tr-lg rounded-br-lg border-gray-300 text-gray-400 p-2"
                  onClick={() => ""}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Count */}
          <div className="mb-4 mt-4 grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block mb-1 text-xs text-gray-500">
                Guest Count
              </label>
              <Field
                type="number"
                name="guestCount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                placeholder="0"
              />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 text-xs text-gray-500">Adult</label>
              <Field
                type="number"
                name="adultCount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                placeholder="0"
              />
            </div>

            <div className="col-span-1">
              <label className="block mb-1 text-xs text-gray-500">
                Children
              </label>
              <Field
                type="number"
                name="childCount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                placeholder="0"
              />
            </div>
          </div>

          {/* Start & End Date */}
          <div className="mb-4 grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-500">
                Start Date & Time
              </label>
              <Field
                type="datetime-local"
                name="startDateTime"
                className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg w-full p-2.5"
              />
            </div>
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-500">
                End Date & Time
              </label>
              <Field
                type="datetime-local"
                name="endDateTime"
                className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg w-full p-2.5"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Notes
            </label>
            <Field
              as="textarea"
              name="notes"
              className="bg-gray-50 border h-20 border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
              placeholder="Notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="text-white bg-gray-400 rounded-lg text-sm px-5 py-2.5"
              onClick={onClick}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-[#030081] rounded-lg text-sm px-5 py-2.5"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
