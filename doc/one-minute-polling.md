# Ready2Go – 1 Minute NWS Polling & Ops Notes

This document explains how 1‑minute NWS polling is configured in Ready2Go without changing any existing UI or replacing legacy code.

## Environment variables

Set the following keys in your environment (e.g. `.env.local` in development or the hosting provider’s env settings in production):

- `MONGODB_URI` – MongoDB connection string. If it is a `mongodb+srv://` URI without a path, the code automatically appends `/ready2go`.
- `JWT_SECRET` – Secret used for user session JWTs (`lib/auth.ts`).
- `NWS_USER_AGENT` – Required by `api.weather.gov`. Example:
  - `NWS_USER_AGENT="ready2go-dashboard (contact: ops@example.org)"`

These values are read by `lib/mongodb.ts`, `lib/auth.ts`, and `lib/services/weather-api.ts`.

## 1‑minute polling entry point

- HTTP route: `GET /api/alerts/ingest-weather`
- Implementation: `[app/api/alerts/ingest-weather/route.ts](app/api/alerts/ingest-weather/route.ts)`

Behaviour:

1. Connects to MongoDB.
2. Reads `EOCSettings.alertFeeds.nws` from `[models/EOCSettings.ts](models/EOCSettings.ts)`:
   - If `nws === false`, the route returns immediately and does **not** write any records.
3. Loads all distinct `User.location` and `familyMembers[].location` values from `[models/User.ts](models/User.ts)`.
4. Geocodes each location string to `lat,lon` with the Photon API.
5. For each `{ lat, lon }`:
   - Calls `weatherAPI.fetchWeatherAlerts(lat, lon)` (which uses `https://api.weather.gov/alerts/active?point=lat,lon`).
   - Ignores synthetic/mock alerts.
   - Upserts each NWS alert into `WeatherAlertRecord` keyed by `alertId` (NWS id).
6. Tracks the set of NWS `event` names seen in this run and passes them to the alert‑type change handler.

## Alert‑type safety flow

On each ingest run, the system:

1. Compares the discovered `event` names with what is stored in `WeatherAlertTypeConfig`:
   - New events are added with `enabled = false` by default.
   - Removed events are recorded for audit.
2. Writes a `WeatherAlertTypeChangeLog` entry with `newEvents` and `removedEvents`.
3. Sets `EOCSettings.alertFeeds.nws = false` so future ingest calls become no‑ops until reviewed.
4. Uses `notificationService.sendAdminSystemEmail(...)` to create a `SystemNotification` record summarizing the change for admins.

This satisfies the requirement that **automated weather alerts are deactivated and admins are notified when the NWS alert vocabulary changes**.

## External cron / scheduler setup

In production, configure an external scheduler to call `GET /api/alerts/ingest-weather` every 60 seconds. Examples:

- **Vercel Cron Jobs**
  - Path: `/api/alerts/ingest-weather`
  - Schedule: `"* * * * *"` (every minute)
- **GitHub Actions / other scheduler**
  - Use `curl` or similar to hit your deployed URL:
    - `https://your-domain.com/api/alerts/ingest-weather`
  - Cron expression: `* * * * *`

The application itself does **not** run an internal timer; it expects the hosting platform to trigger this route.

## Recommended manual test scenarios

1. **Basic ingest sanity**
   - Create users with locations in at least two different cities.
   - Trigger `/api/alerts/ingest-weather` manually (or wait for cron).
   - Verify `WeatherAlertRecord` contains active NWS alerts for those areas.
2. **Zone‑wise differences**
   - Confirm that `/api/alerts/users` returns different alert sets when your users are registered in clearly different regions (e.g. Atlanta vs Chicago), demonstrating geographic flexibility.\n3. **Alert‑type change handling**
   - Seed `WeatherAlertTypeConfig` with a known set of events.
   - Simulate a new event name by inserting a `WeatherAlertRecord` or by hitting NWS during a period with a new alert type.
   - Run `/api/alerts/ingest-weather` and check:
     - `EOCSettings.alertFeeds.nws` is now `false`.
     - A new `WeatherAlertTypeChangeLog` entry exists.
     - A `SystemNotification` record exists describing the change.
\nThese steps ensure that 1‑minute polling, alert‑type safeguards, and admin visibility all work as intended without impacting any existing UI screens.

