import { Box, Modal } from "../../core/components/Box";
import {} from "../../models/Category";
import { useEffect, useState } from "react";

import { printQueueNumber58 } from "../../core/utils/printticket";
import { QueuesServices } from "../../services/Queues";
import { QueuesViewModel } from "../../models/Queues";
import { Services } from "../../services/Services";
import { ServiceViewModel } from "../../models/Services";
import { Windowview } from "../Payments/Window";

/* ===========================
   NEW: Minimal print helper
   =========================== */

export const PropertyList = () => {
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

      // ✅ Refresh only the tables
      fetchWaiting();
      fetchServing();
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
          </div>

          {/* Waiting Table */}
          <div></div>
        </div>
      </Box>
    </>
  );
};
