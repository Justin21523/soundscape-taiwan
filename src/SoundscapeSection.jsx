import BackgroundCarousel from "./BackgroundCarousel";
import { useState, useRef, useEffect } from "react";
import FadeIn from "./FadeIn";
import Gallery from "./Gallery";
import FadeInStory from "./FadeInStory";

export default function SoundscapeSection() {
    // 用一個 ref 陣列，index 對應 data
    const [data, setData] = useState([]);
    const audioRefs = useRef([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const sectionRefs = useRef([]);
    const innerRefs = useRef([]);
    const [cardHeights, setCardHeights] = useState([]);
    const [shownSections, setShownSections] = useState([]);
    const [storyShow, setStoryShow] = useState(Array(data.length).fill(false));

    useEffect(() => {
        fetch("/assets/soundscape.json")
            .then((res) => res.json())
            .then(setData);
    }, []);

    useEffect(() => {
        function onScroll() {
            const center = window.innerHeight / 2 + window.scrollY;
            let found = 0;
            sectionRefs.current.forEach((el, idx) => {
            if (el) {
                const { top, height } = el.getBoundingClientRect();
                const absTop = window.scrollY + top;
                if (center > absTop && center < absTop + height) found = idx;
            }
            });
            setActiveIdx(found);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [data]); // data 為 section 數量

    //  自動播放音效（每滑到 section 自動播放）
    useEffect(() => {
    if (activeIdx >= 0 && audioRefs.current[activeIdx]) {
        audioRefs.current.forEach((a, i) => {
        if (a) { a.pause(); a.currentTime = 0; }
        });
        const audio = audioRefs.current[activeIdx];
        if (audio) {
        audio.muted = false; // 確保取消靜音
        audio.play().catch(err => {
            // 若無法自動播，可顯示提示「請點擊以開啟完整聲音體驗」
            console.warn('音效無法自動播放', err);
        });
        }
    }
    }, [activeIdx]);

    useEffect(() => {
        // 當 data 變化時，測量所有主題內容高度
        if (data.length > 0) {
            setTimeout(() => {
            setCardHeights(innerRefs.current.map(ref => ref ? ref.offsetHeight : 400));
            }, 80); // 給一點延遲讓 render 完成
        }
    }, [data]);

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            entries => {
            entries.forEach(entry => {
                const idx = Number(entry.target.dataset.idx);
                if (entry.isIntersecting) {
                setShownSections(prev => {
                    const copy = [...prev];
                    copy[idx] = true;
                    return copy;
                });
                } else {
                setShownSections(prev => {
                    const copy = [...prev];
                    copy[idx] = false;
                    return copy;
                });
                }
            });
            },
            { threshold: 0.5 }
        );
        sectionRefs.current.forEach(el => { if (el) observer.observe(el); });
        return () => sectionRefs.current.forEach(el => { if (el) observer.unobserve(el); });
    }, [data]);
    
    useEffect(() => {
    setStoryShow(Array(data.length).fill(false));
    }, [data]);

    useEffect(() => {
        // 重設所有 section 的 show 狀態，只有當前 activeIdx 為 true
        setStoryShow(arr => arr.map((v, idx) => idx === activeIdx));
    }, [activeIdx, data.length]);


    // 主題標題加 emoji、icon、裝飾
    const titleEmoji = {
        "捷運站體": "🚇",
        "阿里山鳥鳴": "🌲🐦",
        "基隆海浪": "🌊⛴️",
        "夜市叫賣": "🎤🛒",
        "廟會鑼鼓": "🏮🥁",
    };

    // 主題底色或主題漸層
    const themeClass = {
        "城市交通": "theme-mrt",
        "自然環境": "theme-alishan",
        "城市海岸": "theme-keelung",
        "城市聲色": "theme-nightmarket",
        "民俗節慶": "theme-temple",
    };

   return (
        <main className="soundscape-main">
            {data.length === 0 && (
                <div style={{ color: "gray" }}>
                    沒有載入到任何聲景主題，請檢查 soundscape.json 路徑與內容
                </div>
            )}
            {data.map((item, idx) => {

            return (
                <section
                key={item.id}
                ref={el => sectionRefs.current[idx] = el}
                data-idx={idx}
                className={`soundscape-block ${shownSections[idx] ? 'show' : ''}`}
                style={{
                    minHeight: "68vh",
                    height: (cardHeights[idx] || 400) + "px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: "3vw", // 讓左右區域距離合適
                    background: "linear-gradient(110deg, #f8fafd 80%, #e4f0fc 100%)",
                    padding: "4vw 0",
                    margin: "3vw 0",
                    borderRadius: "2.5rem",
                    boxShadow: "0 4px 28px #b6c7df2e"
                }}
                >
                {/* 左側背景圖輪播，高度等於右側卡片 */}
                <div
                style={{
                    flex: "0 0 480px",        // 這裡設成 480～500px
                    width: 480, height: 480,  // 更大圓
                    /*flex: "0 0 clamp(340px, 36vw, 540px)", // 自適應
                    width: "clamp(340px, 36vw, 540px)",
                    height: "clamp(340px, 36vw, 540px)",*/
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#e9f2f9",
                    boxShadow: "0 8px 38px 0 #d7eafc72, 0 0 0 18px #e7f0fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "clamp(36px, 8vw, 120px)", // 讓整體圓形背景往右靠
                    transition: "width 0.4s, height 0.4s, margin 0.4s"
                }}
                    >
                    <BackgroundCarousel
                        images={item.backgrounds || []}
                        sectionActive={activeIdx === idx}
                        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                </div>

                {/* 右側主題內容卡片 */}
                <div
                    className="soundscape-inner"
                    ref={el => innerRefs.current[idx] = el}
                    style={{
                    width: "40vw", minWidth: 250, maxWidth: 540,
                    background: "rgba(255,255,255,0.98)",
                    borderRadius: "2rem",
                    boxShadow: "0 2px 18px #aaf2",
                    padding: "2.5rem 2.1rem 2.2rem 2.1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    zIndex: 2,
                    position: "relative",
                    height: "auto"
                    }}>
                    {/* 圖＋描述 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="soundscape-title">{titleEmoji[item.title] || "🎧"} {item.title}</h2>
                    <div className="soundscape-media">
                        <img src={item.main_image} alt={item.title} className="main-image" />
                        <audio ref={el => (audioRefs.current[idx] = el)} src={item.sound} muted autoPlay/>
                    </div>
                    <Gallery images={item.gallery} />
                    <p className="soundscape-desc">{item.desc}</p>
                    <div className="soundscape-meta">
                        <span>📍 {item.location}</span>
                        <span>🗓️ {item.date}</span>
                    </div>
                    </div>
                    {/* 右側：故事區（滑入動畫） */}
                    <div className={`soundscape-story story-fadein${storyShow[idx] ? ' show' : ''}`}>
                        {item.story}
                    </div>
                </div>
                </section>
            );
            })}
        </main>
    );
}
