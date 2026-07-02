"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  // Start as null so server & client both render "--" on the first pass,
  // preventing a hydration mismatch from the ever-changing Date.now().
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return time;
}

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "section:not(#cover):not(#hero), #hero .hero-inner, #quran, .event-card, .couple-card, .couple-bismillah, .gallery-item, .gift-card"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

// ── Music player hook ───────────────────────────────────────────────────────
function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const autoPlay = () => {
    const audio = audioRef.current;
    if (!audio || isPlaying) return;
    audio.play().then(() => setIsPlaying(true)).catch(() => { });
  };

  return { audioRef, isPlaying, toggle, autoPlay };
}

// ── Page component ──────────────────────────────────────────────────────────
export default function Home() {
  const weddingDate = new Date("2026-07-08T09:00:00+08:00");
  const countdown = useCountdown(weddingDate);
  const { audioRef, isPlaying, toggle, autoPlay } = useMusicPlayer();
  const [isOpened, setIsOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [coverFading, setCoverFading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // Kunci scroll saat cover masih tampil, buka saat konten dibuka
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened]);

  const handleOpen = () => {
    autoPlay();
    // Step 1: fade out cover
    setCoverFading(true);
    setTimeout(() => {
      // Step 2: show transition overlay
      setIsAnimating(true);
      // Step 3: after 3.2s, reveal main content
      setTimeout(() => {
        setIsOpened(true);
        setIsAnimating(false);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 3200);
    }, 600);
  };

  useScrollReveal();

  const pad = (n: number | null) => n === null ? "--" : String(n).padStart(2, "0");
  const days = countdown?.days ?? null;
  const hours = countdown?.hours ?? null;
  const minutes = countdown?.minutes ?? null;
  const seconds = countdown?.seconds ?? null;


  return (
    <>
      {/* ══════════════════════════════ COVER ══════════════════════════════ */}
      {!isOpened && (
        <section id="cover" style={coverFading ? { animation: "coverFadeOut .6s ease forwards" } : {}}>
          {/* Bugis corner ornaments */}
          <div className="cover-ornament">
            <svg
              className="bugis-top"
              style={{ top: 32, left: "50%", transform: "translateX(-50%)" }}
              viewBox="0 0 200 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M100 2 L120 20 L100 38 L80 20 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".6" />
              <path d="M60 2 L80 20 L60 38 L40 20 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".35" />
              <path d="M140 2 L160 20 L140 38 L120 20 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".35" />
              <line x1="0" y1="20" x2="40" y2="20" stroke="#C9A84C" strokeWidth=".8" opacity=".3" />
              <line x1="160" y1="20" x2="200" y2="20" stroke="#C9A84C" strokeWidth=".8" opacity=".3" />
            </svg>

            <svg
              className="bugis-bottom"
              style={{ bottom: 32, left: "50%", transform: "translateX(-50%) rotate(180deg)" }}
              viewBox="0 0 200 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M100 2 L120 20 L100 38 L80 20 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".6" />
              <path d="M60 2 L80 20 L60 38 L40 20 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".35" />
              <path d="M140 2 L160 20 L140 38 L120 20 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".35" />
              <line x1="0" y1="20" x2="40" y2="20" stroke="#C9A84C" strokeWidth=".8" opacity=".3" />
              <line x1="160" y1="20" x2="200" y2="20" stroke="#C9A84C" strokeWidth=".8" opacity=".3" />
            </svg>

            {/* side ornaments */}
            <svg style={{ position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", opacity: .2 }} width="40" height="200" viewBox="0 0 40 200">
              <line x1="20" y1="0" x2="20" y2="200" stroke="#C9A84C" strokeWidth=".8" />
              <path d="M20 40 L32 60 L20 80 L8 60 Z" stroke="#C9A84C" strokeWidth="1" fill="none" />
              <path d="M20 100 L32 120 L20 140 L8 120 Z" stroke="#C9A84C" strokeWidth="1" fill="none" />
            </svg>
            <svg style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", opacity: .2 }} width="40" height="200" viewBox="0 0 40 200">
              <line x1="20" y1="0" x2="20" y2="200" stroke="#C9A84C" strokeWidth=".8" />
              <path d="M20 40 L32 60 L20 80 L8 60 Z" stroke="#C9A84C" strokeWidth="1" fill="none" />
              <path d="M20 100 L32 120 L20 140 L8 120 Z" stroke="#C9A84C" strokeWidth="1" fill="none" />
            </svg>
          </div>

          <div className="cover-inner">
            <p className="cover-label">Undangan Pernikahan</p>

            <svg width="64" height="32" viewBox="0 0 64 32" fill="none" style={{ marginBottom: 20 }}>
              <path d="M32 2 L44 12 L56 4 L52 16 L62 24 L48 22 L42 30 L32 24 L22 30 L16 22 L2 24 L12 16 L8 4 L20 12 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".7" />
            </svg>

            <div className="cover-names">
              <span className="cover-name-groom">Ilyas</span>
              <span className="ampersand">&amp;</span>
              <span className="cover-name-bride">Hikmah</span>
            </div>

            <p className="cover-date">Rabu, 8 Juli 2026</p>

            <a className="scroll-btn" onClick={handleOpen} style={{ cursor: "pointer" }}>
              <span>Open Invitation</span>
            </a>
          </div>
        </section>
      )}

      {/* ══════════════════════════════ TRANSITION OVERLAY ══════════════ */}
      {isAnimating && (
        <div className="opening-overlay">
          <div className="opening-bg" />
          {/* Ornamen atas */}
          <svg className="opening-ornament-top" viewBox="0 0 300 80" fill="none">
            <path d="M150 4 L170 24 L150 44 L130 24 Z" stroke="#C9A84C" strokeWidth="1.2" fill="none" opacity=".8" />
            <path d="M100 4 L120 24 L100 44 L80 24 Z" stroke="#C9A84C" strokeWidth=".8" fill="none" opacity=".45" />
            <path d="M200 4 L220 24 L200 44 L180 24 Z" stroke="#C9A84C" strokeWidth=".8" fill="none" opacity=".45" />
            <path d="M50 4 L70 24 L50 44 L30 24 Z" stroke="#C9A84C" strokeWidth=".6" fill="none" opacity=".2" />
            <path d="M250 4 L270 24 L250 44 L230 24 Z" stroke="#C9A84C" strokeWidth=".6" fill="none" opacity=".2" />
            <line x1="0" y1="24" x2="30" y2="24" stroke="#C9A84C" strokeWidth=".6" opacity=".3" />
            <line x1="270" y1="24" x2="300" y2="24" stroke="#C9A84C" strokeWidth=".6" opacity=".3" />
          </svg>
          {/* Konten tengah */}
          <div className="opening-content">
            <p className="opening-bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            <div className="opening-divider" />
            <p className="opening-label">Dengan memohon rahmat Allah SWT</p>
            <div className="opening-names">
              <span className="opening-name">Ilyas</span>
              <span className="opening-amp">&amp;</span>
              <span className="opening-name">Hikmah</span>
            </div>
            <p className="opening-date">Rabu, 8 Juli 2026</p>
          </div>
          {/* Ornamen bawah */}
          <svg className="opening-ornament-bottom" viewBox="0 0 300 80" fill="none">
            <path d="M150 4 L170 24 L150 44 L130 24 Z" stroke="#C9A84C" strokeWidth="1.2" fill="none" opacity=".8" />
            <path d="M100 4 L120 24 L100 44 L80 24 Z" stroke="#C9A84C" strokeWidth=".8" fill="none" opacity=".45" />
            <path d="M200 4 L220 24 L200 44 L180 24 Z" stroke="#C9A84C" strokeWidth=".8" fill="none" opacity=".45" />
            <path d="M50 4 L70 24 L50 44 L30 24 Z" stroke="#C9A84C" strokeWidth=".6" fill="none" opacity=".2" />
            <path d="M250 4 L270 24 L250 44 L230 24 Z" stroke="#C9A84C" strokeWidth=".6" fill="none" opacity=".2" />
            <line x1="0" y1="24" x2="30" y2="24" stroke="#C9A84C" strokeWidth=".6" opacity=".3" />
            <line x1="270" y1="24" x2="300" y2="24" stroke="#C9A84C" strokeWidth=".6" opacity=".3" />
          </svg>
        </div>
      )}      {/* ══════════════════════════════ HERO PREVIEW ═══════════════════════ */}
      <section id="hero">
        <div className="hero-inner">
          <p className="hero-label">Undangan Pernikahan</p>
          <div className="hero-photos">
            <div className="hero-photo-wrap">
              <Image
                src="/images/mempelai/Ilyas.jpeg"
                alt="Muhammad Ilyas"
                fill
                style={{ objectFit: "cover", objectPosition: "center 30%" }}
                sizes="160px"
              />
              <span className="hero-photo-name">Ilyas</span>
            </div>
            <div className="hero-ampersand">
              <svg width="1" height="50" viewBox="0 0 1 50">
                <line x1=".5" y1="0" x2=".5" y2="50" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
              <span>&amp;</span>
              <svg width="1" height="50" viewBox="0 0 1 50">
                <line x1=".5" y1="0" x2=".5" y2="50" stroke="#C9A84C" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>
            <div className="hero-photo-wrap">
              <Image
                src="/images/mempelai/Hikmah.jpeg"
                alt="Nur Hikmah"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                sizes="160px"
              />
              <span className="hero-photo-name">Hikmah</span>
            </div>
          </div>
          <div className="hero-divider"><div className="diamond" /></div>
          <p className="hero-fullnames">Muhammad Ilyas &amp; Nur Hikmah</p>
          <p className="hero-date">Rabu, 8 Juli 2026</p>
          <p className="hero-place">Pangkep, Sulawesi Selatan</p>
        </div>
      </section>

      {/* ══════════════════════════════ AYAT QUR'AN ═════════════════════════ */}
      <section id="quran">
        <p className="quran-label">Firman Allah SWT</p>
        <div className="quran-ornament">
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path d="M20 2 L26 8 L32 4 L30 10 L36 14 L28 13 L26 18 L20 14 L14 18 L12 13 L4 14 L10 10 L8 4 L14 8 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".6" />
          </svg>
        </div>
        <p className="quran-arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا</p>
        <p className="quran-arabic-2">لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</p>
        <div className="quran-line" />
        <p className="quran-translation">
          &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan
          untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan
          di antaramu rasa kasih dan sayang.&rdquo;
        </p>
        <p className="quran-ref">— QS. Ar-Rum: 21 —</p>
      </section>

      {/* ══════════════════════════════ MEMPELAI ═══════════════════════════ */}
      <section id="couple">
        {/* Bismillah + kalimat pembuka */}
        <div className="couple-bismillah">
          <p className="couple-bismillah-arabic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <p className="couple-bismillah-text">
            Dengan memohon rahmat dan ridha Allah Subhanahu wa Ta&apos;ala,
            kami bermaksud menyelenggarakan pernikahan putra-putri kami.
          </p>
        </div>

        <p className="section-label">Mempelai</p>
        <h2 className="section-title">Yang Berbahagia</h2>
        <div className="section-divider"><div className="diamond" /></div>

        <div className="couple-grid">
          {/* Pria */}
          <div className="couple-card">
            <div className="couple-photo">
              <Image
                src="/images/mempelai/Ilyas.jpeg"
                alt="Foto Muhammad Ilyas"
                fill
                style={{ objectFit: "cover", objectPosition: "center 30%" }}
                sizes="170px"
                priority
              />
            </div>
            <div className="couple-nick">Ilyas</div>
            <p className="couple-fullname">Muhammad Ilyas</p>
            <p className="couple-desc">Putra ke-7 Alm. Bapak Abd. Latif & Ibu Nurhaedah</p>
            <div className="couple-social">
              <a href="https://www.instagram.com/muhammadkaddi?igsh=Nm5pbGJic2FqM2xw" target="_blank" rel="noopener noreferrer">
                ✦ Instagram
              </a>
            </div>
          </div>

          {/* Separator */}
          <div className="couple-separator">
            <svg width="1" height="60" viewBox="0 0 1 60">
              <line x1=".5" y1="0" x2=".5" y2="60" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
            <span className="amp">&amp;</span>
            <svg width="1" height="60" viewBox="0 0 1 60">
              <line x1=".5" y1="0" x2=".5" y2="60" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Wanita */}
          <div className="couple-card">
            <div className="couple-photo">
              <Image
                src="/images/mempelai/Hikmah.jpeg"
                alt="Foto Nur Hikmah"
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
                sizes="170px"
              />
            </div>
            <div className="couple-nick">Hikmah</div>
            <p className="couple-fullname">Nur Hikmah</p>
            <p className="couple-desc">Putri ke-7 dari Bapak Jumaleng dg. Solo & Ibu Kartia Mahaseng</p>
            <div className="couple-social">
              <a href="https://www.instagram.com/_____nrrhkmaa?igsh=MXg3MHc2enRiMjl5MQ==" target="_blank" rel="noopener noreferrer">
                ✦ Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ COUNTDOWN ══════════════════════════ */}
      <section id="countdown">
        <p className="section-label">Menuju Hari Bahagia</p>
        <h2 className="section-title" style={{ color: "var(--gold-lt)" }}>Hitung Mundur</h2>
        <div className="section-divider"><div className="diamond" /></div>
        <div className="countdown-grid">
          <div className="countdown-box">
            <div className="num">{pad(days)}</div>
            <div className="unit">Hari</div>
          </div>
          <div className="countdown-box">
            <div className="num">{pad(hours)}</div>
            <div className="unit">Jam</div>
          </div>
          <div className="countdown-box">
            <div className="num">{pad(minutes)}</div>
            <div className="unit">Menit</div>
          </div>
          <div className="countdown-box">
            <div className="num">{pad(seconds)}</div>
            <div className="unit">Detik</div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ ACARA ══════════════════════════════ */}
      <section id="acara">
        <p className="section-label">Rangkaian Acara</p>
        <h2 className="section-title">Hari Pernikahan</h2>
        <div className="section-divider"><div className="diamond" /></div>

        <div className="event-cards">
          {/* Akad */}
          <div className="event-card">
            <div className="event-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4 L28 16 L40 16 L30 24 L34 36 L24 28 L14 36 L18 24 L8 16 L20 16 Z" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,.12)" />
              </svg>
            </div>
            <p className="event-type">Ijab Qabul</p>
            <h3 className="event-name">Akad Nikah</h3>
            <div className="event-detail">
              <strong>Rabu, 8 Juli 2026</strong>
              09.00 WITA – Selesai
              <br /><br />
              Jl. Coppo Tompong No.63<br />
              Kel. Tumampua, Kec. Pangkajene<br />
              Kab. Pangkep
            </div>
            <a className="event-maps-btn" href="#maps">Lihat Lokasi</a>
          </div>

          {/* Resepsi */}
          <div className="event-card">
            <div className="event-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 36 Q8 12 24 12 Q40 12 40 36" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,.12)" />
                <line x1="4" y1="36" x2="44" y2="36" stroke="#C9A84C" strokeWidth="1.5" />
                <path d="M16 12 Q16 4 24 4 Q32 4 32 12" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <p className="event-type">Walimatul &apos;Ursy</p>
            <h3 className="event-name">Resepsi Pernikahan</h3>
            <div className="event-detail">
              <strong>Rabu, 8 Juli 2026</strong>
              12.00 WITA – Selesai<br />
              <em style={{ fontSize: 11, color: "var(--gold)" }}>(Pesta Siang &amp; Malam)</em>
              <br /><br />
              Jl. Coppo Tompong No.63<br />
              Kel. Tumampua, Kec. Pangkajene<br />
              Kab. Pangkep
            </div>
            <a className="event-maps-btn" href="#maps">Lihat Lokasi</a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ GALERI ═════════════════════════════ */}
      <section id="gallery">
        <p className="section-label">Kenangan</p>
        <h2 className="section-title">Galeri Foto</h2>
        <div className="section-divider"><div className="diamond" /></div>

        <div className="gallery-grid">
          {/* Hero – spans 2 col × 2 row */}
          <div className="gallery-item" style={{ background: "var(--cream-dk)" }}>
            <Image
              src="/images/gallery/gallery-1.jpeg"
              alt="Galeri foto 1"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width:600px) 100vw, 480px"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="/images/gallery/gallery-2.jpeg"
              alt="Galeri foto 2"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width:600px) 50vw, 240px"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="/images/gallery/gallery-3.jpeg"
              alt="Galeri foto 3"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width:600px) 50vw, 240px"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="/images/gallery/gallery-4.jpeg"
              alt="Galeri foto 4"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width:600px) 50vw, 240px"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="/images/gallery/gallery-5.jpeg"
              alt="Galeri foto 5"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width:600px) 50vw, 240px"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="/images/gallery/gallery-6.jpeg"
              alt="Galeri foto 6"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width:600px) 50vw, 240px"
            />
          </div>
          <div className="gallery-item">
            <Image
              src="/images/gallery/gallery-7.jpeg"
              alt="Galeri foto 7"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width:600px) 50vw, 240px"
            />
          </div>
        </div>

      </section>

      {/* ══════════════════════════════ HADIAH ═════════════════════════════ */}
      <section id="hadiah">
        <p className="section-label">Amplop Digital &amp; Kado</p>
        <h2 className="section-title">Kirim Doa &amp; Hadiah</h2>
        <div className="section-divider"><div className="diamond" /></div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          {/* SeaBank - Hikmah */}
          <div className="gift-card">
            <div className="gift-bank-logo-wrap">
              <Image
                src="/images/logo/seabank.png"
                alt="Logo SeaBank"
                width={160}
                height={100}
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="gift-name">a.n. Nur Hikmah</p>
            <p className="gift-no">9016&nbsp;5015&nbsp;8763</p>
            <button
              className="gift-copy-btn"
              onClick={() => copyToClipboard("901650158763", "hikmah")}
            >
              {copied === "hikmah" ? "✓ Tersalin!" : "Salin Nomor"}
            </button>
          </div>

          {/* BRI - Ilyas */}
          <div className="gift-card">
            <div className="gift-bank-logo-wrap">
              <Image
                src="/images/logo/bri.png"
                alt="Logo BRI"
                width={120}
                height={55}
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="gift-name">a.n. Muhammad Ilyas</p>
            <p className="gift-no">5009&nbsp;0103&nbsp;9697&nbsp;538</p>
            <button
              className="gift-copy-btn"
              onClick={() => copyToClipboard("500901039697538", "ilyas")}
            >
              {copied === "ilyas" ? "✓ Tersalin!" : "Salin Nomor"}
            </button>
          </div>
        </div>

        <div className="gift-address">
          <strong>📦 Alamat Pengiriman Kado</strong>
          Jl. Coppo Tompong No.63, Kel. Tumampua<br />
          Kec. Pangkajene, Kab. Pangkep<br />
          Sulawesi Selatan
        </div>
      </section>

      {/* ══════════════════════════════ MAPS ═══════════════════════════════ */}
      <section id="maps">
        <p className="section-label">Lokasi</p>
        <h2 className="section-title">Peta &amp; Alamat</h2>
        <div className="section-divider"><div className="diamond" /></div>

        <div className="maps-btn-wrap">
          <a
            href="https://maps.app.goo.gl/xsKGVpr42abEpdFF9"
            target="_blank"
            rel="noopener noreferrer"
            className="maps-open-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Buka di Google Maps
          </a>
        </div>

        <p className="maps-address">
          Jl. Coppo Tompong No.63, Kel. Tumampua<br />
          Kec. Pangkajene, Kab. Pangkep, Sulawesi Selatan
        </p>
      </section>

      {/* ══════════════════════════════ CLOSING ════════════════════════════ */}
      <section id="closing">
        <p className="section-label" style={{ color: "var(--gold)" }}>Terima Kasih</p>
        <h2 className="closing-title">Jazakumullahu Khairan</h2>

        <svg width="120" height="30" viewBox="0 0 120 30" fill="none" style={{ margin: "0 auto 24px", display: "block" }}>
          <path d="M60 2 L72 12 L84 6 L80 16 L92 22 L78 20 L74 28 L60 22 L46 28 L42 20 L28 22 L40 16 L36 6 L48 12 Z" stroke="#C9A84C" strokeWidth="1" fill="none" opacity=".5" />
        </svg>

        <p className="closing-text">
          Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
          dan memberikan doa restu kepada kedua mempelai.
        </p>

        <p className="closing-names">Muhammad Ilyas &amp; Nur Hikmah</p>
        <p className="closing-family">Beserta Keluarga Besar</p>
      </section>

      {/* ══════════════════════════════ FOOTER ═════════════════════════════ */}
      <footer>
        <p>Made with ♥ for Ilyas &amp; Hikmah · 8 Juli 2026</p>
      </footer>

      {/* ══════════════════════════════ MUSIC PLAYER ════════════════════════ */}
      <audio ref={audioRef} src="/music/Dewa 19 - Aku Milikmu.mp3" loop preload="none" />
      {isOpened && (
        <button
          id="music-toggle"
          className={`music-btn${isPlaying ? " playing" : ""}`}
          onClick={toggle}
          aria-label={isPlaying ? "Pause musik" : "Play musik"}
          title={isPlaying ? "Pause musik" : "Play musik"}
        >
          {/* Pulsing ring */}
          <span className="music-ring" />
          {/* Equalizer bars (visible when playing) */}
          <span className="music-eq">
            <span /><span /><span /><span />
          </span>
          {/* Play icon (visible when paused) */}
          <svg className="music-play-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {/* Note icon (visible when playing) */}
          <svg className="music-note-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        </button>
      )}
    </>
  );
}
