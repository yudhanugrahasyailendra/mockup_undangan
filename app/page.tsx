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
      "section:not(#cover), .event-card, .couple-card, .gallery-item, .gift-card"
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

  useScrollReveal();

  const pad = (n: number | null) => n === null ? "--" : String(n).padStart(2, "0");
  const days = countdown?.days ?? null;
  const hours = countdown?.hours ?? null;
  const minutes = countdown?.minutes ?? null;
  const seconds = countdown?.seconds ?? null;


  return (
    <>
      {/* ══════════════════════════════ COVER ══════════════════════════════ */}
      <section id="cover">
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
            Ilyas
            <span className="ampersand">&amp;</span>
            Hikmah
          </div>

          <p className="cover-date">Rabu, 8 Juli 2026</p>
          <p className="cover-subtitle">Pangkep, Sulawesi Selatan</p>

          <a className="scroll-btn" href="#bismillah" onClick={autoPlay}>
            <span>Buka Undangan</span>
            <div className="arrow" />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════ BISMILLAH ══════════════════════════ */}
      <section id="bismillah">
        <p className="bismillah-arabic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p className="bismillah-text">
          Dengan memohon rahmat dan ridha Allah Subhanahu wa Ta&apos;ala, kami bermaksud
          menyelenggarakan pernikahan putra-putri kami.
        </p>
        <p className="quran-verse">
          &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan
          untukmu dari jenismu sendiri...&quot;
          <br />
          <span style={{ fontStyle: "normal", letterSpacing: 2, fontSize: 11, opacity: .6 }}>
            — QS. Ar-Rum: 21
          </span>
        </p>
      </section>

      {/* ══════════════════════════════ MEMPELAI ═══════════════════════════ */}
      <section id="couple">
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
            <p className="couple-desc">Putra ke-7 dari 8 bersaudara</p>
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
            <p className="couple-desc">Putri ke-7 dari 7 bersaudara</p>
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

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <div className="gift-card">
            <p className="gift-bank">Rekening / OVO / GoPay</p>
            <p className="gift-name">a.n. _______________</p>
            <p className="gift-no">____&nbsp;____&nbsp;____&nbsp;____</p>
            <p className="gift-note">*Data rekening akan ditambahkan oleh pemilik undangan</p>
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

        <div className="maps-placeholder">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity=".3">
            <circle cx="24" cy="20" r="10" stroke="#5C1A1A" strokeWidth="2" />
            <path d="M24 44 L24 30" stroke="#5C1A1A" strokeWidth="2" />
            <path d="M14 44 L34 44" stroke="#5C1A1A" strokeWidth="2" />
            <circle cx="24" cy="20" r="4" fill="#5C1A1A" />
          </svg>
          <p style={{ fontSize: 12, color: "#999", textAlign: "center" }}>
            Link Google Maps akan ditambahkan<br />setelah tersedia
          </p>
          <a
            href="#"
            style={{
              padding: "8px 20px",
              background: "var(--maroon)",
              color: "white",
              borderRadius: 4,
              fontSize: 11,
              letterSpacing: 1,
              textDecoration: "none",
            }}
          >
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
    </>
  );
}
