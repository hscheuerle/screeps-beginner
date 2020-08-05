import * as roles from "./creeps";
import { ErrorMapper } from "utils/ErrorMapper";
import * as rooms from "rooms";
import { cleanupCreepMemory } from "creeps.util";
import { checkAlarms } from "capabilites/defensive-measures";

rooms.spawnerSetup();
export const loop = ErrorMapper.wrapLoop(() => {
    Memory["alarmSounded"] = false;
    checkAlarms();
    cleanupCreepMemory();
    rooms.spawnerLoop(); // TODO: will fail in sim, since it doesn't account for that op unit by the one resource!
    roles.runHomesteads();
    roles.runPioneers();
    roles.runDefense();
    roles.runRemoteMiners();
    // roles.runClaim();
});
