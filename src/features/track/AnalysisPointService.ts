import {Track, TrackPoint} from "@/features/track/Track.ts";

export class AnalysisPointService {

    generateAnalysisPoints(trackPoints: TrackPoint[]): TrackPoint[] {

        if (trackPoints.length === 0) return [];

        const analysisPoints: TrackPoint[] = [trackPoints[0]];
        let segmentPoints: TrackPoint[] = [trackPoints[0]];

        for (let i = 1; i < trackPoints.length; i++) {
            segmentPoints.push(trackPoints[i]);

            if (Track.calculateDistanceBetweenPoints(segmentPoints.map(coordinate => coordinate.coordinate)) > 10000) {
                analysisPoints.push(trackPoints[i]);
                // todo: add time
                segmentPoints = [trackPoints[i]];
            }
        }

        const lastPoint = trackPoints[trackPoints.length - 1];
        if (analysisPoints[analysisPoints.length - 1] !== lastPoint) {
            analysisPoints.push(lastPoint);
        }
        return analysisPoints;
    }

}
