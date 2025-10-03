import {calculateDistance, parseGPX, Point} from "@we-gold/gpxjs";
import * as fs from "fs";

export class GpxService {
    parseGpxFromString(xmlString: string): Point[] {
        const [parsedFile, error] = parseGPX(xmlString)
        if (error) throw error
        return parsedFile?.tracks[0].points
    }

    parseGpxFromPath(path: string): Point[] {
        return this.parseGpxFromString(fs.readFileSync(path, "utf-8"))
    }

    calculateDistanceBetweenTwoPoints(startCoordinate: Point, endCoordinate: Point): number {
        return Number(calculateDistance([startCoordinate, endCoordinate]).total.toFixed(0))
    }

    calculateDistanceBetweenPoints(points: Point[]): number {
        return Number(calculateDistance(points).total.toFixed(0))
    }
}
