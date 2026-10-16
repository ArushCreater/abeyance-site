"use client";

import { useEffect } from "react";

const LENGTH = 5000;

/** Plays the intro once per session, locks scrolling while it runs, and lets any input skip it. */
export function IntroController() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro-playing")) return;
    try {
      sessionStorage.setItem("abey-intro", "1");
    } catch {}
    root.style.overflow = "hidden";
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      root.classList.remove("intro-playing", "intro-skip");
      root.classList.add("intro-seen");
      root.style.overflow = "";
      cleanup();
    };
    const skip = () => {
      if (done || root.classList.contains("intro-skip")) return;
      root.classList.add("intro-skip");
      window.setTimeout(end, 450);
    };
    const timer = window.setTimeout(end, LENGTH);
    const opts = { passive: true } as const;
    window.addEventListener("pointerdown", skip, opts);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchmove", skip, opts);
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    }
    return () => {
      cleanup();
      root.style.overflow = "";
    };
  }, []);
  return null;
}
