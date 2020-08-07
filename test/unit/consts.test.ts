import { costToBody } from "consts";
import { assert } from "chai";

describe("creep body costs", () => {
    it("should get the correct body for cost of 250", () => {
        assert.deepStrictEqual(costToBody(250), [WORK, CARRY, MOVE, MOVE]);
    });
});
