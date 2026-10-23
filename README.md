# Video Invitation Card

An animated, tap-to-open invitation built with Next.js: a sealed envelope → the invitation card → a tap-to-play video, with the date, venue, countdown, schedule, map, calendar and WhatsApp RSVP.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
```

## Make it yours

1. **Text, date, venue** — edit [app/invitation.config.ts](app/invitation.config.ts). Everything on the card comes from there.
2. **Video** — put your file at `public/invite.mp4` (H.264/AAC MP4 plays everywhere). Its first frame becomes the thumbnail on the card. Until that file exists, a built-in cinematic fireworks film plays instead (scenes are `filmScenes` in the config).
3. **Colours** — CSS variables at the top of [app/globals.css](app/globals.css).

## Share it

Deploy to Vercel (`npx vercel`) and send the link on WhatsApp. Keep the video under ~15 MB so it loads quickly on mobile data.
