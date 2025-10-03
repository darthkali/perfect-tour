import {beforeEach, describe} from "vitest";
import {RouteAnalysisTestDsl} from "@/test/behavior/route-analysis/RouteAnalysisTestDsl.ts";

describe("Points Along Route", () => {
    let dsl: RouteAnalysisTestDsl;

    beforeEach(() => {
        dsl = new RouteAnalysisTestDsl();
    });

    it("should generate points along a route", () => {
        dsl.given_a_valid_gpx_file_with_a_track()

        dsl.when_the_user_parse_this_gpx_to_an_array_of_points()
        dsl.when_user_generates_analysis_points()

        dsl.then_the_start_point_should_be_the_first_coordinate()
        dsl.then_the_end_point_should_be_the_last_coordinate()
        dsl.then_the_points_between_the_first_and_last_point_should_have_interval_distance_from_10_km()

    })

    it("should generate points along a route", () => {
        dsl.given_a_valid_gpx_file_with_a_track_and_waypoints()

        dsl.when_the_user_parse_this_gpx_to_an_array_of_points()
        dsl.when_user_generates_analysis_points()

        dsl.then_the_start_point_should_be_the_first_coordinate()
        dsl.then_the_end_point_should_be_the_last_coordinate()
        dsl.then_the_points_between_the_first_and_last_point_should_have_interval_distance_from_10_km()

    });
})