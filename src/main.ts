import * as roles from "./creeps";
import { ErrorMapper } from "utils/ErrorMapper";
import { spawnerSetup, spawnerLoop } from "rooms";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
spawnerSetup();
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    spawnerLoop(); // TODO: will fail in sim, since it doesn't account for that op unit by the one resource!
    roles.runHomesteads();
    roles.runPioneers();
});
