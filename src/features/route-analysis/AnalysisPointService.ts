import {Point} from "@we-gold/gpxjs";
import {GpxService} from "@/features/route-analysis/GpxService.ts";

export class AnalysisPointService {
    private gpxService = new GpxService();

    generateAnalysisPoints(gpxPoints: Point[]) {
        let analysisPoints: Point[] = [gpxPoints[0]];

        let startPoints: Point[] = []
        gpxPoints.forEach((point) => {
            startPoints.push(point)
            if(this.gpxService.calculateDistanceBetweenPoints(startPoints) > 10000) {
                analysisPoints.push(point)
                startPoints = []
            } else{
                startPoints.push(point)
            }
        })

        analysisPoints.push(gpxPoints[gpxPoints.length-1])
        return analysisPoints;
    }
}
