import {RouteAnalysisTestDsl} from "@/test/behavior/route-analysis/RouteAnalysisTestDsl.ts";
import {beforeEach, describe, it} from "vitest";

let dsl: RouteAnalysisTestDsl;

describe('GPX Reader', () => {
    beforeEach(() => {
        dsl = new RouteAnalysisTestDsl();
    });

    it("shoule read a route-analysis file", () => {
        dsl.given_a_valid_gpx_file_with_a_track()

        dsl.when_the_user_parse_this_gpx_to_an_array_of_points()

        dsl.then_i_get_an_array_of_points()
    })

    it('should read a route-analysis file with waypoints', () => {
        dsl.given_a_valid_gpx_file_with_a_track_and_waypoints()

        dsl.when_the_user_parse_this_gpx_to_an_array_of_points()

        dsl.then_i_get_an_array_of_points()
    })



});