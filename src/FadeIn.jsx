import { useRef, useEffect, useState } from "react";

export default function FadeIn({ children }) {
  const ref = useRef();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => { if (ref.current) obs.unobserve(ref.current); };
  }, []);

  return (
    <div ref={ref} className={`fade-in${show ? " show" : ""}`}>
      {children}
    </div>
  );
}
