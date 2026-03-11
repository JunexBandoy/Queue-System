// Window.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { WindowIcon } from "@heroicons/react/24/solid";
import { ServingViewModel } from "../../models/ViewServing";
import { ServingServices } from "../../services/Serving";
import { createRoot } from "react-dom/client";

interface WindowviewProps {
  className?: string;
  name?: string; // keep _blank to always open a new one
  width?: number;
  height?: number;
  /** Full YouTube EMBED URL (e.g., https://www.youtube.com/embed/VIDEO_ID?... ) */
  youtubeEmbedUrl?: string;
}

/** ------------------ React app that runs inside the popup ------------------ */
const ServingPopupApp: React.FC<{ win: Window; youtubeEmbedUrl?: string }> = ({
  win,
  youtubeEmbedUrl,
}) => {
  const [serving, setServing] = useState<ServingViewModel[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For the top card glow effect
  const prevTopIdRef = useRef<number | null>(null);

  // 🔊 Tone audio element ref
  const newQueueAudioRef = useRef<HTMLAudioElement | null>(null);

  // First load guard: don't announce anything on initial fetch
  const firstLoadRef = useRef(true);

  // Track which IDs have been seen to detect newly posted queues
  const seenIdsRef = useRef<Set<number>>(new Set());

  // FIFO queue for announcements (tone -> speech)
  const pendingRef = useRef<ServingViewModel[]>([]);
  const announcingRef = useRef<boolean>(false);

  const fetchServing = async () => {
    try {
      const data = await ServingServices.getAll();
      setServing(data);
      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
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
    // Initial load
    fetchServing();
    // Poll for updates
    const id = setInterval(fetchServing, 2000);
    return () => clearInterval(id);
  }, []);

  // Detect change at the top for gentle glow
  const top = serving[0];
  const topChanged = useMemo(() => {
    const changed = top?.id && prevTopIdRef.current !== top.id;
    if (changed) prevTopIdRef.current = top!.id!;
    return changed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top?.id]);

  /** ------------------ Audio + TTS helpers ------------------ */

  // Spell out something like "A101" or 101 -> "A 1 0 1"
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

  // Play the "new queue" tone (awaitable)
  const playTone = () => {
    const a = newQueueAudioRef.current;
    if (!a) return Promise.resolve();
    a.currentTime = 0;
    a.volume = 1; // 0..1
    a.muted = false;
    return a.play().catch(() => Promise.resolve()); // ignore if blocked
  };

  // Speak text using the popup's SpeechSynthesis (win)
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
      u.lang = opts?.lang ?? "en-PH"; // English (Philippines), falls back to EN
      u.rate = opts?.rate ?? 1;
      u.pitch = opts?.pitch ?? 1;
      u.volume = opts?.volume ?? 1;

      const pickVoice = () => {
        const voices = synth.getVoices();
        return (
          voices.find((v) => v.lang?.toLowerCase().startsWith("en-ph")) ||
          voices.find((v) => v.lang?.toLowerCase().startsWith("en-")) ||
          voices[0]
        );
      };

      const startSpeaking = () => {
        const v = pickVoice();
        if (v) (u as any).voice = v;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        if (synth.speaking) synth.cancel(); // avoid overlapping speech
        synth.speak(u);
      };

      if (!synth.getVoices().length) {
        (synth as any).onvoiceschanged = () => startSpeaking();
        setTimeout(startSpeaking, 300);
      } else {
        startSpeaking();
      }
    });
  };

  // Web Audio fallback beep (if you want a backup)
  const beepFallback = () => {
    try {
      const AC: any =
        (win as any).AudioContext || (win as any).webkitAudioContext;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880; // A5
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

  // 🚦 Process the queue strictly in order: TONE → SPEECH → next
  const processAnnouncements = async () => {
    if (announcingRef.current) return;
    const nextItem = pendingRef.current.shift();
    if (!nextItem) return;

    announcingRef.current = true;

    // 1) Tone first
    try {
      await playTone();
    } catch {
      beepFallback();
    }

    // 2) Then speak
    const numberToSpeak = spellOutQueue(nextItem.que_number as any);
    const service = nextItem.service_name ? `, ${nextItem.service_name}` : "";
    await speakText(`Now serving queue ${numberToSpeak}${service}.`);

    announcingRef.current = false;

    // Continue if more items are pending
    if (pendingRef.current.length > 0) processAnnouncements();
  };

  /** ------------------ Detect newly posted items ------------------ */
  useEffect(() => {
    // Set of current IDs in this tick
    const currentIds = new Set(
      serving
        .map((s) => s.id)
        .filter((id): id is number => typeof id === "number"),
    );

    if (firstLoadRef.current) {
      // ✅ Initial load: seed and DO NOT announce
      seenIdsRef.current = currentIds;
      firstLoadRef.current = false;
      return;
    }

    // Only after first load: detect new items
    const newlyAdded = serving.filter(
      (s) =>
        typeof s.id === "number" && !seenIdsRef.current.has(s.id as number),
    );

    if (newlyAdded.length > 0) {
      // Queue them in display order
      pendingRef.current.push(...newlyAdded);
      processAnnouncements(); // TONE → SPEECH
    }

    // Update snapshot
    seenIdsRef.current = currentIds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serving]);

  /** ------------------ UI ------------------ */
  return (
    <div
      className="h-full w-full bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/assets/denr1.jpg')", // ensure this exists under public/assets/
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* 🔊 Hidden audio element for the tone */}

      <audio
        ref={newQueueAudioRef}
        src="/assets/new-queue.mp3"
        preload="auto"
        style={{ display: "none" }}
      />

      <div className="app ">
        {/* Header */}
        <header className="header">
          <div className="brand">
            <div className="brand-icon" aria-hidden>
              🌿
            </div>
            <div>
              <div className="eyebrow">Queue Display</div>
              <h1 className="title">Currently Serving</h1>
            </div>
          </div>

          {/* Last updated + tiny spinner (non-blocking) */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="pill" title="Last Updated">
              {lastUpdated || "--:--"}
            </div>
            {loading && (
              <div
                className="spinner"
                title="Refreshing…"
                style={{ width: 18, height: 18, borderWidth: 2 }}
              />
            )}
          </div>

          <button
            onClick={() => {
              try {
                win.close();
              } catch {}
            }}
            className="btn"
            title="Close window"
          >
            Close
          </button>
        </header>

        {/* Two-column layout: Left (Now Serving), Right (YouTube) */}
        <main className="main two-col">
          {/* LEFT: Serving content (always visible; placeholders if empty) */}
          <section className="left">
            <div className={`hero ${topChanged ? "hero-glow" : ""}`}>
              <div className="hero-body">
                <section
                  className="grid gridwindows"
                  style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
                >
                  {serving.map((q, idx) => {
                    const pr = prioritBadge(q.priorit);
                    return (
                      <div
                        key={q.id}
                        className={`card ${idx === 0 ? "card-active" : ""}`}
                        style={{
                          flex: "1 1 240px",
                          minWidth: 240,
                          maxWidth: 420,
                        }} // adjust maxWidth if you want
                      >
                        <div className="flex">
                          <div className="card-row">
                            <span className="card-queue">{q.que_number}</span>
                            <span
                              className="badge"
                              style={{ background: pr.bg, color: pr.color }}
                            >
                              {pr.label}
                            </span>
                          </div>
                          <div className="card-service">{q.service_name}</div>
                          <div className="card-meta">
                            <span className="dot" />
                            <span className="meta-text">
                              {q.status ?? "serving"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              </div>
            </div>

            {/* Cards grid */}
          </section>

          {/* RIGHT: Media panel (Embedded YouTube) */}
          <aside className="right">
            <div className="media-card">
              <div className="media-header">
                <div className="media-title">Announcements</div>
                <div className="media-sub">Watch while you wait</div>
              </div>

              <div className="video-wrap">
                {youtubeEmbedUrl ? (
                  <iframe
                    className="video"
                    // ✅ Your exact embed URL goes here:
                    src={youtubeEmbedUrl}
                    title="YouTube video player"
                    // React prop names
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="video-placeholder">
                    <div className="video-logo">▶</div>
                    <div className="video-text">
                      YouTube area (add embed URL)
                    </div>
                  </div>
                )}
              </div>

              {/* Optional mini-tips */}
              <div className="media-tips">
                <span>🌳 Please keep the area clean.</span>
                <span>♻️ Support eco-friendly practices.</span>
                <span>📢 Follow the screen for updates.</span>
              </div>
            </div>
          </aside>
        </main>

        {/* Footer ticker — subtle and friendly */}
        <footer className="footer">
          <div className="ticker">
            <div className="ticker-track">
              <span>📄 Please prepare your IDs &amp; documents • </span>
              <span>⏳ Thank you for your patience • </span>
              <span>✅ priorit lanes available for seniors &amp; PWD • </span>
              <span>🌱 Together, let’s care for our environment • </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );

  // priorit badge helper
  function prioritBadge(p?: string) {
    const pr = (p || "").toLowerCase();
    if (pr === "senior" || pr === "pwd")
      return { label: pr.toUpperCase(), bg: "var(--badge-red)", color: "#fff" };
    if (pr === "regular")
      return { label: "REGULAR", bg: "var(--badge-blue)", color: "#fff" };
    return {
      label: (p || "N/A").toUpperCase(),
      bg: "var(--badge-gray)",
      color: "#fff",
    };
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
  const openNewWindow = () => {
    // Center the popup
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

    // Inject styles + root container (light theme WITHOUT background image)
    win.document.open();
    win.document.write(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Now Serving</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      :root{
        --paper:#ffffff;
        --bg-tint: rgba(255,255,255,.85);
        --stroke:rgba(15, 23, 42, 0.10);
        --muted:#5b728a; /* slate-500-ish */
        --text:#0f172a;  /* slate-900 */
        --glass:rgba(255,255,255,0.55);
        --accent-grad:linear-gradient(135deg, #34d399, #22c55e);   /* emerald */
        --accent2-grad:linear-gradient(135deg, #60a5fa, #6366f1);  /* blue/indigo */
        --badge-red:#ef4444; --badge-blue:#2563eb; --badge-gray:#94a3b8;
        --soft-shadow:0 14px 36px rgba(2, 8, 23, .12);
      }
      *{box-sizing:border-box}
      html,body{height:100%}
      body{
        margin:0;
        color:var(--text);
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        background:#ffffff; /* plain background, no image */
      }
      .app{min-height:100%;display:flex;flex-direction:column}
      .header{
        display:flex;align-items:center;justify-content:space-between;gap:16px;
        padding:16px 20px;border-bottom:1px solid var(--stroke);
        background:linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.75));
        backdrop-filter:saturate(140%) blur(8px); position:sticky;top:0;
      }
      .brand{display:flex;align-items:center;gap:12px}
      .brand-icon{
        width:44px;height:44px;border-radius:12px;background:var(--accent-grad);
        display:grid;place-items:center;font-size:20px;color:#fff;box-shadow:var(--soft-shadow)
      }
      .eyebrow{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
      .title{margin:2px 0 0;font-size:22px;font-weight:800;letter-spacing:-.02em}
      .pill{
        background:linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.8));
        border:1px solid var(--stroke);
        padding:8px 12px;border-radius:999px;font-weight:800;
        font-variant-numeric:tabular-nums; box-shadow:var(--soft-shadow)
      }
      .btn{
        background:linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,.85));
        border:1px solid var(--stroke);color:var(--text);
        padding:8px 12px;border-radius:10px;font-weight:800;cursor:pointer;
        transition:.2s transform,.2s background; box-shadow:var(--soft-shadow)
      }
      .btn:hover{transform:translateY(-1px); background:linear-gradient(180deg, #fff, #f8fafc)}

      .main{flex:1;padding:18px 20px;display:grid;gap:16px}
      .two-col{ grid-template-columns: 1.5fr 1fr; }
      @media (max-width: 1024px){ .two-col{ grid-template-columns: 1fr; } }

      .left{display:flex;flex-direction:column;gap:16px}
      .right{position:relative}

      .hero{
        background:linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.8));
        border:1px solid var(--stroke);border-radius:18px;padding:16px;
        box-shadow:var(--soft-shadow)
      }
      @keyframes glow{0%,100%{box-shadow:var(--soft-shadow)}50%{box-shadow:0 0 0 10px rgba(34,197,94,.18), var(--soft-shadow)}}
      .hero.hero-glow{animation:glow 1.8s ease-in-out 1}
      .hero-top{display:flex;align-items:center;justify-content:space-between}
      .count{font-weight:800}
      .hero-body{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:10px}
      .queue-badge{
        background:var(--accent-grad); border-radius:14px; padding:10px 14px;
        display:flex; align-items:center; min-width:240px; justify-content:center;
        box-shadow:0 14px 34px rgba(34,197,94,.25);
      }
      .queue-number{
        color:#052e16; font-weight:900; letter-spacing:.02em;
        font-size:46px; line-height:1; font-variant-numeric:tabular-nums;
        text-shadow:0 1px 0 rgba(255,255,255,.4)
      }
      .hero-info{display:flex;flex-direction:column;gap:6px;min-width:240px}
      .service{font-size:18px;font-weight:800;letter-spacing:.01em}
      .badges{display:flex;align-items:center;gap:10px}
      .badge{padding:6px 10px;border-radius:999px;font-size:12px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#fff;box-shadow:var(--soft-shadow)}
      .status-dot{width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 8px rgba(34,197,94,.18)}
      .status-text{color:var(--muted);font-weight:800}

      .grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:12px}
      .card{
        background:linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,.9));
        border:1px solid var(--stroke);border-radius:14px;padding:12px;
        display:flex;flex-direction:column;gap:8px;transition:.2s transform,.2s box-shadow; box-shadow:var(--soft-shadow)
      }
      .card:hover{transform:translateY(-2px)}
      .card-active{outline:2px solid rgba(34,197,94,.35)}
      .card-row{display:flex;align-items:center;justify-content:space-between}
      .card-queue{
        font-size:24px;font-weight:900;letter-spacing:.02em;
        background:var(--accent2-grad); -webkit-background-clip:text; background-clip:text; color:transparent;
        text-shadow:0 1px 0 rgba(255,255,255,.4);
        font-variant-numeric:tabular-nums;
      }
      .card-service{font-size:14px;color:#0f172a}
      .card-meta{display:flex;align-items:center;gap:8px;color:#muted}
      .dot{width:8px;height:8px;border-radius:50%;background:#22c55e}

      /* Media (YouTube) panel */
      .media-card{
        background:linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.82));
        border:1px solid var(--stroke);border-radius:18px; padding:14px;
        box-shadow:var(--soft-shadow); display:flex; flex-direction:column; gap:12px;
      }
      .media-header{display:flex; align-items:baseline; gap:10px; justify-content:space-between}
      .media-title{font-weight:800; font-size:18px}
      .media-sub{color:var(--muted); font-weight:600; font-size:12px}
      .video-wrap{position:relative; width:100%; padding-top:56.25%; border-radius:12px; overflow:hidden; background:#f1f5f9; border:1px solid var(--stroke)}
      .video{position:absolute; inset:0; width:100%; height:100%; border:0; border-radius:12px}
      .video-placeholder{position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; color:#334155}
      .video-logo{font-size:36px; opacity:.7}
      .video-text{font-weight:700}
      .media-tips{display:flex; gap:12px; flex-wrap:wrap; color:#334155}
      .media-tips span{background:rgba(255,255,255,.8); border:1px solid var(--stroke); padding:6px 10px; border-radius:999px; font-weight:700}

      .footer{border-top:1px solid var(--stroke);padding:8px 0;margin-top:auto;background:linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.75))}
      .ticker{overflow:hidden}
      .ticker-track{display:inline-block;white-space:nowrap;animation:ticker 18s linear infinite;color:#1f2937}
      @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

      .spinner{width:30px;height:30px;border-radius:50%;border:3px solid rgba(2,8,23,.12);border-top-color:#22c55e;animation:spin 1s linear infinite}
      @keyframes spin{to{transform:rotate(360deg)}}

      @media (max-width: 640px){
        .title{font-size:18px}
        .queue-number{font-size:38px}
        .service{font-size:16px}
      }
    </style>
  </head>
  <body>
    <div id="popup-root"></div>
  </body>
</html>`);
    win.document.close();

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
      className={`ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition flex items-center ${className ?? ""}`}
    >
      <WindowIcon className="h-6 w-6 text-yellow-400 hover:text-pink-500 transition-colors duration-300" />
    </button>
  );
};
