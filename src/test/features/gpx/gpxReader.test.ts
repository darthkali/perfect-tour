import {GpxTestDsl} from "@/test/features/gpx/gpxTestDsl.ts";
import {beforeEach, describe, it} from "vitest";

let dsl: GpxTestDsl;

describe('GPX Reader', () => {
    beforeEach(() => {
        dsl = new GpxTestDsl();
    });

    it("shoule read a gpx file", () => {
        dsl.given_a_valid_gpx_file_with_a_track()

        dsl.when_the_user_parse_this_gpx_to_an_array_of_points()

        dsl.then_i_get_an_array_of_points()
    })

    it('should read a gpx file with waypoints', () => {
        dsl.given_a_valid_gpx_file_with_a_track_and_waypoints()

        dsl.when_the_user_parse_this_gpx_to_an_array_of_points()

        dsl.then_i_get_an_array_of_points()
    })


});