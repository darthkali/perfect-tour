import {calculateDistance, Point} from "@we-gold/gpxjs";

export type Coordinate = {
    latitude: number;
    longitude: number;
    elevation: number | null;
};

export type TrackPoint = {
    coordinate: Coordinate,
    distanceFromStart: number,
    timeFromStart: number,
}

export class Track {
    constructor(
        public trackPoints: TrackPoint[],
    ) {
    }

    public static pointToCoordinate(point: Point): Coordinate {
        return {
            latitude: point.latitude,
            longitude: point.longitude,
            elevation: point.elevation,
        }
    }

    private static coordinateToPoint(coordinate: Coordinate): Point {
        return {
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            elevation: coordinate.elevation,
            time: null,
            extensions: null
        }
    }

    static calculateDistanceBetweenTwoCoordinates(startCoordinate: Coordinate, endCoordinate: Coordinate): number {
        let startPoint = Track.coordinateToPoint(startCoordinate)
        let endPoint = Track.coordinateToPoint(endCoordinate)
        return Number(calculateDistance([startPoint, endPoint]).total.toFixed(0))
    }

    public static calculateDistanceBetweenPoints(trackPoints: Coordinate[]): number {
        let points = trackPoints.map(point => this.coordinateToPoint(point))
        return this.round(calculateDistance(points).total, 0)
    }

    static calculateTimeBetweenTwoCoordinatesByAverageSpeed(startCoordinate: Coordinate, endCoordinate: Coordinate, averageSpeedInKmH: number): number {
        let distanceInKm = (Track.calculateDistanceBetweenTwoCoordinates(startCoordinate, endCoordinate) / 1000)
        return Track.round(distanceInKm / averageSpeedInKmH, 3)
    }

    public static calculateTimeBetweenCoordinates(coordinates: Coordinate[], averageSpeedInKmH: number): number {
        let time = 0
        coordinates.forEach((coordinate, index) => {
            if (index === coordinates.length - 1) return
            time += Track.calculateTimeBetweenTwoCoordinatesByAverageSpeed(coordinate, coordinates[index + 1], averageSpeedInKmH)
        })

        return Track.round(time, 3)
    }

    private static round(value: number, precision: number): number {
        const factor = Math.pow(10, precision);
        return Math.round(value * factor) / factor;
    }


}