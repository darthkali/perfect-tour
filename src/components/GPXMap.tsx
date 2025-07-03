// src/components/GPXMap.tsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GPXTrack } from '../types/gpx';

// Fix für Leaflet Marker Icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GPXMapProps {
    tracks: GPXTrack[];
    className?: string;
}

// Component für automatisches Zoomen zur Route
const FitBounds: React.FC<{ tracks: GPXTrack[] }> = ({ tracks }) => {
    const map = useMap();

    useEffect(() => {
        if (tracks.length === 0) return;

        const allPoints = tracks.flatMap(track => track.points);
        if (allPoints.length === 0) return;

        const bounds = L.latLngBounds(
            allPoints.map(point => [point.lat, point.lon])
        );

        map.fitBounds(bounds, { padding: [20, 20] });
    }, [tracks, map]);

    return null;
};

// Farben für verschiedene Tracks
const TRACK_COLORS = [
    '#2563eb', // Blue
    '#dc2626', // Red
    '#16a34a', // Green
    '#ca8a04', // Yellow
    '#9333ea', // Purple
];

export const GPXMap: React.FC<GPXMapProps> = ({ tracks, className = '' }) => {
    const mapRef = useRef<L.Map>(null);

    // Berechne Zentrum als Fallback
    const center: [number, number] = React.useMemo(() => {
        if (tracks.length === 0) return [51.505, -0.09]; // London als Default

        const allPoints = tracks.flatMap(track => track.points);
        if (allPoints.length === 0) return [51.505, -0.09];

        const avgLat = allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length;
        const avgLon = allPoints.reduce((sum, p) => sum + p.lon, 0) / allPoints.length;

        return [avgLat, avgLon];
    }, [tracks]);

    // Generiere Stützpunkte alle 10km
    const generateSupportPoints = (track: GPXTrack) => {
        const supportPoints = [];
        let accumulatedDistance = 0;
        let nextSupportDistance = 10000; // 10km in Metern

        for (let i = 1; i < track.points.length; i++) {
            const prevPoint = track.points[i - 1];
            const currentPoint = track.points[i];

            // Distanz zwischen den Punkten berechnen (vereinfacht)
            const lat1 = prevPoint.lat * Math.PI / 180;
            const lat2 = currentPoint.lat * Math.PI / 180;
            const deltaLat = (currentPoint.lat - prevPoint.lat) * Math.PI / 180;
            const deltaLon = (currentPoint.lon - prevPoint.lon) * Math.PI / 180;

            const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const segmentDistance = 6371000 * c; // Erde Radius in Metern

            accumulatedDistance += segmentDistance;

            // Prüfe ob wir einen neuen Stützpunkt brauchen
            if (accumulatedDistance >= nextSupportDistance) {
                supportPoints.push({
                    point: currentPoint,
                    distance: Math.round(accumulatedDistance / 1000), // km
                    index: i
                });
                nextSupportDistance += 10000; // Nächster Punkt in 10km
            }
        }

        return supportPoints;
    };

    return (
        <div className={`relative ${className}`}>
            <MapContainer
                ref={mapRef}
                center={center}
                zoom={13}
                className="h-full w-full rounded-lg"
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBounds tracks={tracks} />

                {tracks.map((track, trackIndex) => {
                    const color = TRACK_COLORS[trackIndex % TRACK_COLORS.length];
                    const positions = track.points.map(point => [point.lat, point.lon] as [number, number]);
                    const supportPoints = generateSupportPoints(track);

                    return (
                        <React.Fragment key={trackIndex}>
                            {/* Route-Linie */}
                            <Polyline
                                positions={positions}
                                color={color}
                                weight={4}
                                opacity={0.8}
                            />

                            {/* Start-Marker */}
                            {track.points.length > 0 && (
                                <Marker
                                    position={[track.points[0].lat, track.points[0].lon]}
                                    icon={L.divIcon({
                                        html: `<div style="background-color: #16a34a; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                                        className: 'custom-div-icon',
                                        iconSize: [20, 20],
                                        iconAnchor: [10, 10]
                                    })}
                                >
                                    <Popup>
                                        <div className="font-medium">
                                            <div className="text-green-600">🏁 Start</div>
                                            <div className="text-sm text-gray-600">{track.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Höhe: {track.points[0].elevation?.toFixed(0) || 'N/A'}m
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {/* End-Marker */}
                            {track.points.length > 1 && (
                                <Marker
                                    position={[track.points[track.points.length - 1].lat, track.points[track.points.length - 1].lon]}
                                    icon={L.divIcon({
                                        html: `<div style="background-color: #dc2626; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><div style="color: white; font-size: 12px; line-height: 14px; text-align: center;">🏁</div></div>`,
                                        className: 'custom-div-icon',
                                        iconSize: [20, 20],
                                        iconAnchor: [10, 10]
                                    })}
                                >
                                    <Popup>
                                        <div className="font-medium">
                                            <div className="text-red-600">🏁 Ziel</div>
                                            <div className="text-sm text-gray-600">{track.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Höhe: {track.points[track.points.length - 1].elevation?.toFixed(0) || 'N/A'}m
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {/* Stützpunkte alle 10km */}
                            {supportPoints.map((supportPoint, index) => (
                                <Marker
                                    key={`support-${trackIndex}-${index}`}
                                    position={[supportPoint.point.lat, supportPoint.point.lon]}
                                    icon={L.divIcon({
                                        html: `<div style="background-color: white; color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${color}; font-size: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${supportPoint.distance}</div>`,
                                        className: 'custom-div-icon',
                                        iconSize: [24, 24],
                                        iconAnchor: [12, 12]
                                    })}
                                >
                                    <Popup>
                                        <div className="font-medium">
                                            <div className="text-blue-600">📍 Stützpunkt</div>
                                            <div className="text-sm text-gray-600">
                                                {supportPoint.distance} km
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Höhe: {supportPoint.point.elevation?.toFixed(0) || 'N/A'}m
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Lat: {supportPoint.point.lat.toFixed(6)}<br />
                                                Lon: {supportPoint.point.lon.toFixed(6)}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </React.Fragment>
                    );
                })}
            </MapContainer>

            {/* Karten-Legende */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
                <div className="text-sm font-medium text-gray-900 mb-2">Legende</div>
                <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Start</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Ziel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full border border-gray-300"></div>
                        <span>10km Punkte</span>
                    </div>
                </div>
            </div>
        </div>
    );
};