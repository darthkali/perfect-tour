// src/types/gpx.ts
export interface GPXPoint {
    lat: number;
    lon: number;
    elevation?: number;
    time?: Date;
}

export interface GPXTrack {
    name: string;
    points: GPXPoint[];
    distance: number; // in meters
    elevationGain: number; // in meters
    elevationLoss: number; // in meters
    minElevation: number;
    maxElevation: number;
    duration?: number; // in minutes
}

export interface GPXData {
    tracks: GPXTrack[];
    waypoints: GPXPoint[];
    metadata: {
        name?: string;
        description?: string;
        time?: Date;
    };
}