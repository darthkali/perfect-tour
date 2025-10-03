import { parseGPX, calculateDistance, calculateElevation } from '@we-gold/gpxjs';

export interface GPXData {
  name: string;
  description?: string;
  trackPoints: Array<{
    lat: number;
    lon: number;
    elevation?: number;
    time?: Date;
  }>;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
}

export async function readGPXFile(file: File): Promise<GPXData> {
  const text = await file.text();
  return parseGPXText(text);
}

export function parseGPXText(gpxText: string): GPXData {
  const parsedGPX = parseGPX(gpxText);

  if (!parsedGPX.tracks || parsedGPX.tracks.length === 0) {
    throw new Error('No tracks found in GPX file');
  }

  const track = parsedGPX.tracks[0];
  const trackPoints = track.points.map(point => ({
    lat: point.latitude,
    lon: point.longitude,
    elevation: point.elevation,
    time: point.time ? new Date(point.time) : undefined,
  }));

  // Calculate distance and elevation using the library's helper functions
  const distance = calculateDistance(track.points);
  const elevation = calculateElevation(track.points);

  return {
    name: track.name || parsedGPX.metadata?.name || 'Unnamed Track',
    description: track.description || parsedGPX.metadata?.description,
    trackPoints,
    distance: distance,
    elevationGain: elevation.gain,
    elevationLoss: elevation.loss,
  };
}