import { Box, Modal } from "../../core/components/Box";
import {} from "../../models/Category";
import { useEffect, useState } from "react";

import { WaitingServices } from "../../services/Waiting";
import { ServingViewModel } from "../../models/ViewServing";
import { ServingServices } from "../../services/Serving";
import { WaitingViewModel } from "../../models/ViewWaiting";
import { CreateQueues } from "./CreateQueues";

export const SubAdminView = () => {
  const [data, setData] = useState<WaitingViewModel[]>([]);
  const [serving, setserving] = useState<ServingViewModel[]>([]);
  const [show, setShow] = useState<boolean>(false);

  const fetchWaiting = async () => {
    try {
      const waiting = await WaitingServices.getAll();
      setData(waiting);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchServing = async () => {
    try {
      const serving = await ServingServices.getAll();
      setserving(serving);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateWaitingStatus = async (id: number) => {
    try {
      await WaitingServices.updateStatus(id); // 👈 your API call

      // refresh data after update
      fetchWaiting();
      fetchServing();
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  const updateServingStatus = async (id: number) => {
    try {
      await ServingServices.updateStatus(id); // 👈 your API call

      // refresh data after update
      fetchServing();
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  const cancelStatus = async (id: number) => {
    try {
      await WaitingServices.CancelWaitingStatus(id); // 👈 your API call

      // refresh data after update
      fetchWaiting();
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  console.log(data);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchWaiting(), fetchServing()]);
    };

    load(); // initial load

    const interval = setInterval(load, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-lg">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">🔔</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Queue Management 123123123123
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Real-time client queue display
                  </p>
                </div>
              </div>

              <div className="bg-white px-5 py-3 rounded-xl shadow-md border border-gray-200">
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Last Updated
                </div>
                <div className="font-mono text-xl font-bold text-gray-800">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Serving Table */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                Currently Serving
              </h2>
              <div className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-white font-bold">
                {serving.length} Active
              </div>

              {/* Push this button to the right */}
              <button
                // onClick={createQueue}
                className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                onClick={() => {
                  setShow(true);
                }}
              >
                + New Queue
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto sm:rounded-lg p-4">
                <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs font-sans text-gray-700 uppercase bg-gradient-to-r from-emerald-50 to-teal-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Queueing
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        priorit
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans text-xs">
                    {serving.map((queues) => (
                      <tr
                        key={queues.id}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                      >
                        <td className="px-6 py-2">
                          <div className="flex items-center gap-3 ">
                            <div className="w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm p-2">
                                {queues.que_number}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-2 text-black dark:text-white">
                          {queues.service_name}
                        </td>
                        <td className="px-6 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              queues.priorit === "senior" ||
                              queues.priorit === "pwd"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : queues.priorit === "regular"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {queues.priorit}
                          </span>
                        </td>
                        <td className="px-6 py-2">
                          <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            {queues.status}
                          </span>
                        </td>
                        <td className="px-6 py-2 cursor-pointer">
                          <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm"
                            onClick={() => updateServingStatus(queues.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav aria-label="Page navigation example">
                  <ul className="flex justify-end -space-x-px text-sm pt-4"></ul>
                </nav>
              </div>
              <nav aria-label="Page navigation example">
                <ul className="flex justify-end -space-x-px text-sm pt-4"></ul>
              </nav>
            </div>
          </div>

          {/* Waiting Table */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">
                Waiting Queue
              </h2>
              <div className="px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white font-bold">
                {data.length} Waiting
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto sm:rounded-lg p-4">
                <table className="w-full text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs font-sans text-gray-700 uppercase bg-gradient-to-r from-amber-50 to-orange-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Queueing
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        priorit
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="font-sans text-xs">
                    {data.map((queues) => (
                      <tr
                        key={queues.id}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                      >
                        <td className="px-6 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm p-2">
                                {queues.que_number}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-2 text-black dark:text-white">
                          {queues.service_name}
                        </td>
                        <td className="px-6 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              queues.priorit === "senior" ||
                              queues.priorit === "pwd"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : queues.priorit === "regular"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {queues.priorit}
                          </span>
                        </td>
                        <td className="px-6 py-2">
                          <span className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold">
                            <span className="text-amber-500">⏱</span>
                            {queues.status}
                          </span>
                        </td>
                        <td className="px-6 py-2">
                          <div className="flex items-center gap-2">
                            {/* SERVE BUTTON */}
                            <div
                              onClick={() => updateWaitingStatus(queues.id)}
                              className="inline-flex items-center justify-center px-3 py-1.5
      bg-emerald-100 text-emerald-700 rounded-full
      hover:bg-emerald-200 cursor-pointer"
                              title="Serve Queue"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>

                            {/* CANCEL BUTTON */}
                            <div
                              onClick={() => cancelStatus(queues.id)}
                              className="inline-flex items-center justify-center px-3 py-1.5
      bg-rose-100 text-rose-700 rounded-full
      hover:bg-rose-200 cursor-pointer"
                              title="Cancel Queue"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 6l12 12M6 18L18 6"
                                />
                              </svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav aria-label="Page navigation example">
                  <ul className="flex justify-end -space-x-px text-sm pt-4"></ul>
                </nav>
              </div>
              <nav aria-label="Page navigation example">
                <ul className="flex justify-end -space-x-px text-sm pt-4"></ul>
              </nav>
            </div>
          </div>
        </div>

        {show && (
          <Modal show={true}>
            <CreateQueues Onclick={() => setShow(false)} />
          </Modal>
        )}
      </Box>
    </>
  );
};
