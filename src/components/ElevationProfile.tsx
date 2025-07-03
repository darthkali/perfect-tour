import React, { useMemo } from 'react';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart,
    ReferenceLine
} from 'recharts';
import type { GPXTrack, GPXPoint } from '../types/gpx';

interface ElevationProfileProps {
    tracks: GPXTrack[];
    className?: string;
    onPointHover?: (point: GPXPoint, trackIndex: number) => void;
}

interface ElevationDataPoint {
    distance: number; // km
    elevation: number; // m
    originalPoint: GPXPoint;
    trackIndex: number;
    slope: number; // %
    cumulativeDistance: number; // m
}

export const ElevationProfile: React.FC<ElevationProfileProps> = ({
                                                                      tracks,
                                                                      className = '',
                                                                      onPointHover
                                                                  }) => {

    // Berechne Höhenprofil-Daten
    const elevationData = useMemo(() => {
        const data: ElevationDataPoint[] = [];

        tracks.forEach((track, trackIndex) => {
            let cumulativeDistance = 0;

            track.points.forEach((point, pointIndex) => {
                if (pointIndex > 0) {
                    // Distanz zum vorherigen Punkt berechnen
                    const prevPoint = track.points[pointIndex - 1];
                    const lat1 = prevPoint.lat * Math.PI / 180;
                    const lat2 = point.lat * Math.PI / 180;
                    const deltaLat = (point.lat - prevPoint.lat) * Math.PI / 180;
                    const deltaLon = (point.lon - prevPoint.lon) * Math.PI / 180;

                    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                        Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    const segmentDistance = 6371000 * c; // Distanz in Metern

                    cumulativeDistance += segmentDistance;
                }

                // Steigung berechnen
                let slope = 0;
                if (pointIndex > 0 && pointIndex < track.points.length - 1) {
                    const prevPoint = track.points[pointIndex - 1];
                    const nextPoint = track.points[pointIndex + 1];

                    if (prevPoint.elevation && nextPoint.elevation && point.elevation) {
                        const elevationDiff = nextPoint.elevation - prevPoint.elevation;
                        const horizontalDist = 200; // Vereinfacht: nehmen ca. 200m für Steigungsberechnung
                        slope = (elevationDiff / horizontalDist) * 100;
                    }
                }

                // Nur jeden 10. Punkt nehmen für bessere Performance
                if (pointIndex % 10 === 0 || pointIndex === 0 || pointIndex === track.points.length - 1) {
                    data.push({
                        distance: cumulativeDistance / 1000, // km
                        elevation: point.elevation || 0,
                        originalPoint: point,
                        trackIndex,
                        slope: Math.round(slope * 10) / 10,
                        cumulativeDistance
                    });
                }
            });
        });

        return data.sort((a, b) => a.distance - b.distance);
    }, [tracks]);

    // Statistiken berechnen
    const stats = useMemo(() => {
        if (elevationData.length === 0) return null;

        const elevations = elevationData.map(d => d.elevation).filter(e => e > 0);
        const slopes = elevationData.map(d => d.slope).filter(s => !isNaN(s));

        return {
            maxElevation: Math.max(...elevations),
            minElevation: Math.min(...elevations),
            maxSlope: Math.max(...slopes),
            minSlope: Math.min(...slopes),
            totalDistance: Math.max(...elevationData.map(d => d.distance))
        };
    }, [elevationData]);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as ElevationDataPoint;

            // Trigger hover event
            if (onPointHover) {
                onPointHover(data.originalPoint, data.trackIndex);
            }

            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <div className="font-medium text-gray-900">
                        {label.toFixed(1)} km
                    </div>
                    <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span>Höhe: {data.elevation.toFixed(0)} m</span>
                        </div>
                        {!isNaN(data.slope) && (
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded ${
                                    data.slope > 5 ? 'bg-red-500' :
                                        data.slope > 0 ? 'bg-orange-500' :
                                            data.slope < -5 ? 'bg-green-500' : 'bg-gray-500'
                                }`}></div>
                                <span>Steigung: {data.slope.toFixed(1)}%</span>
                            </div>
                        )}
                        <div className="text-xs text-gray-500">
                            Lat: {data.originalPoint.lat.toFixed(6)}<br />
                            Lon: {data.originalPoint.lon.toFixed(6)}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // // Farbe basierend auf Steigung
    // const getSlopeColor = (slope: number) => {
    //     if (slope > 8) return '#dc2626'; // Steep uphill - red
    //     if (slope > 4) return '#ea580c'; // Moderate uphill - orange
    //     if (slope > 0) return '#65a30d'; // Light uphill - lime
    //     if (slope > -4) return '#16a34a'; // Light downhill - green
    //     if (slope > -8) return '#0ea5e9'; // Moderate downhill - blue
    //     return '#7c3aed'; // Steep downhill - purple
    // };

    if (elevationData.length === 0) {
        return (
            <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
                <p className="text-gray-500">Keine Höhendaten verfügbar</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Höhenprofil</h3>
                {stats && (
                    <div className="flex space-x-4 text-sm text-gray-600">
                        <span>Max: {stats.maxElevation}m</span>
                        <span>Min: {stats.minElevation}m</span>
                        <span>Distanz: {stats.totalDistance.toFixed(1)}km</span>
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={elevationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="distance"
                            type="number"
                            scale="linear"
                            domain={['dataMin', 'dataMax']}
                            tickFormatter={(value) => `${value.toFixed(1)}km`}
                            stroke="#6b7280"
                        />
                        <YAxis
                            domain={['dataMin - 50', 'dataMax + 50']}
                            tickFormatter={(value) => `${value}m`}
                            stroke="#6b7280"
                        />

                        {/* Höhenfläche */}
                        <Area
                            type="monotone"
                            dataKey="elevation"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fill="url(#elevationGradient)"
                            fillOpacity={0.3}
                        />

                        {/* Höhenlinie */}
                        <Line
                            type="monotone"
                            dataKey="elevation"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>

                        {/* Referenzlinien für durchschnittliche Höhe */}
                        {stats && (
                            <ReferenceLine
                                y={(stats.maxElevation + stats.minElevation) / 2}
                                stroke="#6b7280"
                                strokeDasharray="5 5"
                                label="Ø"
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Steigungslegende */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    <span>Sehr steil (8%+)</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-600 rounded"></div>
                    <span>Steil (4-8%)</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-lime-600 rounded"></div>
                    <span>Leicht bergauf</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span>Leicht bergab</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span>Steil bergab</span>
                </div>
            </div>

            {/* Zusätzliche Statistiken */}
            {stats && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="font-semibold text-blue-900">{stats.maxElevation}m</div>
                        <div className="text-blue-600">Höchster Punkt</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="font-semibold text-green-900">{stats.minElevation}m</div>
                        <div className="text-green-600">Niedrigster Punkt</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="font-semibold text-red-900">{stats.maxSlope.toFixed(1)}%</div>
                        <div className="text-red-600">Steilste Steigung</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="font-semibold text-purple-900">{Math.abs(stats.minSlope).toFixed(1)}%</div>
                        <div className="text-purple-600">Steilstes Gefälle</div>
                    </div>
                </div>
            )}
        </div>
    );
};