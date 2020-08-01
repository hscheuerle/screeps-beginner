import * as rolesHomestead from "./homestead";
import { ErrorMapper } from "utils/ErrorMapper";
import { Role } from "consts";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    if (needHomesteads()) {
        spawnHomestead();
    } else if (needPioneers()) {
        spawnPioneer();
    }

    rolesHomestead.run();
});

function needHomesteads() {
    return getUnitCountByRole("homestead") < 3;
}

function needPioneers() {
    return getUnitCountByRole("pioneer");
}

function spawnHomestead() {
    Game.spawns.Spawn1.spawnCreep([WORK, MOVE, MOVE, CARRY, CARRY], `homestead-${Game.time}`, {
        memory: {
            role: "homestead",
            room: Game.spawns.Spawn1.room.name,
            working: true
        }
    });
}

function spawnPioneer() {
    Game.spawns.Spawn1.spawnCreep([WORK, MOVE, MOVE, CARRY, CARRY], `homestead-${Game.time}`, {
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
