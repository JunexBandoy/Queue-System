import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { WindowIcon } from "@heroicons/react/24/solid"; // optional; remove if not needed

import { ServingViewModel } from "../../models/ViewServing";
import { ServingServices } from "../../services/Serving";
import { WaitingViewModel } from "../../models/ViewWaiting";
import { WaitingServices } from "../../services/Waiting";

interface WindowviewProps {
  className?: string;
  name?: string;
  width?: number;
  height?: number;
  /** Full YouTube EMBED URL (e.g., https://www.youtube.com/embed/VIDEO_ID?... ) */
  youtubeEmbedUrl?: string;
}

/** ------------------ React app that runs inside the popup (no Tailwind) ------------------ */
const ServingPopupApp: React.FC<{ win: Window; youtubeEmbedUrl?: string }> = ({
  win,
  youtubeEmbedUrl,
}) => {
  // State
  const [serving, setServing] = useState<ServingViewModel[]>([]);
  const [waiting, setWaiting] = useState<WaitingViewModel[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const sections = [0, 1, 2, 3, 4, 5]; // Assuming you have 4 sections to cycle through
  const delay = 5000; // Slide transition delay in milliseconds

  const [newEntryId, setNewEntryId] = useState<number | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const shownModalIdsRef = useRef<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    number: string;
    service: string;
  } | null>(null);

  // show modal for 5 seconds

  const triggerModal = (number: string, service: string) => {
    setModalData({ number, service });
    setShowModal(true);

    // Keep modal visible for 5 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 5000);
  };

  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 10000);
  };

  // Refs for announcement logic
  const newQueueAudioRef = useRef<HTMLAudioElement | null>(null);
  const firstLoadRef = useRef(true);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const pendingRef = useRef<ServingViewModel[]>([]);
  const announcingRef = useRef<boolean>(false);
  const prevTopIdRef = useRef<number | null>(null);

  // Helpers
  const normalizeOrder = (rows: ServingViewModel[]) =>
    rows
      .slice()
      .sort((a, b) => ((a.id ?? 0) as number) - ((b.id ?? 0) as number));

  const sortNewestFirst = <T extends { id?: number }>(rows: T[]) =>
    rows
      .slice()
      .sort((a, b) => ((b.id ?? 0) as number) - ((a.id ?? 0) as number));

  const fetchServing = async () => {
    try {
      const data = await ServingServices.getAllServing();
      const ordered = normalizeOrder(data ?? []);

      const currentIds = new Set(serving.map((s) => s.id));
      const newEntries = ordered.filter((s) => !currentIds.has(s.id));

      let updatedList = [...serving];

      if (newEntries.length > 0) {
        newEntries.forEach((entry) => {
          updatedList.push(entry);
          if (updatedList.length > 7) updatedList.shift();

          // NEW ✅ modal popup when new call

          if (entry.id && !shownModalIdsRef.current.has(entry.id)) {
            shownModalIdsRef.current.add(entry.id);

            triggerModal(
              String(entry.que_number ?? ""),
              String(
                `${entry.first_name ?? ""} ${entry.last_name ?? ""}`.trim(),
              ),
            );
          }

          // your blink trigger (if any)
          setNewEntryId(entry.id ?? null);
          triggerBlink();
        });
      } else {
        updatedList = ordered.slice(-7);
      }

      setServing(updatedList);

      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      setLastUpdatedDate(
        new Date().toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
        }),
      );

      setError(null);
    } catch (err) {
      console.error("Popup: error fetching serving list:", err);
      setError("Unable to fetch latest data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWaiting = async () => {
    try {
      const data = await WaitingServices.getAllWaiting();
      const ordered = normalizeOrder(data ?? []);
      setWaiting(ordered);
      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      // Date (new)

      setLastUpdatedDate(
        new Date().toLocaleDateString([], {
          weekday: "long", // e.g., Friday
          year: "numeric",
          month: "long", // e.g., March
          day: "2-digit", // e.g., 05
        }),
      );

      setError(null);
    } catch (err) {
      console.error("Popup: error fetching serving list:", err);
      setError("Unable to fetch latest data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sections.length - 1 ? 0 : prevIndex + 1,
      );
    }, delay);

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [sections.length]);

  useEffect(() => {
    const refresh = async () => {
      await Promise.all([fetchServing(), fetchWaiting()]);
    };

    refresh();

    const interval = setInterval(refresh, 2000);

    return () => clearInterval(interval);
  }, []);

  // Detect change at the top item (you can style [data-top-changed="true"] if you want)
  const top = serving[0];
  const topChanged = useMemo(() => {
    const changed = top?.id && prevTopIdRef.current !== top.id;
    if (changed) prevTopIdRef.current = top!.id!;
    return changed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top?.id]);

  /** ------------------ Audio + TTS helpers (unchanged) ------------------ */

  // Spell out something like "A101" -> "A 1 0 1"
  const spellOutQueue = (s?: string | number) => {
    if (s === undefined || s === null) return "";
    return String(s)
      .trim()
      .split("")
      .map((ch) => (/^[A-Za-z0-9]$/.test(ch) ? ch : " "))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  };

  // Tone
  const playTone = () => {
    const a = newQueueAudioRef.current;
    if (!a) return Promise.resolve();
    a.currentTime = 0;
    a.volume = 1; // 0..1
    a.muted = false;
    return a.play().catch(() => Promise.resolve()); // ignore if autoplay is blocked
  };

  // TTS (SpeechSynthesis)
  const speakText = (
    text: string,
    opts?: { lang?: string; rate?: number; pitch?: number; volume?: number },
  ) => {
    return new Promise<void>((resolve) => {
      const synth = win.speechSynthesis;
      const UtteranceCtor: any =
        (win as any).SpeechSynthesisUtterance ||
        (window as any).SpeechSynthesisUtterance;

      if (!synth || !UtteranceCtor) return resolve();

      const u = new UtteranceCtor(text);

      // ✅ Use default voice only
      u.lang = opts?.lang ?? "en-US";
      u.rate = opts?.rate ?? 1;
      u.pitch = opts?.pitch ?? 1;
      u.volume = opts?.volume ?? 1;

      const loadVoices = () =>
        new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const v = synth.getVoices();
          if (v.length) return resolve(v);

          synth.onvoiceschanged = () => resolve(synth.getVoices());
        });

      const startSpeaking = async () => {
        const voices = await loadVoices();
        u.voice = voices[0] ?? null;

        u.onend = () => resolve();
        u.onerror = () => resolve();

        if (synth.speaking) synth.cancel();
        synth.speak(u);
      };

      startSpeaking();
    });
  };

  // Web Audio fallback beep
  const beepFallback = () => {
    try {
      const AC: any =
        (win as any).AudioContext || (win as any).webkitAudioContext;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // ignore
    }
  };

  // Strictly process: TONE -> SPEECH -> next
  const processAnnouncements = async () => {
    if (announcingRef.current) return;
    const nextItem = pendingRef.current.shift();
    if (!nextItem) return;

    announcingRef.current = true;

    // 🔊 Play tone (no await)
    playTone().catch(() => beepFallback());

    const numberToSpeak = spellOutQueue(nextItem.que_number as any);
    const first = nextItem.first_name ?? "";
    const last = nextItem.last_name ?? "";
    const fullName = `${first} ${last}`.trim();

    // 🗣️ Speak immediately (no await)
    speakText(`Now serving queue ${numberToSpeak}, ${fullName}.`, {
      rate: 0.95,
      pitch: 1,
      volume: 1,
      lang: "en-US",
    });

    announcingRef.current = false;

    if (pendingRef.current.length > 0) processAnnouncements();
  };

  /** ------------------ Detect newly posted queues (after first load) ------------------ */
  useEffect(() => {
    const currentIds = new Set(
      serving
        .map((s) => s.id)
        .filter((id): id is number => typeof id === "number"),
    );

    if (firstLoadRef.current) {
      seenIdsRef.current = currentIds;
      firstLoadRef.current = false;
      return;
    }

    const newlyAdded = serving.filter(
      (s) =>
        typeof s.id === "number" && !seenIdsRef.current.has(s.id as number),
    );

    if (newlyAdded.length > 0) {
      pendingRef.current.push(...newlyAdded);
      processAnnouncements();
    }

    seenIdsRef.current = currentIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serving]);

  // ----- UI (minimal markup; you style in index.css) -----

  return (
    <>
      <div>
        {/* Hidden audio element for the tone (ensure the file exists at this path) */}
        <audio
          ref={newQueueAudioRef}
          src="/assets/new-queue.mp3"
          preload="auto"
        />

        {/* Your header: className matches your index.css selector .header { ... } */}
        <div className="header">
          <div className="left">
            <div className="l-text">
              <h1>NOW SERVING</h1>
            </div>
          </div>

          <div className="right" aria-live="polite">
            <div className="l1">
              <div className="logo"></div>
              <div className="logo2"></div>
            </div>
            <div className="r1">
              <div className="right-text" title="Last Updated">
                {lastUpdatedDate
                  ? `${lastUpdatedDate} — ${lastUpdated}`
                  : lastUpdated || "--:--"}
              </div>
            </div>
            {loading ? <div title="Refreshing…"></div> : null}
          </div>
        </div>

        <div className="main">
          <div className="main-left">
            <div className="main-left-content">
              <table>
                <thead>
                  <tr className="tr">
                    <th>NUMBER</th>
                    <th>SERVICE</th>
                  </tr>
                </thead>

                <tbody>
                  {serving.map((q, idx) => {
                    return (
                      <tr
                        key={q.id ?? idx}
                        data-active={idx === 0 ? "true" : "false"}
                        className={
                          q.id === newEntryId ? "slide-in blink" : undefined
                        }
                      >
                        <td className="qnumuber">{q.que_number}</td>
                        <td>
                          <span className="service">{q.service_name}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="waiting-content">
              <div className="main-left-text">
                <div className="l-text">
                  <h1>WAITING</h1>
                </div>
              </div>
              <table>
                <thead>
                  <tr className="tr">
                    <th>NUMBER</th>
                    <th>SERVICE</th>
                  </tr>
                </thead>

                <tbody className="waiting">
                  {sortNewestFirst(waiting)
                    .slice(0, 4)
                    .map((q, idx) => (
                      <tr
                        key={q.id ?? idx}
                        data-active={idx === 0 ? "true" : "false"}
                      >
                        <td className="waitingqnumber">{q.que_number}</td>
                        <td>
                          <span className="waitingservice">
                            {q.service_name}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="main-right">
            <div className="w-full bg-black h-[5px] mb-[1px]"></div>
            <div className="video-wrapper relative">
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div>
                  <div>▶</div>
                  <div>YouTube area (add embed URL)</div>
                </div>
              )}
            </div>

            <div className="w-full bg-[#e7eae9] h-[5px]"></div>

            <div className="slider-viewport">
              <div
                className="slider-track"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <div className="carousel" />
                <div className="carousel1" />
                <div className="carousel2" />
                <div className="carousel3" />
                <div className="carousel4" />
                <div className="carousel5" />
                <div className="carousel6" />
                <div className="carousel7" />
                <div className="carousel8" />
              </div>
            </div>
            <div className="w-full    ">
              <p className="text-center font-serif font-semibold tracking-widest p-2">
                " IKAW MO BILIB SA SERBISYONG CENRO BISLIG "
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="info">
        <div>
          <div>
            <span>📄 Please prepare your IDs & documents • </span>
            <span>⏳ Thank you for your patience • </span>
            <span>✅ priority lanes available for seniors & PWD • </span>
            <span>🌱 Together, let’s care for our environment • </span>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="marquee-viewport" aria-hidden="true">
          <div className="marquee-track">
            {/* Group 1 */}
            <div className="marquee-group">
              <span>📄 Please prepare your IDs &amp; documents • </span>
              <span>⏳ Thank you for your patience • </span>
              <span>✅ priority lanes available for seniors &amp; PWD • </span>
              <span>🌱 Together, let’s care for our environment • </span>
            </div>

            {/* Group 2 (duplicate of Group 1 for seamless looping) */}
            <div className="marquee-group" aria-hidden="true">
              <span>📄 Please prepare your IDs &amp; documents • </span>
              <span>⏳ Thank you for your patience • </span>
              <span>✅ priority lanes available for seniors &amp; PWD • </span>
              <span>🌱 Together, let’s care for our environment • </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && modalData && (
        <div className="modal-overlay">
          <div className="modal-content slide-modal">
            <h1 className="modal-number">NOW SERVING</h1>

            <h2 className="modal-big">{modalData.number}</h2>

            <p className="modal-service tracking-widest font-thin uppercase">
              {modalData.service}
            </p>
          </div>
        </div>
      )}
    </>
  );

  function priorityBadge(p?: string) {
    const pr = (p || "").toLowerCase();
    if (pr === "senior" || pr === "pwd")
      return { label: pr.toUpperCase(), bg: "#ef4444", color: "#fff" };
    if (pr === "regular")
      return { label: "REGULAR", bg: "#2563eb", color: "#fff" };
    return { label: (p || "N/A").toUpperCase(), bg: "#94a3b8", color: "#fff" };
  }
};

/** ------------------ Button that opens & mounts the popup app ------------------ */
export const Windowview: React.FC<WindowviewProps> = ({
  className,
  name = "_blank",
  width = 1200,
  height = 720,
  youtubeEmbedUrl,
}) => {
  const openNewWindow = async () => {
    const left =
      (window.screenX ?? (window as any).screenLeft ?? 0) +
      (window.outerWidth - width) / 2;
    const top =
      (window.screenY ?? (window as any).screenTop ?? 0) +
      (window.outerHeight - height) / 2;

    const features = [
      `width=${Math.max(360, Math.floor(width))}`,
      `height=${Math.max(360, Math.floor(height))}`,
      `left=${Math.max(0, Math.floor(left))}`,
      `top=${Math.max(0, Math.floor(top))}`,
      "resizable=yes",
      "scrollbars=yes",
    ].join(",");

    const win = window.open("", name, features);
    if (!win) {
      alert("Popup blocked. Please allow popups for this site and try again.");
      return;
    }
    try {
      win.focus();
    } catch {}

    // Minimal HTML for the popup (no CSS here)
    win.document.open();
    win.document.write(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Now Serving</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body>
    <div id="popup-root"></div>
  </body>
</html>`);
    win.document.close();

    // 🔽 🔽 🔽 Your requested code to copy styles into the popup 🔽 🔽 🔽

    // Copy external stylesheets (production)
    document
      .querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      .forEach((link) => {
        const copy = win.document.createElement("link");
        copy.rel = "stylesheet";
        copy.href = link.href; // same CSS file as parent
        win.document.head.appendChild(copy);
      });

    // Copy inline <style> tags (development / HMR)
    document.querySelectorAll<HTMLStyleElement>("style").forEach((styleEl) => {
      const s = win.document.createElement("style");
      s.textContent = styleEl.textContent || "";
      win.document.head.appendChild(s);
    });

    // 🔼 🔼 🔼 End of style-copy block 🔼 🔼 🔼

    // Mount React app AFTER styles are in place
    const container = win.document.getElementById("popup-root");
    if (!container) {
      win.close();
      console.error("Popup container not found.");
      return;
    }

    const root = createRoot(container);
    root.render(
      <ServingPopupApp win={win} youtubeEmbedUrl={youtubeEmbedUrl} />,
    );

    // Cleanup when popup closes
    const onPopupBeforeUnload = () => {
      try {
        root.unmount();
      } catch {}
    };
    win.addEventListener("beforeunload", onPopupBeforeUnload, { once: true });

    // Close popup when parent leaves
    const onParentBeforeUnload = () => {
      try {
        if (!win.closed) win.close();
      } catch {}
    };
    window.addEventListener("beforeunload", onParentBeforeUnload, {
      once: true,
    });
  };

  return (
    <button
      type="button"
      onClick={openNewWindow}
      aria-label="Open serving window"
      title="Open serving window"
      className={className}
    >
      <WindowIcon style={{ width: 24, height: 24, verticalAlign: "middle" }} />
      <span style={{ marginLeft: 8 }}>Window</span>
    </button>
  );
};
