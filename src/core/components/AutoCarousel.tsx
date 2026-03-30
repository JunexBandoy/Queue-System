import React, { useEffect, useState } from "react";

type Props = {
  delay?: number;
  slideClasses?: string[];
};

const AutoCarousel: React.FC<Props> = ({
  delay = 3000,
  slideClasses = [
    "carousel",
    "carousel1",
    "carousel2",
    "carousel3",
    "carousel4",
    "carousel5",
  ],
}) => {
  const [index, setIndex] = useState(0);

  // Auto-slide only
  useEffect(() => {
    if (slideClasses.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideClasses.length);
    }, delay);
    return () => clearInterval(id);
  }, [delay, slideClasses.length]);

  return (
    <div className="relative w-full">
      {/* Viewport */}
      <div className="overflow-hidden w-full">
        {/* Track */}
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 0.5s ease-in-out",
            width: `${slideClasses.length * 100}%`,
            willChange: "transform",
          }}
        >
          {slideClasses.map((cls, i) => (
            <div
              key={i}
              className={cls}
              style={{
                flex: "0 0 100%", // each slide = 100% of viewport width
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoCarousel;
