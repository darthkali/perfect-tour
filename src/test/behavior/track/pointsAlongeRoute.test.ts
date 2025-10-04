import {beforeEach, describe} from "vitest";
import {RouteAnalysisTestDsl} from "@/test/behavior/track/RouteAnalysisTestDsl.ts";

describe("Points Along Route", () => {
    let dsl: RouteAnalysisTestDsl;

    beforeEach(() => {
        dsl = new RouteAnalysisTestDsl();
    });

    it("should generate points along a route", () => {
        dsl.given_a_valid_gpx_file_with_a_track()

        dsl.when_gpx_file_is_parsed_to_an_array_of_support_points()
        dsl.when_user_generates_analysis_points()

        dsl.then_the_start_point_should_be_the_first_coordinate()
        dsl.then_the_end_point_should_be_the_last_coordinate()
        dsl.then_the_points_between_the_first_and_last_point_should_have_interval_distance_from_10_km()
    })

    it("should generate points along a route", () => {
        dsl.given_a_valid_gpx_file_with_a_track_and_waypoints()

        dsl.when_gpx_file_is_parsed_to_an_array_of_support_points()
        dsl.when_user_generates_analysis_points()

        dsl.then_the_start_point_should_be_the_first_coordinate()
        dsl.then_the_end_point_should_be_the_last_coordinate()
        dsl.then_the_points_between_the_first_and_last_point_should_have_interval_distance_from_10_km()
    });

    it("should generate only the first and last point if the route is shorter than 10 km", () =>{
        dsl.given_a_gpx_file_that_is_shorter_then_10_km()

        dsl.when_gpx_file_is_parsed_to_an_array_of_support_points()
        dsl.when_user_generates_analysis_points()

        dsl.then_the_start_point_should_be_the_first_coordinate()
        dsl.then_the_end_point_should_be_the_last_coordinate()
        dsl.then_there_should_be_only_the_first_and_last_point()
    })

    it("should set a valid time for each point", () => {
        dsl.given_a_valid_gpx_file_with_a_track()

        dsl.when_gpx_file_is_parsed_to_an_array_of_support_points()
        dsl.when_user_generates_analysis_points()

        dsl.then_the_time_for_each_point_should_be_set_correct_based_on_an_average_speed()
    })
})