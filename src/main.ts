import * as roles from "./creeps";
import * as room from 'rooms';
import { ErrorMapper } from "utils/ErrorMapper";
import { Role } from "consts";
import { getBuild } from "rooms.util";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    room.run();

    console.log(`Current game tick is ${Game.time}`);

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    const available = Game.spawns.Spawn1.room.energyAvailable;
    const body = getBuild(available);

    if (needHomesteads()) {
        spawnHomestead(body);
    } else if (needPioneers()) {
        spawnPioneer(body);
    }

    roles.runHomesteads();
    roles.runPioneers();

});

function needHomesteads() {
    return getUnitCountByRole("homestead") < 3;
}

function needPioneers() {
    return getUnitCountByRole("pioneer") < 3;
}

function spawnHomestead(body: BodyPartConstant[]) {
    Game.spawns.Spawn1.spawnCreep(body, `homestead-${Game.time}`, {
        memory: {
            role: "homestead",
            room: Game.spawns.Spawn1.room.name,
            working: true
        }
    });
}

function spawnPioneer(body: BodyPartConstant[]) {
    Game.spawns.Spawn1.spawnCreep(body, `pioneer-${Game.time}`, {
        memory: {
            role: "pioneer",
            room: Game.spawns.Spawn1.room.name,
            working: true
        }
    });
}

function getUnitCountByRole(role: Role) {
    return Object.values(Game.creeps).filter(creep => creep.memory.role === role).length;
}
