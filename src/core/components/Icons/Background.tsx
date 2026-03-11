// BGQ.tsx
import React from "react";

interface BGQProps {
  /** data:image/...;base64,... OR a normal URL (e.g., /images/denr-forest.jpg) */
  src: string;
  /** Optional: light overlay for text readability */
  tint?: "none" | "light" | "dark";
  /** Optional: blur intensity in px (applied to the bg image) */
  blur?: number;
  className?: string;
  children?: React.ReactNode; // if you ever want content on top
}

export const BGQ: React.FC<BGQProps> = ({
  src,
  tint = "light",
  blur = 0,
  className = "",
  children,
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Background image */}
      <img
        src={src} // ✅ no url(...) wrapper here
        alt="" // decorative background
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        style={{ filter: blur ? `blur(${blur}px)` : undefined }}
        loading="eager"
        decoding="async"
      />

      {/* Optional tint for readability */}
      {tint !== "none" && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              tint === "light"
                ? "linear-gradient(0deg, rgba(255,255,255,.60), rgba(255,255,255,.60))"
                : "linear-gradient(0deg, rgba(0,0,0,.45), rgba(0,0,0,.45))",
          }}
        />
      )}

      {/* Foreground content slot */}
      {children}
    </div>
  );
};
