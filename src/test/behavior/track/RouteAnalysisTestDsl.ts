import {expect} from "vitest";
import {GpxService} from "@/features/track/GpxService.ts";
import {
    calculateDistanceBetweenPoints,
    calculateTimeBetweenCoordinates,
    generateAnalysisPoints,
    Track
} from "@/features/track/Track.ts";

export class RouteAnalysisTestDsl {
    private gpxFilePath!: string
    private track!: Track;
    private analysisTrack!: Track;

    given_a_valid_gpx_file_with_a_track() {
        this.gpxFilePath = "./src/test/testData/TestGpxRoute.gpx";
    }

    given_a_valid_gpx_file_with_a_track_and_waypoints() {
        this.gpxFilePath = "./src/test/testData/TestGpxRouteWithWaypoints.gpx"
    }

    given_a_gpx_file_that_is_shorter_then_10_km() {
        this.gpxFilePath = "./src/test/testData/TestShortGpxRoute.gpx"
    }

    when_gpx_file_is_parsed_to_an_track() {
        let gpxService = new GpxService
        this.track = gpxService.parseGpxFromPath(this.gpxFilePath)
    }

    when_user_generates_analysis_points() {
        this.analysisTrack = generateAnalysisPoints(this.track)
    }

    then_the_result_should_be_a_valid_track_file() {
        const trackPoints = this.track.trackPoints;
        expect(trackPoints.length).toBeGreaterThan(1);

        trackPoints.forEach((point, index) => {
            expect(typeof point.coordinate.latitude).toBe("number");
            expect(typeof point.coordinate.longitude).toBe("number");
            expect(typeof point.coordinate.elevation).toBe("number");

            expect(point.coordinate.latitude).greaterThan(0);
            expect(point.coordinate.longitude).greaterThan(0);
            expect(point.coordinate.elevation).greaterThan(0);

// todo should fail?
            if (index !== 0) {
                expect(trackPoints[0].timeFromStart).toBe(0)
                expect(trackPoints[0].distanceFromStart).toBe(0)
            } else{
                // expect(point.timeFromStart).greaterThan(0)
                // expect(point.distanceFromStart).greaterThan(0)
            }
        })
    }


    then_the_start_point_should_be_the_first_coordinate() {
        expect(this.analysisTrack.trackPoints[0]).toBe(this.track.trackPoints[0])
    }

    then_the_end_point_should_be_the_last_coordinate() {
        expect(this.analysisTrack.trackPoints[this.analysisTrack.trackPoints.length - 1]).toBe(this.track.trackPoints[this.track.trackPoints.length - 1])
    }

    then_the_points_between_the_first_and_last_point_should_have_interval_distance_from_10_km() {
        let startIndex = 0;

        this.analysisTrack.trackPoints.forEach((point, index) => {
            if (index === 0) return;
            if (index === this.analysisTrack.trackPoints.length - 1) return;

            // Finde den Index in gpxData, der dem aktuellen analysisPoint entspricht
            const endIndex = this.track.trackPoints.findIndex((gpxPoint, gpxIndex) => {
                return gpxIndex >= startIndex &&
                    point.coordinate.latitude === gpxPoint.coordinate.latitude &&
                    point.coordinate.longitude === gpxPoint.coordinate.longitude;
            });

            if (endIndex !== -1) {
                const segment = this.track.trackPoints.slice(startIndex, endIndex + 1);

                let distance = calculateDistanceBetweenPoints(segment.map(coordinate => coordinate.coordinate))
                console.log(`Segment ${index}: Distance:`, distance);

                expect(distance).toBeGreaterThan(10000);
                expect(distance).toBeLessThan(10100);

                // Setze den neuen Startindex für das nächste Segment
                startIndex = endIndex;
            }
        });
    }


    then_there_should_be_only_the_first_and_last_point() {
        expect(this.analysisTrack.trackPoints.length).toBe(2)
        expect(this.analysisTrack.trackPoints[0]).toBe(this.track.trackPoints[0])
        expect(this.analysisTrack.trackPoints[1]).toBe(this.track.trackPoints[this.track.trackPoints.length - 1])
    }

    then_the_time_for_each_point_should_be_set_correct_based_on_an_average_speed() {
        // todo: die zeiten werden noch nicht gesetzt und
        let startIndex = 0;

        this.analysisTrack.trackPoints.forEach((point, index) => {
            if (index === 0) return;
            if (index === this.analysisTrack.trackPoints.length - 1) return;

            // Finde den Index in gpxData, der dem aktuellen analysisPoint entspricht
            const endIndex = this.track.trackPoints.findIndex((gpxPoint, gpxIndex) => {
                return gpxIndex >= startIndex &&
                    point.coordinate.latitude === gpxPoint.coordinate.latitude &&
                    point.coordinate.longitude === gpxPoint.coordinate.longitude;
            });


            if (endIndex !== -1) {
                const segment = this.track.trackPoints.slice(startIndex, endIndex + 1);

                let time = calculateTimeBetweenCoordinates(segment.map(coordinate => coordinate.coordinate), 20)
                console.log(`Segment ${index}: Distance:`, time);

                //todo time
                // expect(time).toBe(this.analysisPoints[index].time);


                // Setze den neuen Startindex für das nächste Segment
                startIndex = endIndex;
            }

        });

    }
}