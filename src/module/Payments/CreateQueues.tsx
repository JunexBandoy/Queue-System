import React from "react";
import { Formik, Field } from "formik";
import {
  initialValues as baseInitialValues,
  QueuesViewModel,
  validationSchema,
} from "../../models/Queues";
import { QueuesServices } from "../../services/Queues";

interface Iprops {
  loadData?: () => void;
  Onclick: (didCreate?: boolean) => void;
}

export const CreateQueues: React.FC<Iprops> = ({ Onclick, loadData }) => {
  const handleSubmit = async (values: QueuesViewModel) => {
    try {
      const response = await QueuesServices.create(values);
      console.log("Queue created successfully", response.data);
      loadData?.();
      Onclick(true); // close modal after success
    } catch (error) {
      console.error("There was an error creating the queue:", error);
    }
  };

  return (
    <div>
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Create New Queue
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => Onclick(false)}
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

        {/* Modal Body */}
        <div className="p-4 md:p-5 bg-white rounded-lg shadow dark:bg-gray-700">
          <Formik
            initialValues={baseInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formikprops) => (
              <form
                onSubmit={formikprops.handleSubmit}
                className="grid gap-4 grid-cols-2"
              >
                {/* Queue Date */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    First name
                  </label>
                  <Field
                    type="text"
                    name="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Middle Initial
                  </label>
                  <Field
                    type="text"
                    name="middle_initial"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Last name
                  </label>
                  <Field
                    type="text"
                    name="last_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contact Number
                  </label>
                  <Field
                    type="text"
                    name="contact_number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>

                {/* Service */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Service
                  </label>
                  <Field
                    as="select"
                    name="service_id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value={0}>Select Service</option>
                    <option value={1}>LMU</option>
                    <option value={2}>ADMIN</option>
                    <option value={3}>RECORDS</option>
                    <option value={4}>PLANNING</option>
                    <option value={5}>FULU</option>
                    <option value={6}>CDS</option>
                    <option value={7}>EMS</option>
                  </Field>
                </div>

                {/* Priority */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Priority
                  </label>
                  <Field
                    as="select"
                    name="priority"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  >
                    <option value="">Select Priority</option>
                    <option value="senior">Senior</option>
                    <option value="pwd">PWD</option>
                    <option value="regular">Regular</option>
                  </Field>
                </div>

                {/* Submit */}
                <div className="flex justify-end mt-4 col-span-2">
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Add New Queue
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
