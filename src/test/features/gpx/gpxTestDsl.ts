import {expect} from "vitest";
import {Point} from "@we-gold/gpxjs"
import * as fs from "fs";
import {GpxService} from "@/test/features/gpx/GpxService.ts";

const gpxFilePathWithWaypoints = "./src/test/testData/TestGpxRouteWithWaypoints.gpx"
const gpxFilePathWithoutWaypoints = "./src/test/testData/TestGpxRoute.gpx"

export class GpxTestDsl {
    private gpxFile: string | undefined;
    private gpxData!: Point[];

    given_a_valid_gpx_file_with_a_track() {
        this.gpxFile = fs.readFileSync(gpxFilePathWithoutWaypoints, "utf-8");
    }

    given_a_valid_gpx_file_with_a_track_and_waypoints() {
        this.gpxFile = fs.readFileSync(gpxFilePathWithWaypoints, "utf-8");
    }

    when_the_user_parse_this_gpx_to_an_array_of_points() {
        let gpxService = new GpxService
        this.gpxData = gpxService.parseGpxFile(this.gpxFile!)
    }

    then_i_get_an_array_of_points() {
        expect(this.gpxData.length).toBeGreaterThan(1);
        expect(typeof this.gpxData[0].latitude).toBe("number");
        expect(typeof this.gpxData[0].longitude).toBe("number");
        expect(typeof this.gpxData[0].elevation).toBe("number");
    }


}