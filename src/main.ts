import * as roles from "./creeps";
import { ErrorMapper } from "utils/ErrorMapper";
import { spawnerSetup, spawnerLoop } from "rooms";
import { cleanupCreepMemory } from "creeps.util";

spawnerSetup();
export const loop = ErrorMapper.wrapLoop(() => {
    cleanupCreepMemory();
    spawnerLoop(); // TODO: will fail in sim, since it doesn't account for that op unit by the one resource!
    roles.runHomesteads();
    roles.runPioneers();
});
