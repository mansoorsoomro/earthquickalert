# Zone Matching Design (Ready2Go NWS Alerts)

This document explains how Ready2Go decides **which NWS alerts apply to which users/zones** without changing any existing page designs or replacing old code.

## Concepts

- **Registered zone** – today this is simply the `location` string stored on each `User` and on each `familyMembers[].location` in `[models/User.ts](models/User.ts)`. Examples:
  - `"Atlanta, GA"`
  - `"Chicago, IL"`
  - `"41.87,-87.62"` (lat/lon string)
- **NWS geography** – for each NWS alert we store:
  - `areaDesc` – the NWS human‑readable list of counties/regions.
  - `zones` – NWS UGC zone codes (when present).
  - `affectedAreas` – an array combining `areaDesc` pieces and any existing derived labels.

## Current runtime behaviour

### 1. Live per‑zone alerts for `/api/alerts/users`

The `/api/alerts/users` route:

1. Loads all distinct `User.location` and `familyMembers[].location` values.
2. Geocodes each location string into `lat,lon` (Photon API) and keeps the original string as `name`.
3. For each geocoded location:
   - Calls `alertProcessor.fetchAllAlerts({ lat, lon }, [AlertSource.WEATHER_API])` to fetch NWS‑backed weather alerts for that point.
   - Calls the same method with `[AlertSource.EARTHQUAKE_API]` to fetch earthquakes near that point.
   - For each returned alert it sets `affectedAreas: [name]`, so the alert is explicitly tagged with the registered zone string that triggered it.
4. Deduplicates earthquakes by `id` and merges `affectedAreas` across all zones that are impacted.

As a result:

- **Different registered locations see different alerts** (e.g. Atlanta vs Chicago) because each zone is queried separately against NWS and USGS.
- No UI changes are required; the existing admin and user pages already render `affectedAreas` to show where each alert applies.

### 2. Stored alerts for NWS polling

The `/api/alerts/ingest-weather` route (invoked every minute by an external cron) uses the same distinct set of user/family locations, geocodes them, and for each `{ lat, lon }`:

- Calls `weatherAPI.fetchWeatherAlerts(lat, lon)` (which uses `api.weather.gov/alerts/active?point=...`).
- Upserts each NWS alert into `WeatherAlertRecord` with:
  - `areaDesc` and `zones` from the NWS feed.
  - `affectedAreas` taken from the NWS geography (split `areaDesc`) so records can be reported and analyzed zone‑wise.

This gives Ready2Go a **complete, minute‑by‑minute set of active NWS alerts relevant to all registered zones** in MongoDB.

## Future extension (without breaking existing code)

When we want to drive user alerts directly from the stored NWS records:

1. Optionally extend `User` with `userZoneCodes?: string[]` mapping each user to NWS UGC zone codes.
2. In `/api/alerts/users`, after building the list of registered zones, also:
   - Look up `WeatherAlertRecord` documents where:
     - `zones` intersects with `userZoneCodes`, **or**
     - `areaDesc` / `affectedAreas` contains the registered `location` string.
3. Merge those records with the live alerts from `alertProcessor` (if desired), preserving the existing behaviour as a fallback.

This keeps all pages and legacy logic intact while allowing increasingly precise, NWS‑zone‑level routing based on the same registered zone concept used today.

