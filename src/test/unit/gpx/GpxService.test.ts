import {describe, expect, it} from "vitest";
import {GpxService} from "@/features/track/GpxService.ts";
import * as fs from "fs";
import {
    calculateDistanceBetweenPoints, calculateDistanceBetweenTwoCoordinates, calculateTimeBetweenCoordinates,
    calculateTimeBetweenTwoCoordinatesByAverageSpeed,
    Coordinate,
} from "@/features/track/Track.ts";

const gpxFilePath = "./src/test/testData/TestGpxRouteWithWaypoints.gpx"


describe('GPX Service', () => {
    let gpxService = new GpxService();

    it("should work with a string as parameter", () => {
        let gpxService = new GpxService();
        let gpxFile = fs.readFileSync(gpxFilePath, "utf-8");
        gpxService.gpxToTrack(gpxFile)

    })

    it('should work with a path as parameter', () => {
        gpxService.parseGpxFromPath(gpxFilePath)
    })

    it("should calculate the distance between two coordinates", () => {
        let startCoordinate: Coordinate = {
            latitude: 50.725579,
            longitude: 10.703197,
            elevation: null,
        }
        let endCoordinate: Coordinate = {
            latitude: 50.673567,
            longitude: 10.781002,
            elevation: null,
        }
        let distance: number = 7967
        expect(calculateDistanceBetweenTwoCoordinates(startCoordinate, endCoordinate)).toBe(distance)
    })

    it("should calculate the distance between an array of coordinates", () => {
        let startCoordinate: Coordinate = {
            latitude: 50.673567,
            longitude: 10.781002,
            elevation: null,
        }

        let secondCoordinate: Coordinate = {
            latitude: 50.725579,
            longitude: 10.703197,
            elevation: null,
        }

        let endCoordinate: Coordinate = {
            latitude: 50.747612,
            longitude: 10.652093,
            elevation: null,
        }

        let distance: number = 12319
        expect(calculateDistanceBetweenPoints([startCoordinate, secondCoordinate, endCoordinate])).toBe(distance)
    })

    it("should calculate the time between two coordinates", () => {
        let startCoordinate: Coordinate = {
            latitude: 48.1351,
            longitude: 11.5820,
            elevation: null,
        }
        let endCoordinate: Coordinate = {
            latitude: 48.2082,
            longitude: 11.9245,
            elevation: null,
        }
        // distance 26,67
        let averageSpeed = 20
        let time = 1.333

        expect(calculateTimeBetweenTwoCoordinatesByAverageSpeed(startCoordinate, endCoordinate, averageSpeed))
            .toBe(time)
    })

    it("should calculate the time between an array of coordinates", () => {
        let startCoordinate: Coordinate = {
            latitude: 48.1351,
            longitude: 11.5820,
            elevation: null,
        }
        let secondCoordinate: Coordinate = {
            latitude: 48.2082,
            longitude: 11.9245,
            elevation: null,
        }
        let endCoordinate: Coordinate = {
            latitude: 48.3351,
            longitude: 11.6820,
            elevation: null,
        }
        // distance 26.67 + 22.83
        let averageSpeed = 20
        let time = 2.475

        expect(calculateTimeBetweenCoordinates([startCoordinate, secondCoordinate, endCoordinate], averageSpeed))
            .toBe(time)
    })

});