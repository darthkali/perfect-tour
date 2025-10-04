import {calculateDistance, Point} from "@we-gold/gpxjs";

export interface Coordinate {
    latitude: number;
    longitude: number;
    elevation: number | null;
}

export interface TrackPoint {
    coordinate: Coordinate,
    distanceFromStart: number,
    timeFromStart: number,
}

export interface Track {
    trackPoints: TrackPoint[]
}


export function pointToCoordinate(point: Point): Coordinate {
    return {
        latitude: point.latitude,
        longitude: point.longitude,
        elevation: point.elevation,
    }
}

export function calculateDistanceBetweenPoints(trackPoints: Coordinate[]): number {
    const points = trackPoints.map(point => coordinateToPoint(point))
    return round(calculateDistance(points).total, 0)
}

export function generateAnalysisPoints(track: Track): Track {

    const trackPoints = track.trackPoints;
    if (trackPoints.length === 0) return {trackPoints: []};

    const analysisPoints: TrackPoint[] = [trackPoints[0]];
    let segmentPoints: TrackPoint[] = [trackPoints[0]];

    for (let i = 1; i < trackPoints.length; i++) {
        segmentPoints.push(trackPoints[i]);

        if (calculateDistanceBetweenPoints(segmentPoints.map(coordinate => coordinate.coordinate)) > 10000) {
            analysisPoints.push(trackPoints[i]);
            // todo: add time
            segmentPoints = [trackPoints[i]];
        }
    }

    const lastPoint = trackPoints.at(-1);
    if (analysisPoints.at(-1) !== lastPoint) {
        analysisPoints.push(lastPoint!);
    }
    return {trackPoints: analysisPoints};
}

export function calculateDistanceBetweenTwoCoordinates(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
    const startPoint = coordinateToPoint(startCoordinate)
    const endPoint = coordinateToPoint(endCoordinate)
    return Number(calculateDistance([startPoint, endPoint]).total.toFixed(0))
}

export function calculateTimeBetweenTwoCoordinatesByAverageSpeed(startCoordinate: Coordinate, endCoordinate: Coordinate, averageSpeedInKmH: number): number {
    const distanceInKm = (calculateDistanceBetweenTwoCoordinates(startCoordinate, endCoordinate) / 1000)
    return round(distanceInKm / averageSpeedInKmH, 3)
}


function coordinateToPoint(coordinate: Coordinate): Point {
    return {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        elevation: coordinate.elevation,
        time: null,
        extensions: null
    }
}
export function calculateTimeBetweenCoordinates(coordinates: Coordinate[], averageSpeedInKmH: number): number {
    let time = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
        time += calculateTimeBetweenTwoCoordinatesByAverageSpeed(
            coordinates[i],
            coordinates[i + 1],
            averageSpeedInKmH
        );
    }

    return round(time, 3);
}

function round(value: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
}


