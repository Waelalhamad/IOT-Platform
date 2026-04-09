# ESP-MONITOR — Claude Code Context

## Project Overview
Full-stack IoT sensor monitoring platform. ESP32 devices send sensor data via MQTT → backend processes and stores → frontend shows live readings on a customizable drag-and-drop dashboard.

## Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS v4 + Zustand + React Query + react-grid-layout + Recharts
- **Backend:** Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Broker:** EMQX 5.6 (Docker) — HTTP auth hooks to backend
- **Real-time:** Socket.io (WebSocket transport only, compression disabled)
- **Auth:** JWT (15m access token in memory + 7d refresh token in httpOnly cookie)

## Monorepo Layout
```
ESP-MONITOR/
├── client/          # React Vite app (port 5173)
├── server/          # Express API (port 4000)
├── docker/          # EMQX + MongoDB configs
├── docker-compose.yml
└── CLAUDE.md
```

## Key Architectural Decisions

### Real-time pipeline (latency-optimized)
1. ESP32 → EMQX (MQTT, per-device credentials)
2. MQTTService receives message → **broadcast WebSocket FIRST** (synchronous, no await)
3. DB persist happens async in background (`void persistReading(...)`)
4. Socket.io rooms: `device:{deviceId}` — clients subscribe per device
5. `perMessageDeflate: false` — compression disabled for small payloads

### MQTT Security
- Each device gets unique `mqttUsername` = `device-{deviceId}` and `mqttPassword`
- EMQX calls `POST /api/mqtt/auth` on first connect (then caches for 1h)
- EMQX ACL: device can only publish to `esp/{deviceId}/#`
- Backend cross-checks: topic deviceId must match authenticated mqttUsername

### Data Aggregation
`GET /api/sensors/history?range=` uses MongoDB `$group` aggregation:
- 1h → raw data
- 6h → 1-min averages
- 24h → 5-min averages
- 7d → 30-min averages
Response shape always: `[{ timestamp, value, min, max }]`

### Scaling path
- `REDIS_URL` env var: if set → Socket.io Redis adapter attached automatically
- Redis service in docker-compose behind `scaling` profile

## MVP Sensors
- `hcsr04` — HC-SR04 ultrasonic, value: `number` (cm), unit: "cm"
- `tcs230` — TCS230 color sensor, value: `{ r, g, b }` (0-255), unit: "rgb"

## Widget Types
| type | sensor | description |
|------|--------|-------------|
| `value-card` | any numeric | Live value + unit + trend arrow |
| `gauge` | any numeric | Circular gauge with thresholds |
| `line-chart` | any numeric | Historical chart with range selector |
| `color-preview` | tcs230 | Color swatch + RGB bars + hex |
| `status-badge` | any | Device online/offline status |

## API Routes
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout

GET    /api/devices
POST   /api/devices
DELETE /api/devices/:id
POST   /api/devices/:id/regen-key

GET    /api/sensors/history?deviceId=&sensorType=&range=1h|6h|24h|7d

GET    /api/dashboard?deviceId=
PUT    /api/dashboard

POST   /api/mqtt/auth   (EMQX internal hook — protected by EMQX_AUTH_SECRET header)
POST   /api/mqtt/acl    (EMQX internal hook)
```

## Environment Variables
### server/.env
```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://admin:espmonitor2024@localhost:27017/esp_monitor?authSource=admin
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=esp-backend
MQTT_PASSWORD=...
EMQX_AUTH_SECRET=...
CORS_ORIGIN=http://localhost:5173
SENSOR_READING_TTL_DAYS=30
COOKIE_SECURE=false
REDIS_URL=
```
### client/.env
```
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=http://localhost:4000
VITE_APP_NAME=ESP Monitor
```

## Dev Commands
```bash
# Start infrastructure
docker compose up -d

# Start server
cd server && npm run dev

# Start client
cd client && npm run dev
```

## Code Conventions
- All files TypeScript strict mode
- Response envelope: `{ success: boolean, data?: T, message?: string }`
- Errors use `createError(message, statusCode)` from middleware/errorHandler
- Logger: always use `logger` from config/logger (never console.log in server)
- Zustand stores: one file per domain (authStore, sensorStore, dashboardStore, deviceStore)
- React Query for HTTP, Zustand for live WebSocket state
- Widget components are pure — read from sensorStore via selector, no local state for live data

## Build Order
- Phase 0 ✅ Infrastructure (Docker, server scaffold, services stubs)
- Phase 1 — Auth (User model, JWT utils, authController, auth routes, client auth pages)
- Phase 2 — Devices (Device model, deviceController, MQTT auth hooks, client device pages)
- Phase 3 — Real-time (MQTTService + WebSocketService fully wired, SensorService)
- Phase 4 — API (sensors history aggregation, dashboard layout CRUD)
- Phase 5 — Dashboard UI (DraggableGrid, AddWidgetModal, WidgetFactory, hooks)
- Phase 6 — Widgets (ValueCard, GaugeWidget, LineChartWidget, ColorPreviewWidget, StatusBadge)
- Phase 7 — Polish (error boundaries, skeletons, toasts, responsive)
