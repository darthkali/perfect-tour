import {parseGPX, Point} from "@we-gold/gpxjs";

export class GpxService {
    parseGpxFile(file: string): Point[] {
        const [parsedFile, error] = parseGPX(file)
        if (error) throw error
        return parsedFile?.tracks[0].points
    }
}