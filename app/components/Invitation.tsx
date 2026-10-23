"use client";

import { useCallback, useState } from "react";
import { invitation as inv } from "../invitation.config";
import Countdown from "./Countdown";
import Reveal from "./Reveal";
import Sparkles from "./Sparkles";
import VideoModal from "./VideoModal";

const start = new Date(inv.start);
const weekday = start.toLocaleDateString("en-GB", { weekday: "long", timeZone: inv.timeZone });
const day = start.toLocaleDateString("en-GB", { day: "2-digit", timeZone: inv.timeZone });
const month = start.toLocaleDateString("en-GB", { month: "long", timeZone: inv.timeZone });
const year = start.toLocaleDateString("en-GB", { year: "numeric", timeZone: inv.timeZone });
const timeLabel = start.toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: inv.timeZone,
});

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inv.venue.mapQuery)}`;

function downloadCalendar() {
  const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitation//EN",
    "BEGIN:VEVENT",
    `UID:${stamp(inv.start)}@invitation`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(inv.start)}`,
    `DTEND:${stamp(inv.end)}`,
    `SUMMARY:${inv.title} — ${inv.hosts.join(" & ")}`,
    `LOCATION:${inv.venue.name}\\, ${inv.venue.address}`,
    `DESCRIPTION:${inv.message}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "invitation.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Invitation() {
  const [stage, setStage] = useState<"sealed" | "opening" | "open">("sealed");
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const openEnvelope = () => {
    if (stage !== "sealed") return;
    setStage("opening");
    setTimeout(() => setStage("open"), 2300);
  };

  const closeVideo = useCallback(() => setPlaying(false), []);
  const onVideoError = useCallback(() => setVideoFailed(true), []);

  const rsvpUrl = inv.rsvpPhone
    ? `https://wa.me/${inv.rsvpPhone}?text=${encodeURIComponent(
        `Hello! I'd love to attend the ${inv.title} of ${inv.hosts.join(" & ")} on ${day} ${month} ${year}. See you there! 🎉`,
      )}`
    : null;

  return (
    <main className="stage">
      <div className="backdrop" aria-hidden="true" />
      <Sparkles className="ambient" />

      {stage !== "open" && (
        <section className={`gate ${stage === "opening" ? "gate-opening" : ""}`}>
          <p className="gate-hint">You have received an invitation</p>
          <button
            className={`envelope ${stage !== "sealed" ? "is-open" : ""}`}
            onClick={openEnvelope}
            aria-label="Tap to open the invitation"
          >
            <span className="env-back" />
            <span className="env-card">
              <span className="env-card-script">{inv.hosts.join(" & ")}</span>
              <span className="env-card-small">are getting married</span>
            </span>
            <span className="env-front" />
            <span className="env-flap" />
            <span className="env-seal">
              <span>{inv.hosts.map((h) => h[0]).join("")}</span>
            </span>
          </button>
          <p className="gate-tap">Tap the seal to open</p>
        </section>
      )}

      {stage === "open" && (
        <div className="content">
          <section className="hero">
            <div className="card">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />

              <p className="eyebrow rise" style={{ "--d": "0.1s" } as React.CSSProperties}>
                {inv.eyebrow}
              </p>
              <h1 className="names rise" style={{ "--d": "0.3s" } as React.CSSProperties}>
                <span>{inv.hosts[0]}</span>
                <em>&amp;</em>
                <span>{inv.hosts[1]}</span>
              </h1>
              <p className="tagline rise" style={{ "--d": "0.5s" } as React.CSSProperties}>
                {inv.tagline}
              </p>

              <button
                className="video-tile rise"
                style={{ "--d": "0.7s" } as React.CSSProperties}
                onClick={() => setPlaying(true)}
                aria-label="Play the invitation video"
              >
                {!videoFailed && (
                  <video
                    className="tile-video"
                    src={`${inv.videoSrc}#t=0.5`}
                    preload="metadata"
                    muted
                    playsInline
                    onError={onVideoError}
                  />
                )}
                <span className="tile-glow" />
                <span className="play">
                  <span className="play-ring" />
                  <span className="play-ring r2" />
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
                  </svg>
                </span>
                <span className="tile-label">Tap to watch our invitation</span>
              </button>

              <div className="date-row rise" style={{ "--d": "0.9s" } as React.CSSProperties}>
                <span className="date-side">{weekday}</span>
                <span className="date-big">
                  <b>{day}</b>
                  <small>{month}</small>
                </span>
                <span className="date-side">{year}</span>
              </div>
              <p className="at rise" style={{ "--d": "1.05s" } as React.CSSProperties}>
                {timeLabel} onwards &nbsp;·&nbsp; {inv.venue.name}
              </p>
            </div>
            <div className="scroll-cue" aria-hidden="true">
              <span />
            </div>
          </section>

          <section className="details">
            <Reveal>
              <p className="section-kicker">{inv.title}</p>
              <h2 className="section-title">Join us for a night to remember</h2>
              <p className="lead">{inv.message}</p>
            </Reveal>

            <Reveal delay={100}>
              <Countdown to={inv.start} />
            </Reveal>

            <div className="info-grid">
              <Reveal className="info" delay={0}>
                <span className="info-icon">
                  <svg viewBox="0 0 24 24"><path d="M7 2v3M17 2v3M3.5 9h17M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5Z" /></svg>
                </span>
                <h3>Date</h3>
                <p>
                  {weekday}
                  <br />
                  {day} {month} {year}
                </p>
              </Reveal>
              <Reveal className="info" delay={120}>
                <span className="info-icon">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                </span>
                <h3>Time</h3>
                <p>
                  {timeLabel}
                  <br />
                  {inv.timezoneLabel}
                </p>
              </Reveal>
              <Reveal className="info" delay={240}>
                <span className="info-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                </span>
                <h3>Venue</h3>
                <p>
                  {inv.venue.name}
                  <br />
                  {inv.venue.address}
                </p>
              </Reveal>
            </div>

            <Reveal className="schedule">
              <h3 className="schedule-title">The evening</h3>
              <ul>
                {inv.schedule.map((s) => (
                  <li key={s.time}>
                    <span className="s-time">{s.time}</span>
                    <span className="s-dot" />
                    <span className="s-label">{s.label}</span>
                  </li>
                ))}
              </ul>
              <p className="dress">Dress code · {inv.dressCode}</p>
            </Reveal>

            <Reveal className="actions">
              <a className="btn btn-gold" href={mapsUrl} target="_blank" rel="noopener noreferrer">
                Open in Maps
              </a>
              <button className="btn btn-ghost" onClick={downloadCalendar}>
                Add to Calendar
              </button>
              {rsvpUrl && (
                <a className="btn btn-ghost" href={rsvpUrl} target="_blank" rel="noopener noreferrer">
                  RSVP on WhatsApp
                </a>
              )}
              {inv.rsvpBy && <p className="rsvp-by">Kindly reply by {inv.rsvpBy}</p>}
            </Reveal>

            <footer className="foot">
              <span className="foot-script">{inv.hosts.join(" & ")}</span>
              <p>with love &amp; gratitude</p>
            </footer>
          </section>
        </div>
      )}

      {playing && <VideoModal onClose={closeVideo} useFallback={videoFailed} onVideoError={onVideoError} />}
    </main>
  );
}
