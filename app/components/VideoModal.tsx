"use client";

import { useEffect, useRef, useState } from "react";
import { invitation } from "../invitation.config";
import Sparkles from "./Sparkles";

const SCENE_MS = 4200;

type Props = {
  onClose: () => void;
  useFallback: boolean;
  onVideoError: () => void;
};

export default function VideoModal({ onClose, useFallback, onVideoError }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scene, setScene] = useState(0);
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  const scenes = invitation.filmScenes;

  // lock page scroll + close on Escape while the player is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // advance the cinematic fallback scene by scene
  useEffect(() => {
    if (!useFallback) return;
    const id = setTimeout(() => {
      if (scene < scenes.length - 1) setScene(scene + 1);
      else setDone(true);
    }, SCENE_MS);
    return () => clearTimeout(id);
  }, [useFallback, scene, scenes.length, run]);

  // start playback with sound (we're inside a tap, so autoplay is allowed)
  useEffect(() => {
    if (useFallback) return;
    videoRef.current?.play().catch(() => {});
  }, [useFallback]);

  const replay = () => {
    setScene(0);
    setDone(false);
    setRun((r) => r + 1);
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Invitation video">
      <button className="modal-close" onClick={onClose} aria-label="Close video">
        <span />
        <span />
      </button>

      {useFallback ? (
        <div className="film">
          <Sparkles mode="fireworks" className="film-canvas" />
          <div className="film-vignette" />
          {!done ? (
            <div className="film-scene" key={`${run}-${scene}`}>
              <p className="film-kicker">{scenes[scene].kicker}</p>
              <h2 className="film-line">{scenes[scene].line}</h2>
              <div className="film-rule" />
            </div>
          ) : (
            <div className="film-scene film-end">
              <p className="film-kicker">{invitation.title}</p>
              <h2 className="film-names">{invitation.hosts.join(" & ")}</h2>
              <p className="film-line small">{invitation.venue.name}</p>
              <div className="film-actions">
                <button className="btn btn-ghost" onClick={replay}>
                  Replay
                </button>
                <button className="btn btn-gold" onClick={onClose}>
                  View details
                </button>
              </div>
            </div>
          )}
          <div className="film-progress" aria-hidden="true">
            {scenes.map((_, i) => (
              <span key={i} className={i < scene || done ? "on" : i === scene ? "now" : ""} />
            ))}
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="modal-video"
          src={invitation.videoSrc}
          controls
          playsInline
          autoPlay
          onError={onVideoError}
          onEnded={onClose}
        />
      )}
    </div>
  );
}
