import { Box, Modal } from "../../core/components/Box";
import {} from "../../models/Category";
import { useEffect, useState } from "react";

import { CreateQueues } from "./CreateQueues";

import { Windowview } from "./Window";
import { printQueueNumber58 } from "../../core/utils/printticket";
import { QueuesServices } from "../../services/Queues";
import { QueuesViewModel } from "../../models/Queues";
import { Services } from "../../services/Services";
import { ServiceViewModel } from "../../models/Services";

/* ===========================
   NEW: Minimal print helper
   =========================== */

export const PaymentList = () => {
  const [data, setData] = useState<QueuesViewModel[]>([]);
  const [serving, setserving] = useState<QueuesViewModel[]>([]);
  const [section, setSection] = useState<ServiceViewModel[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [action, setAction] = useState<boolean>(false);

  const ShowServices = async () => {
    try {
      const services = await Services.getServices();
      setSection(services);
    } catch (error) {
      console.error("Error to Fetch Services", error);
    }
  };

  const fetchWaiting = async () => {
    try {
      const waiting = await QueuesServices.getAllWaiting();
      setData(waiting);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchServing = async () => {
    try {
      const serving = await QueuesServices.getAllServing();
      setserving(serving);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateWaitingStatus = async (id: number) => {
    try {
      await QueuesServices.updateStatus(id); // 👈 your API call

      // refresh data after update
      fetchWaiting();
      fetchServing();
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  const handleTransfer = async (queueId: number, serviceId: number) => {
    try {
      await QueuesServices.Transfer(queueId, serviceId);
      setAction(false);
      fetchWaiting();
      fetchServing();
    } catch (e) {
      console.error("Transfer failed", e);
    }
  };

  useEffect(() => {
    ShowServices();
  }, []);
  // const updateServingStatus = async (id: number) => {
  //   try {
  //     await QueuesServices.updateStatus(id); // 👈 your API call
  //     // refresh data after update
  //     fetchServing();
  //   } catch (error) {
  //     console.error("Error updating queue:", error);
  //   }
  // };

  const cancelStatus = async (id: number) => {
    try {
      await QueuesServices.CancelStatus(id); // 👈 your API call

      // refresh data after update
      fetchWaiting();
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  const doneStatus = async (id: number) => {
    try {
      await QueuesServices.DoneStatus(id);
    } catch (error) {
      console.error("Error Updating Serving queue", error);
    }
  };
  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchWaiting(), fetchServing()]);
    };

    // initial load ONLY (🚫 removed setInterval auto-reload)
    load();
  }, []);

  /* ==================================
     NEW: Print the most recent queue
     ================================== */
  const handlePrintLast = () => {
    // Prefer latest from Waiting; if none, fallback to Serving.
    // Using array order as "latest":
    const latestWaiting =
      data && data.length > 0 ? data[data.length - 1] : undefined;
    const latestServing =
      serving && serving.length > 0 ? serving[serving.length - 1] : undefined;

    // If you'd rather use the highest ID instead of array order, use this:
    // const latestWaiting = data?.slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0)).pop();
    // const latestServing = serving?.slice().sort((a, b) => (a.id ?? 0) - (b.id ?? 0)).pop();

    const latest = latestWaiting ?? latestServing;

    if (!latest?.que_number) {
      alert("No queue found to print.");
      return;
    }

    printQueueNumber58({
      qNumber: String(latest.que_number),
      widthMm: 58,
      paddingMm: 4,
    });
  };

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
                    Queue Management
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

            {/* Stats Cards - Using Emojis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold">{data.length}</div>
                    <div className="text-blue-100 mt-2">Waiting</div>
                  </div>
                  <span className="text-3xl opacity-80">👥</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold">{serving.length}</div>
                    <div className="text-emerald-100 mt-2">Serving</div>
                  </div>
                  <span className="text-3xl opacity-80">✓</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold">
                      {data.length + serving.length}
                    </div>
                    <div className="text-amber-100 mt-2">Total Queue</div>
                  </div>
                  <span className="text-3xl opacity-80">⏱</span>
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

              <Windowview youtubeEmbedUrl="https://www.youtube.com/embed/O4Bel7t_IKg?si=gYcYWIHce7iVu6OD&rel=0&modestbranding=1&playsinline=1" />

              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                onClick={() => setShow(true)}
              >
                {" "}
                + New Queue{" "}
              </button>

              {/* NEW: Print Last Queue button */}
              <button
                className="px-4 py-2 rounded-lg bg-gray-800 text-white font-bold hover:bg-gray-900 transition"
                onClick={handlePrintLast}
                disabled={data.length === 0 && serving.length === 0}
                title="Print the most recently added queue number"
              >
                🖨️ Print Last Queue
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
                        Name
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

                        <td className="px-6 py-2">
                          <div className="flex ">
                            <span className="px-3 py-1 tracking-widest bg-gray-100 dark:bg-gray-700 rounded-full text-md font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                              {`${queues.first_name} ${
                                queues.middle_name
                                  ? queues.middle_name + "."
                                  : ""
                              } ${queues.last_name}`
                                .trim()
                                .toUpperCase()}
                            </span>
                          </div>
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
                          {action && (
                            <div className="z-10 cursor-pointer absolute mt-[1.6rem] ml-[-3.5rem] bg-white divide-y divide-gray-100 rounded-lg shadow w-[7rem] dark:bg-gray-700">
                              <ul
                                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                aria-labelledby="dropdownDefaultButton"
                              >
                                {section.map((sec) => (
                                  <li className="flex" key={sec.id}>
                                    <span
                                      onClick={() =>
                                        handleTransfer(queues.id, sec.id)
                                      }
                                      className="px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex"
                                    >
                                      {sec.service_name}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-sm"
                            onClick={() => doneStatus(queues.id)}
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
                          <div
                            onClick={() => {
                              setAction(true);
                            }}
                            className="inline-flex items-center justify-center px-3 py-1.5
  bg-rose-100 text-rose-700 rounded-full
  hover:bg-rose-200 cursor-pointer"
                            title="Transfer Queue"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 7h13m0 0l-4-4m4 4l-4 4M20 17H7m0 0l4-4m-4 4l4 4"
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
                        Name
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
                        <td className="px-6 py-2">
                          <div className=" ">
                            <span className="px-3 py-1 tracking-widest bg-gray-100 dark:bg-gray-700 rounded-full text-md font-bold text-gray-800 dark:text-gray-200 shadow-sm">
                              {`${queues.first_name} ${
                                queues.middle_name
                                  ? queues.middle_name + "."
                                  : ""
                              } ${queues.last_name}`
                                .trim()
                                .toUpperCase()}
                            </span>
                          </div>
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
                                fill="none"
                                viewBox="0 0 24 24"
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
