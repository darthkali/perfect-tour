import {expect} from "vitest";
import {Point} from "@we-gold/gpxjs"
import * as fs from "fs";
import {GpxService} from "@/features/route-analysis/GpxService.ts";
import {AnalysisPointService} from "@/features/route-analysis/AnalysisPointService.ts";

const gpxFilePathWithWaypoints = "./src/test/testData/TestGpxRouteWithWaypoints.gpx"
const gpxFilePathWithoutWaypoints = "./src/test/testData/TestGpxRoute.gpx"

export class RouteAnalysisTestDsl {
    private xmlGpxContent: string | undefined;
    private gpxData!: Point[];
    private analysisPoints!: Point[];
    private gpxService = new GpxService();

    given_a_valid_gpx_file_with_a_track() {
        this.xmlGpxContent = fs.readFileSync(gpxFilePathWithoutWaypoints, "utf-8");
    }

    given_a_valid_gpx_file_with_a_track_and_waypoints() {
        this.xmlGpxContent = fs.readFileSync(gpxFilePathWithWaypoints, "utf-8");
    }

    when_the_user_parse_this_gpx_to_an_array_of_points() {
        let gpxService = new GpxService
        this.gpxData = gpxService.parseGpxFromString(this.xmlGpxContent!)
    }

    when_user_generates_analysis_points() {
        let analysisPointService = new AnalysisPointService()
        this.analysisPoints = analysisPointService.generateAnalysisPoints(this.gpxData)
    }

    then_i_get_an_array_of_points() {
        expect(this.gpxData.length).toBeGreaterThan(1);
        expect(typeof this.gpxData[0].latitude).toBe("number");
        expect(typeof this.gpxData[0].longitude).toBe("number");
        expect(typeof this.gpxData[0].elevation).toBe("number");
    }


    then_the_start_point_should_be_the_first_coordinate() {
        expect(this.analysisPoints[0]).toBe(this.gpxData[0])
    }

    then_the_end_point_should_be_the_last_coordinate() {
        expect(this.analysisPoints[this.analysisPoints.length - 1]).toBe(this.gpxData[this.gpxData.length - 1])
    }

    then_the_points_between_the_first_and_last_point_should_have_interval_distance_from_10_km() {
        let startIndex = 0;

        this.analysisPoints.forEach((point, index) => {
            if(index === 0) return;
            if(index === this.analysisPoints.length - 1) return;

            // Finde den Index in gpxData, der dem aktuellen analysisPoint entspricht
            const endIndex = this.gpxData.findIndex((gpxPoint, gpxIndex) => {
                return gpxIndex >= startIndex &&
                    point.latitude === gpxPoint.latitude &&
                    point.longitude === gpxPoint.longitude;
            });

            if(endIndex !== -1) {
                // Extrahiere das Segment von startIndex bis endIndex (inklusive)
                const segment = this.gpxData.slice(startIndex, endIndex + 1);

                console.log('Segment ${index}: Distance:', this.gpxService.calculateDistanceBetweenPoints(segment));

                expect(this.gpxService.calculateDistanceBetweenPoints(segment))
                    .toBeGreaterThan(10000);
                expect(this.gpxService.calculateDistanceBetweenPoints(segment))
                    .toBeLessThan(10100);

                // Setze den neuen Startindex für das nächste Segment
                startIndex = endIndex;
            }
        });
    }
}