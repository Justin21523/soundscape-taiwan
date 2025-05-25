import { useState, useEffect, useRef } from "react";

export default function BackgroundCarousel({ images = [], sectionActive }) {
    const [bgIdx, setBgIdx] = useState(0);
    const [fade, setFade] = useState(false);
    const timerRef = useRef();

    // 啟動輪播
    useEffect(() => {
        if (sectionActive && images.length > 1) {
        timerRef.current = setInterval(() => {
            setFade(true);
            setTimeout(() => {
            setBgIdx(idx => (idx + 1) % images.length);
            setFade(false);
            }, 350); // 淡出
        }, 4200);
        }
        return () => clearInterval(timerRef.current);
    }, [sectionActive, images]);

    // 每次 sectionActive/切換主題都回到第一張
    useEffect(() => { setBgIdx(0); }, [sectionActive, images]);

    return (
        <div
        className={`bg-carousel ${fade ? "fadeout" : "fadein"}`}
        style={{
            width: "100%",
            height: "100%",
            background: images.length
            ? `url(${images[bgIdx]}) center center/cover no-repeat`
            : "#e8f0fa",
            transition: "opacity 0.8s cubic-bezier(.55,.13,.18,.99)",
            opacity: fade ? 0 : 1,
            filter: "blur(1.3px) brightness(0.89) grayscale(0.13)"
        }}
        aria-hidden="true"
        />
    );
}
