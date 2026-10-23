// Everything on the invitation is driven from here — edit these values and the whole card updates.
// To use your own video, drop a file at public/invite.mp4 (or change `videoSrc`).
// Until then a built-in cinematic animation plays instead.

export const invitation = {
  eyebrow: "Together with their families",
  title: "Wedding Celebration",
  hosts: ["Aarav", "Meera"],
  tagline: "request the pleasure of your company",
  message:
    "Two hearts, one beautiful journey. Join us as we begin our forever, surrounded by the people we love most.",

  // ISO string with offset. Used for the countdown and the calendar file.
  start: "2026-12-20T18:30:00+05:00",
  end: "2026-12-20T23:30:00+05:00",
  timeZone: "Asia/Karachi", // IANA zone the event happens in
  timezoneLabel: "Local time",

  venue: {
    name: "The Grand Royal Palace",
    address: "Main Boulevard, Gulberg, Lahore",
    mapQuery: "The Grand Royal Palace, Gulberg, Lahore",
  },

  schedule: [
    { time: "6:30 PM", label: "Welcome & Reception" },
    { time: "7:30 PM", label: "Nikah Ceremony" },
    { time: "8:30 PM", label: "Dinner & Celebration" },
  ],

  dressCode: "Formal · Gold & Ivory",

  // WhatsApp number in international format, digits only. Leave "" to hide the RSVP button.
  rsvpPhone: "923001234567",
  rsvpBy: "10 December 2026",

  videoSrc: "/invite.mp4",
  // Shown inside the cinematic fallback when no video file is present.
  filmScenes: [
    { kicker: "A love story", line: "Every journey begins with a single step" },
    { kicker: "Two souls", line: "One beautiful beginning" },
    { kicker: "Aarav & Meera", line: "are getting married" },
    { kicker: "20 · 12 · 2026", line: "Save the date" },
    { kicker: "You are invited", line: "Come celebrate with us" },
  ],
};

export type Invitation = typeof invitation;
