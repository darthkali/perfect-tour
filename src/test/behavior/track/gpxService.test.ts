import {RouteAnalysisTestDsl} from "@/test/behavior/track/RouteAnalysisTestDsl.ts";
import {beforeEach, describe, it} from "vitest";

let dsl: RouteAnalysisTestDsl;

describe('GPX Service', () => {
    beforeEach(() => {
        dsl = new RouteAnalysisTestDsl();
    });

    it("should read a gpx file and convert it into an Track", () => {
        dsl.given_a_valid_gpx_file_with_a_track()

        dsl.when_gpx_file_is_parsed_to_an_track()

        dsl.then_the_result_should_be_a_valid_track_file()
    })

    it('should read a track file with waypoints and convert it into an Track', () => {
        dsl.given_a_valid_gpx_file_with_a_track_and_waypoints()

        dsl.when_gpx_file_is_parsed_to_an_track()

        dsl.then_the_result_should_be_a_valid_track_file()
    })
    
    /*
    * liest
     */
});