import { useState, useEffect, useRef, MouseEvent, TouchEvent } from 'react';
import { 
  Cake, Sparkles, Star, ArrowRight, Mail, ChevronLeft, ChevronRight, 
  Camera, Smile, Sun, Laugh, Heart, Wind, Gift, PartyPopper, Flower2,
  Music, VolumeX 
} from 'lucide-react';

const SECTIONS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'message', label: 'Message' },
  { id: 'photos', label: 'Photos' },
  { id: 'cake', label: 'Cake' },
  { id: 'wishes', label: 'Wishes' },
  { id: 'sky', label: 'Magic Sky' }
];

const PHOTOS = [
  { src: "/images/cherished.jpg", label: "Cherished Moment", icon: Smile },
  { src: "/images/smile.jpg", label: "Beautiful Smile", icon: Smile },
  { src: "/images/golden.jpg", label: "Golden Hour", icon: Sun },
  { src: "/images/shinning.jpg", label: "Always Shining", icon: Sparkles },
  { src: "/images/family.jpg", label: "Beloved Family", icon: Laugh },
  { src: "/images/elegance.jpg", label: "Elegance", icon: Sparkles },
  { src: "/images/eyes.jfif", label: "Killer Eyes", icon: Sparkles },
  { src: "/images/friends.jpg", label: "Moments With Friends", icon: Star },
];

const WISHES = [
  { icon: Sun, text: "May your life be as colorful and vibrant as a rainbow after the rain." },
  { icon: Star, text: "Wishing you success in everything you touch this year and always." },
  { icon: Heart, text: "May you spread your wings and soar to new heights this birthday!" },
  { icon: Flower2, text: "Like a sunflower, may you always turn towards the light and grow." },
  { icon: Laugh, text: "Here's to more laughter, more adventures, and more beautiful moments!" },
  { icon: Sparkles, text: "Luck, love, and happiness — may they follow you everywhere you go." }
];

const LANTERN_MESSAGES = [
  "You are magical ✨",
  "Always shining 🌟",
  "Sending love 💖",
  "Infinite joy 😊",
  "Dream big 🎈",
  "Stay amazing 🌸",
  "Heart full of stars ⭐",
  "Pure sunshine ☀️"
];

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isBlown, setIsBlown] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [lanterns, setLanterns] = useState<{ id: number, x: number, message: string }[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // AUTO SCROLL DELAY
  const AUTO_SCROLL_DELAY = 6000;

  useEffect(() => {
    // Scroll detection
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setCurrentSection(index);
          }
        }
      });
    }, { threshold: 0.4 });

    sectionRefs.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Loader timeout
    const timer = setTimeout(() => {
      hideLoader();
    }, 2500);

    const onDocLoad = () => {
      setTimeout(() => {
        hideLoader();
      }, 800);
    };

    window.addEventListener('load', onDocLoad);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', onDocLoad);
    };
  }, []);

  useEffect(() => {
    // Progress calculation
    const pct = (currentSection / (SECTIONS.length - 1)) * 100;
    setProgressBarWidth(pct);
  }, [currentSection]);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToSection(currentSection + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToSection(currentSection - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection]);

  const hideLoader = () => {
    setIsLoaderVisible(false);
    triggerConfetti(80);
    startAutoScroll();
  };

  const goToSection = (index: number) => {
    if (index < 0 || index >= SECTIONS.length) return;
    setCurrentSection(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    resetAutoScroll();
  };

  const startAutoScroll = () => {
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setInterval(() => {
      setCurrentSection(prev => {
        if (prev < SECTIONS.length - 1) {
          const next = prev + 1;
          sectionRefs.current[next]?.scrollIntoView({ behavior: 'smooth' });
          return next;
        } else {
          if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
          return prev;
        }
      });
    }, AUTO_SCROLL_DELAY);
  };

  const resetAutoScroll = () => {
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    startAutoScroll();
  };

  const stopAutoScroll = () => {
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
  };

  const triggerConfetti = (count = 60) => {
    const colors = ['#f472b6','#a78bfa','#fbbf24','#34d399','#60a5fa','#fb923c','#f43f5e'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = Math.random() * 10 + 5;
      const isCircle = Math.random() > 0.5;
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        width: ${size}px;
        height: ${isCircle ? size : size * 2.5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${isCircle ? '50%' : '2px'};
        animation-duration: ${Math.random() * 2 + 2}s;
        animation-delay: ${Math.random() * 0.8}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  };

  const handleBlowCandles = () => {
    setIsBlown(true);
    triggerConfetti(100);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const openLightbox = (src: string) => {
    setLightboxImg(src);
  };

  const releaseLantern = (e: MouseEvent | TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = 'touches' in e ? (e as any).touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
    const message = LANTERN_MESSAGES[Math.floor(Math.random() * LANTERN_MESSAGES.length)];
    const id = Date.now();
    
    setLanterns(prev => [...prev, { id, x, message }]);
    
    // Auto-remove after animation
    setTimeout(() => {
      setLanterns(prev => prev.filter(l => l.id !== id));
    }, 10000);
  };

  return (
    <div onWheel={stopAutoScroll} onTouchStart={stopAutoScroll}>
      {/* LOADER */}
      <div id="loader" className={!isLoaderVisible ? 'hide' : ''}>
        <div className="loader-cake"><Cake /></div>
        <div className="loader-text">Preparing something special...</div>
        <div className="loader-bar"><div className="loader-fill"></div></div>
      </div>

      {/* PROGRESS BAR */}
      <div className="auto-progress" style={{ width: `${progressBarWidth}%` }}></div>

      {/* PARTICLES */}
      <div className="particles">
        {Array.from({ length: 30 }).map((_, i) => {
          const colors = ['#f472b6','#a78bfa','#fbbf24','#34d399','#60a5fa'];
          const size = Math.random() * 4 + 2;
          return (
            <div 
              key={i} 
              className="particle" 
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                background: colors[Math.floor(Math.random() * colors.length)],
                animationDuration: `${Math.random() * 8 + 6}s`,
                animationDelay: `${Math.random() * 6}s`
              }}
            />
          );
        })}
      </div>

      {/* NAV DOTS */}
      <div className="nav-dots">
        {SECTIONS.map((section, i) => (
          <button 
            key={section.id}
            className={`nav-dot ${currentSection === i ? 'active' : ''}`}
            onClick={() => goToSection(i)}
          >
            <span className="nav-label">{section.label}</span>
          </button>
        ))}
      </div>

      {/* MUSIC TOGGLE */}
      <button 
        className={`music-toggle ${isMusicPlaying ? 'playing' : ''}`} 
        onClick={toggleMusic}
        title={isMusicPlaying ? "Pause Music" : "Play Music"}
      >
        <span className="music-icon-wrapper">
          {isMusicPlaying ? <Music className="music-icon-active" /> : <VolumeX className="music-icon-inactive" />}
        </span>
        <span className="music-label">{isMusicPlaying ? "Music On" : "Play Music"}</span>
        <div className="music-bars">
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
        </div>
      </button>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div className="lightbox active" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Photo" />
        </div>
      )}

      <main>
        {/* 0: HERO */}
        <div 
          ref={el => sectionRefs.current[0] = el}
          className="page-section hero"
          data-section="Welcome"
        >
          <img className="hero-photo" src="/images/zara2.jpeg" alt="Birthday Person" />
          <div className="hero-badge"><Sparkles /> It's a Special Day!</div>
          <h1>Happy Birthday<br />Zara</h1>
          <p className="hero-sub">Wishing you the most magical day <Star /></p>
          <button className="nav-btn" onClick={() => goToSection(1)}>Begin the Journey <ArrowRight /></button>
        </div>

        {/* 1: SPECIAL MESSAGE */}
        <div 
          ref={el => sectionRefs.current[1] = el}
          className="page-section"
          data-section="Message"
          id="sec-message"
        >
          <h2 className="section-title"><span className="title-icon"><Mail /></span>A Special Message</h2>
          <div className="message-card">
            <p>Dear Zara,</p>
            <br />
            <p>On this beautiful day, I want you to know how incredibly special you are. Your smile lights up every room, your kindness touches every heart, and your spirit inspires everyone around you.</p>
            <br />
            <p>May this new year of your life bring you endless joy, boundless love, and all the dreams your heart desires. You deserve every bit of happiness the world has to offer. <Flower2 className="inline-icon" /></p>
            <br />
            <p>Here's to another year of adventures, laughter, and beautiful memories.<br/> Never stop being the amazing person you are!</p>
            <div className="signature">With all my love <Heart /></div>
          </div>
          <div className="section-nav">
            <button className="nav-btn" onClick={() => goToSection(0)}><ChevronLeft /> Back</button>
            <button className="nav-btn" onClick={() => goToSection(2)}>Next <ChevronRight /></button>
          </div>
        </div>

        {/* 2: PHOTOS */}
        <div 
          ref={el => sectionRefs.current[2] = el}
          className="page-section"
          data-section="Photos"
          id="sec-photos"
        >
          <h2 className="section-title"><span className="title-icon"><Camera /></span>Cherished Moments</h2>
          <div className="gallery">
            {PHOTOS.map((photo, i) => (
              <div key={i} className="gallery-item" onClick={() => openLightbox(photo.src)}>
                <img loading="lazy" src={photo.src} alt={photo.label} />
                <div className="gallery-overlay">
                  <span><photo.icon /> {photo.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-nav">
            <button className="nav-btn" onClick={() => goToSection(1)}><ChevronLeft /> Back</button>
            <button className="nav-btn" onClick={() => goToSection(3)}>Next <ChevronRight /></button>
          </div>
        </div>

        {/* 3: CAKE */}
        <div 
          ref={el => sectionRefs.current[3] = el}
          className="page-section"
          data-section="Cake"
          id="sec-cake"
        >
          <h2 className="section-title"><span className="title-icon"><Cake /></span>Make a Wish!</h2>
          <div className="cake-section">
            <div className={`cake-container ${isBlown ? 'blown' : ''}`}>
              {!isBlown && <div className="candle-glow"></div>}
              <div 
                className="cake-emoji" 
                style={{ filter: isBlown ? 'drop-shadow(0 0 40px rgba(251,191,36,0.6))' : '' }}
              >
                <Cake size={128} />
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Close your eyes, make a wish, and blow! <Wind className="inline-icon" /></p>
            <button className="blow-btn" onClick={handleBlowCandles} disabled={isBlown}>
              <Wind /> {isBlown ? 'WISH GRANTED! ✨' : 'Blow the Candles!'}
            </button>
          </div>
          <div className="section-nav">
            <button className="nav-btn" onClick={() => goToSection(2)}><ChevronLeft /> Back</button>
            <button className="nav-btn" onClick={() => goToSection(4)}>Next <ChevronRight /></button>
          </div>
        </div>

        {/* 4: WISHES */}
        <div 
          ref={el => sectionRefs.current[4] = el}
          className="page-section"
          data-section="Wishes"
          id="sec-wishes"
        >
          <h2 className="section-title"><span className="title-icon"><Gift /></span>Birthday Wishes</h2>
          <div className="wishes-grid">
            {WISHES.map((wish, i) => (
              <div key={i} className="wish-card">
                <div className="wish-icon"><wish.icon /></div>
                <p className="wish-text">{wish.text}</p>
              </div>
            ))}
          </div>
          <div className="section-nav">
            <button className="nav-btn" onClick={() => goToSection(3)}><ChevronLeft /> Back</button>
            <button className="nav-btn" onClick={() => goToSection(5)}>Next <ChevronRight /></button>
          </div>
        </div>

        {/* 5: MAGIC SKY */}
        <div 
          ref={el => sectionRefs.current[5] = el}
          className="page-section"
          data-section="Sky"
          id="sec-sky"
        >
          <h2 className="section-title"><span className="title-icon"><Sparkles /></span>The Magic Sky</h2>
          <div className="sky-container" onClick={releaseLantern}>
            <div className="sky-tip">Click anywhere to release a wish lantern...</div>
            {lanterns.map(lantern => (
              <div 
                key={lantern.id} 
                className="lantern"
                style={{ left: `${lantern.x}px` }}
              >
                <div className="lantern-glow"></div>
                <div className="lantern-body">
                  <span className="lantern-message">{lantern.message}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-nav" style={{ marginTop: '2rem', position: 'relative', zIndex: 10 }}>
            <button className="nav-btn" onClick={() => goToSection(4)}><ChevronLeft /> Back</button>
          </div>
        </div>

        <footer>
          <p>Made with <span className="heart"><Heart /></span> just for you</p>
          <p style={{ marginTop: '.5rem', fontSize: '.75rem', color: 'rgba(255,255,255,0.3)' }}>
            <span className="footer-cake"><Cake /> Happy Birthday Zara</span>
          </p>
        </footer>
      </main>

      {/* AUDIO */}
      <audio ref={audioRef} loop preload="none">
        <source src="https://files.catbox.moe/j0gnqj.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
