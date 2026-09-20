import React, { useEffect, useRef, useState } from "react";

// Reveal
// A tiny scroll-in animation helper. It watches itself with an
// IntersectionObserver and fades/slides into view the first time
// it becomes visible on screen. No extra CSS or packages needed.
//
// Props:
//   direction: "up" | "down" | "left" | "right" | "zoom" | "fade"
//   delay:     transition delay in milliseconds
//   className: extra classes to merge onto the wrapper

const HIDDEN_CLASSES = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  zoom: "scale-95",
  fade: "translate-y-2",
};

function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = HIDDEN_CLASSES[direction] || HIDDEN_CLASSES.up;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : `opacity-0 ${hidden}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default Reveal;