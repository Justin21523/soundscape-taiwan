import { useState, useEffect, useRef } from "react";

export default function Gallery({ images = [], interval = 3500 }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const timerRef = useRef();

  // 切換圖片時做淡入動畫
  const showImage = (nextIdx) => {
    setFade(true);
    setTimeout(() => {
      setIdx(nextIdx);
      setFade(false);
    }, 280); // 這裡控制淡出時長
  };

  // 自動切換（可滑鼠移入時暫停）
  useEffect(() => {
    timerRef.current = setInterval(() => {
      showImage((idx + 1) % images.length);
    }, interval);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [idx, images, interval]);

  // 手動切換時重置自動輪播
  const manualSet = (i) => {
    clearInterval(timerRef.current);
    showImage(i);
  };


  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 340,
        margin: "0 auto 1.2rem auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={() => {
        timerRef.current = setInterval(() => {
          showImage((idx + 1) % images.length);
        }, interval);
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 160,
          maxHeight: 210,
        }}
      >
        <img
          src={images[idx]}
          alt={`gallery-${idx}`}
          className={`gallery-main ${fade ? "fadeout" : "fadein"}`}
          style={{
            objectFit: "cover",
            borderRadius: "1.1rem",
            width: "100%",
            height: "200px",
            transition: "opacity 0.45s cubic-bezier(.45,.02,.23,1.02)",
            opacity: fade ? 0 : 1,
            boxShadow: fade ? "0 2px 12px #0000" : "0 2px 18px #8881",
          }}
        />
        {/* 左右箭頭 */}
        {images.length > 1 && (
          <>
            <button
              style={{
                position: "absolute", left: -14, top: "50%",
                transform: "translateY(-50%)", background: "#fff", border: "none",
                borderRadius: "50%", width: 30, height: 30, fontSize: 20,
                cursor: "pointer", boxShadow: "0 1px 4px #2222"
              }}
              aria-label="上一張"
              onClick={() => manualSet((idx - 1 + images.length) % images.length)}
            >&#8592;</button>
            <button
              style={{
                position: "absolute", right: -14, top: "50%",
                transform: "translateY(-50%)", background: "#fff", border: "none",
                borderRadius: "50%", width: 30, height: 30, fontSize: 20,
                cursor: "pointer", boxShadow: "0 1px 4px #2222"
              }}
              aria-label="下一張"
              onClick={() => manualSet((idx + 1) % images.length)}
            >&#8594;</button>
          </>
        )}
      </div>
      {/* 底部圓點 */}
      <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
        {images.map((img, i) => (
          <span
            key={i}
            onClick={() => manualSet(i)}
            style={{
              width: 14, height: 14, borderRadius: "50%",
              display: "inline-block",
              background: i === idx ? "#39e" : "#d0d0d0",
              opacity: i === idx ? 1 : 0.68,
              border: i === idx ? "2.2px solid #09f" : "1.6px solid #fff",
              boxShadow: i === idx ? "0 2px 12px #3af6" : "none",
              cursor: "pointer", transition: "background .3s"
            }}
          />
        ))}
      </div>
    </div>
  );
  
}
