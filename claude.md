# Claude.md - Perfect Tour Entwicklungskontext

## Projektübersicht
Perfect Tour ist eine TypeScript/React Desktop-Web-App zur wetteroptimierten Planung von Gravelbike-Touren. Die App analysiert GPX-Routen gegen historische Wetterdaten und findet optimale Zeiträume für Touren.

## Technologie-Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.x
- **Karten**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **GPX-Parser**: @we-gold/gpxjs
- **Geo-Berechnungen**: Turf.js
- **Wetter-API**: Open-Meteo (kostenlos)

## Projektstruktur
```
src/
├── components/         # React-Komponenten
│   ├── GPXUploader.tsx    # Haupt-Upload-Komponente
│   ├── GPXMap.tsx         # Leaflet-Karte
│   ├── ElevationProfile.tsx # Höhenprofil-Chart
│   └── WeatherAnalysis.tsx # Wetter-Analyse-UI
├── hooks/              # Custom React Hooks
│   ├── useGPXParser.ts    # GPX-Datei-Parsing
│   └── useWeatherAnalysis.ts # Wetter-Analyse-Logik
├── types/              # TypeScript-Definitionen
│   ├── gpx.ts            # GPX-Datenstrukturen
│   └── weather.ts        # Wetter-API-Types
├── utils/              # Helper-Funktionen
│   ├── weatherAPI.ts     # Open-Meteo API-Client
│   ├── weatherScoring.ts # Scoring-System
│   └── routeCalculations.ts # Geo-Berechnungen
└── App.tsx             # Haupt-App-Komponente
```

## Kernfunktionalitäten

### 1. GPX-Upload & Visualisierung
- Drag & Drop GPX-Upload
- Interaktive Leaflet-Karte mit Route
- Automatische Statistiken (Distanz, Höhenmeter)
- Höhenprofil mit Steigungsanalyse

### 2. Intelligente Routenanalyse
- Stützpunkte alle 5-10km generieren
- Geschwindigkeitsmodell mit Steigungsanpassung
- Realistische Ankunftszeiten berechnen

### 3. Wetter-Analyse
- Open-Meteo API für historische Daten (2019-2023)
- Temperatur, Niederschlag, Wind für jeden Stützpunkt
- Scoring-System: 18°C optimal, kein Regen = 100%
- Gewichtung: 45% Regen, 40% Temperatur, 15% Wind

### 4. Optimale Zeiträume
- Beste 7-Tage-Perioden finden
- Top 10 Zeiträume mit Scores
- Tages-Breakdown mit Details

## API-Integration
```typescript
// Open-Meteo Historical Weather API
const API_BASE = 'https://archive-api.open-meteo.com/v1/archive';
const PARAMETERS = 'temperature_2m,precipitation,wind_speed_10m';

// Rate Limiting: 3 parallele Anfragen, 500ms Delay
const BATCH_SIZE = 3;
const DELAY_MS = 500;
```

## Scoring-Algorithmus
```typescript
// Temperatur-Score (0-100)
optimal: 18°C = 100 Punkte
range: ±10°C für linearen Abfall
min: -5°C = 0 Punkte
max: 35°C = 0 Punkte

// Niederschlag-Score (0-100)
0 mm/h = 100 Punkte
0.5 mm/h = 80 Punkte
2 mm/h = 50 Punkte
5+ mm/h = 0 Punkte

// Wind-Score (0-100)
0 m/s = 100 Punkte
3 m/s = 90 Punkte
7 m/s = 60 Punkte
12+ m/s = 20 Punkte
```

## Entwicklungsrichtlinien

### Code-Style
- TypeScript strict mode
- Functional Components mit Hooks
- Named exports bevorzugt
- Descriptive variable names
- Umfassendes Error Handling

### Komponenten-Architektur
- Single Responsibility Principle
- Props-Interface für jede Komponente
- Custom Hooks für Geschäftslogik
- Wiederverwendbare Utility-Funktionen

### Testing-Strategie
- Unit Tests für Utils-Funktionen
- Integration Tests für API-Calls
- Component Tests für UI-Verhalten
- E2E Tests für kritische User Flows

## CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml
- Build & Test (Node.js 20)
- Semantic Release (Conventional Commits)
- Docker Build (Multi-platform)
- Deployment (Nginx + SPA-Routing)
```

## Bekannte Einschränkungen
- Desktop-only (keine mobile Optimierung)
- Nur historische Daten (keine Vorhersagen)
- Open-Meteo API-Limits (10.000 Calls/Tag)
- Stützpunkte-Intervall abhängig von Routenlänge

## Debugging & Performance
- Debug-Logging in Browser Console
- Progress-Anzeige bei API-Calls
- Batch-Verarbeitung für Rate-Limiting
- Lazy Loading für große GPX-Dateien

## Nächste Entwicklungsschritte
1. IntelliJ-Setup mit Claude-Integration
2. GitHub Issues für Feature-Tracking
3. Basis-Komponenten implementieren
4. API-Integration & Testing
5. Performance-Optimierung
6. Deployment-Pipeline

## Claude-Entwicklung Kontext
Diese Datei dient als Kontext für Claude in der IDE-Integration. Alle Anforderungen, Architektur-Entscheidungen und technischen Details sind hier dokumentiert für konsistente KI-Unterstützung bei der Entwicklung.