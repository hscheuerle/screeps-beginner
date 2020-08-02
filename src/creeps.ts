import * as uc from "./creeps.util";
import { getRoomResourcesSortedByDistance } from "rooms.util";

const RESOURCE = Game.spawns.Spawn1.pos.findClosestByRange(FIND_SOURCES);
const CONTROLLER = Game.spawns.Spawn1.room.controller || null;

// TODO: now that this is so small, group this function in same file as pioneer in creeps.ts
export function runHomesteads(): void {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "homestead")
        .forEach(([, homestead]) => {
            uc.setHarvestingState(homestead);

            if (homestead.memory.working) {
                uc.harvestSource(homestead, RESOURCE);
            } else if (uc.transferSpawn(homestead, Game.spawns.Spawn1)) {
                console.log("transferSpawn");
            } else if (uc.upgradeController(homestead, CONTROLLER)) {
                console.log("upgradeController");
            } else {
                console.log("do nothing");
            }
        });
}

export function runPioneers(): void {
    const source = getRoomResourcesSortedByDistance(Game.spawns.Spawn1)[2];

    Object.entries(Game.creeps)
    .filter(([, creep]) => creep.memory.role === 'pioneer')
    .forEach(([, pioneer]) => {
        uc.setHarvestingState(pioneer);

        if (pioneer.memory.working) {
            uc.harvestSource(pioneer, source);
        } else if (uc.transferAnyContainer(pioneer)) {
            console.log("transferAnyContainer");
        } else if (uc.buildClosestConstructionSite(pioneer)) {
            console.log("buildClosestConstructionSite");
        } else if (uc.upgradeController(pioneer, CONTROLLER)) {
            console.log("do nothing");
        }
    });
}

// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x - 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x + 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y - 2, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y + 2, STRUCTURE_EXTENSION);
