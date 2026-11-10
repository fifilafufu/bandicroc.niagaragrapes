import { useEffect, useState } from "react";

// ---------- one-tap install (Chrome, Edge, Samsung, Brave…) ----------

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

// Captured as early as possible: the browser may fire this before React has mounted.
let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferred = e as InstallEvent;
  notify();
});
window.addEventListener("appinstalled", () => {
  deferred = null;
  installedNow = true;
  notify();
});

let installedNow = false;

export const isStandalone = () =>
  installedNow ||
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export function useInstall() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    canPrompt: deferred !== null,
    installed: isStandalone(),
    prompt: async () => {
      if (!deferred) return false;
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null;
      notify();
      return outcome === "accepted";
    },
  };
}

// ---------- which device and browser is this? ----------

export type OS = "ios" | "android" | "windows" | "mac" | "other";
export type Browser =
  | "safari"
  | "chrome"
  | "edge"
  | "brave"
  | "samsung"
  | "firefox"
  | "opera"
  | "duckduckgo"
  | "inapp"
  | "other";

export function detect(): { os: OS; browser: Browser } {
  const ua = navigator.userAgent;
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const os: OS = /iPhone|iPad|iPod/.test(ua) || iPadOS
    ? "ios"
    : /Android/.test(ua)
      ? "android"
      : /Windows/.test(ua)
        ? "windows"
        : /Macintosh/.test(ua)
          ? "mac"
          : "other";

  let browser: Browser = "other";
  if (/FBAN|FBAV|Instagram|TikTok|musical_ly|Snapchat|Line\/|Twitter|LinkedInApp/i.test(ua)) browser = "inapp";
  else if (/DuckDuckGo|Ddg\//i.test(ua)) browser = "duckduckgo";
  else if (/FxiOS|Firefox\//.test(ua)) browser = "firefox";
  else if (/EdgiOS|EdgA\/|Edg\//.test(ua)) browser = "edge";
  else if (/SamsungBrowser/.test(ua)) browser = "samsung";
  else if (/OPR\/|OPiOS|OPT\//.test(ua)) browser = "opera";
  else if ((navigator as Navigator & { brave?: unknown }).brave) browser = "brave";
  else if (/CriOS|Chrome\//.test(ua)) browser = "chrome";
  else if (/Safari\//.test(ua)) browser = "safari";
  return { os, browser };
}

// ---------- what to tell the user ----------

export type Guide = {
  label: string; // e.g. "Safari on iPhone"
  supported: boolean; // can this browser install web apps at all?
  steps: string[]; // shown as a numbered list (manual route)
  instead?: string; // which browser to use when not supported
};

const names: Record<Browser, string> = {
  safari: "Safari",
  chrome: "Chrome",
  edge: "Edge",
  brave: "Brave",
  samsung: "Samsung Internet",
  firefox: "Firefox",
  opera: "Opera",
  duckduckgo: "DuckDuckGo",
  inapp: "The in-app browser",
  other: "this browser",
};
const osNames: Record<OS, string> = { ios: "iPhone", android: "Android", windows: "Windows", mac: "Mac", other: "this device" };

export function guideFor(os: OS, browser: Browser): Guide {
  const label = `${names[browser]} on ${osNames[os]}`;
  const notSupported = (instead: string): Guide => ({ label, supported: false, steps: [], instead });

  if (browser === "inapp") return notSupported(os === "ios" ? "Safari" : "Chrome");

  if (os === "ios") {
    if (browser === "duckduckgo" || browser === "firefox" || browser === "opera" || browser === "other")
      return notSupported("Safari");
    if (browser === "safari")
      return {
        label,
        supported: true,
        steps: [
          "Tap the Share button ⬆️ in the bottom bar. On iOS 26 it's inside the ••• menu at the bottom right.",
          "Scroll down and tap “Add to Home Screen”.",
          "Make sure “Open as Web App” is on (if shown), then tap “Add”.",
        ],
      };
    return {
      label,
      supported: true,
      steps: [
        "Tap the Share button ⬆️ (next to the address bar, or in the ••• menu).",
        "Tap “Add to Home Screen”, then “Add”.",
        "Don't see it? Copy the link below and open it in Safari instead.",
      ],
      instead: "Safari",
    };
  }

  if (os === "android") {
    // Only Chrome, Edge and Samsung Internet reliably install a real full-screen app on Android.
    // DuckDuckGo, Brave and others often just make a home-screen shortcut that opens the browser.
    if (browser !== "chrome" && browser !== "edge" && browser !== "samsung") return notSupported("Chrome");
    return {
      label,
      supported: true,
      steps: [
        "Already have a Grapes icon that opens with the browser bar? Long-press it → Remove, first.",
        "Tap the menu ⋮ (top right; in Samsung Internet it's ≡ at the bottom).",
        "Tap “Install app” (or “Add to Home screen”).",
        "If it asks “Install” or “Create shortcut”, choose INSTALL. A shortcut opens in the browser; Install opens full screen.",
      ],
    };
  }

  if (os === "windows" || os === "other") {
    if (browser === "firefox" || browser === "duckduckgo" || browser === "other") return notSupported("Edge or Chrome");
    return {
      label,
      supported: true,
      steps: [
        "Click the install icon ⊕ at the right end of the address bar.",
        "Or open the menu ⋯ → “Apps” → “Install Grapes”.",
      ],
    };
  }

  // Mac
  if (browser === "safari")
    return { label, supported: true, steps: ["In the menu bar, choose File → “Add to Dock”.", "Click “Add”."] };
  if (browser === "firefox" || browser === "duckduckgo" || browser === "other") return notSupported("Safari, Chrome or Edge");
  return { label, supported: true, steps: ["Click the install icon ⊕ at the right end of the address bar, then “Install”."] };
}

// ---------- remembered "don't show the tip again" ----------

const TIP_KEY = "install-tip-dismissed";
export const tipDismissed = () => {
  try {
    return localStorage.getItem(TIP_KEY) === "1";
  } catch {
    return false;
  }
};
export const dismissTip = () => {
  try {
    localStorage.setItem(TIP_KEY, "1");
  } catch {
    /* private mode: the tip just shows again next visit */
  }
};
