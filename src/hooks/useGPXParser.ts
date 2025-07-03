// src/hooks/useGPXParser.ts
import { useState } from 'react';
import { parseGPX } from '@we-gold/gpxjs';
import * as turf from '@turf/turf';
import type { GPXData, GPXTrack, GPXPoint } from '../types/gpx';

export const useGPXParser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gpxData, setGpxData] = useState<GPXData | null>(null);

    const calculateElevationStats = (points: GPXPoint[]) => {
        if (points.length === 0) {
            return { gain: 0, loss: 0, min: 0, max: 0 };
        }

        let elevationGain = 0;
        let elevationLoss = 0;
        let minElevation = points[0].elevation || 0;
        let maxElevation = points[0].elevation || 0;

        for (let i = 1; i < points.length; i++) {
            const currentElevation = points[i].elevation || 0;
            const previousElevation = points[i - 1].elevation || 0;

            if (currentElevation > previousElevation) {
                elevationGain += currentElevation - previousElevation;
            } else {
                elevationLoss += previousElevation - currentElevation;
            }

            minElevation = Math.min(minElevation, currentElevation);
            maxElevation = Math.max(maxElevation, currentElevation);
        }

        return {
            gain: Math.round(elevationGain),
            loss: Math.round(elevationLoss),
            min: Math.round(minElevation),
            max: Math.round(maxElevation)
        };
    };

    const calculateDistance = (points: GPXPoint[]): number => {
        if (points.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 1; i < points.length; i++) {
            const from = turf.point([points[i - 1].lon, points[i - 1].lat]);
            const to = turf.point([points[i].lon, points[i].lat]);
            totalDistance += turf.distance(from, to, { units: 'meters' });
        }

        return Math.round(totalDistance);
    };

    const parseGPXFile = async (file: File): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const fileContent = await file.text();
            const [parsedGPX, parseError] = parseGPX(fileContent);

            if (parseError) {
                throw new Error(`GPX parsing error: ${parseError.message}`);
            }

            if (!parsedGPX) {
                throw new Error('No data found in GPX file');
            }

            const tracks: GPXTrack[] = parsedGPX.tracks.map((track, index) => {
                // Direkt die points verwenden - keine segments in dieser API
                const allPoints: GPXPoint[] = track.points.map((point) => ({
                    lat: point.latitude,
                    lon: point.longitude,
                    elevation: point.elevation ?? undefined,
                    time: point.time ? new Date(point.time) : undefined
                }));

                const distance = calculateDistance(allPoints);
                const elevationStats = calculateElevationStats(allPoints);

                return {
                    name: track.name || `Track ${index + 1}`,
                    points: allPoints,
                    distance,
                    elevationGain: elevationStats.gain,
                    elevationLoss: elevationStats.loss,
                    minElevation: elevationStats.min,
                    maxElevation: elevationStats.max
                };
            });

            const waypoints: GPXPoint[] = parsedGPX.waypoints?.map((point) => ({
                lat: point.latitude,
                lon: point.longitude,
                elevation: point.elevation ?? undefined
            })) || [];

            const metadata = {
                name: parsedGPX.metadata?.name || undefined,
                description: parsedGPX.metadata?.description || undefined,
                time: parsedGPX.metadata?.time ? new Date(parsedGPX.metadata.time) : undefined
            };

            setGpxData({
                tracks,
                waypoints,
                metadata
            });

        } catch (err) {
            console.error('GPX parsing error:', err);
            setError('Fehler beim Parsen der GPX-Datei. Bitte überprüfen Sie das Dateiformat.');
        } finally {
            setIsLoading(false);
        }
    };

    const clearData = () => {
        setGpxData(null);
        setError(null);
    };

    return {
        parseGPXFile,
        clearData,
        gpxData,
        isLoading,
        error
    };
};