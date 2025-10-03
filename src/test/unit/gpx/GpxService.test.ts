import {describe, it} from "vitest";
import {GpxService} from "@/features/route-analysis/GpxService.ts";
import {Point} from "@we-gold/gpxjs";
import * as fs from "fs";

const gpxFilePath = "./src/test/testData/TestGpxRouteWithWaypoints.gpx"


describe('GPX Service', () => {
    it("should work with a string as parameter", () => {
        let gpxService = new GpxService();
        let gpxFile = fs.readFileSync(gpxFilePath, "utf-8");
        gpxService.parseGpxFromString(gpxFile)

    })

    it('should work with a path as parameter', () => {
        let gpxService = new GpxService();
        gpxService.parseGpxFromPath(gpxFilePath)
    })

    it("should calculate the distance between two coordinates", () => {
        let gpxService = new GpxService();
        let startCoordinate: Point = {
            latitude: 50.725579,
            longitude: 10.703197,
            elevation: null,
            time: null,
            extensions: null
        }
        let endCoordinate: Point = {
            latitude: 50.673567,
            longitude: 10.781002,
            elevation: null,
            time: null,
            extensions: null
        }
        let distance:number = 7967
        expect(gpxService.calculateDistanceBetweenTwoPoints(startCoordinate, endCoordinate)).toBe(distance)
    })

    it("should calculate the distance between an array of coordinates", () => {
        let gpxService = new GpxService();

        let startCoordinate: Point = {
            latitude: 50.673567,
            longitude: 10.781002,
            elevation: null,
            time: null,
            extensions: null
        }

        let secondCoordinate: Point = {
            latitude: 50.725579,
            longitude: 10.703197,
            elevation: null,
            time: null,
            extensions: null
        }

        let endCoordinate: Point = {
            latitude: 50.747612,
            longitude: 10.652093,
            elevation: null,
            time: null,
            extensions: null
        }

        let distance:number = 12319
        expect(gpxService.calculateDistanceBetweenPoints([startCoordinate, secondCoordinate, endCoordinate])).toBe(distance)
    })

});