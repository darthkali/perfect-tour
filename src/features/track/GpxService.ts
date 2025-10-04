import {parseGPX, Point} from "@we-gold/gpxjs";
import * as fs from "fs";
import {pointToCoordinate, Track, TrackPoint} from "@/features/track/Track.ts";

export class GpxService {

    gpxToTrack(xmlString: string): Track {
        const [parsedFile, error] = parseGPX(xmlString)
        if (error) throw error
        let points: Point[] = parsedFile?.tracks[0].points
        //todo add time
        let trackPoints: TrackPoint[] = points.map(point => ({
            coordinate: pointToCoordinate(point),
            distanceFromStart: 0,
            timeFromStart: 0
        }))

        return {trackPoints: trackPoints}
    }

    parseGpxFromPath(path: string): Track {
        return this.gpxToTrack(fs.readFileSync(path, "utf-8"))
    }
}
