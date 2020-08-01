// const utility = require("utility.sources");
import * as uc from "./creep.util";

// TODO: refill containers before building!!!
module.exports = {
    run(creep: Creep) {
        const source = getRoomResourcesSortedByDistance(Game.spawns.Spawn1)[2];

        uc.setHarvestingState(creep);

        if (creep.memory.working) {
            uc.harvestSource(creep, source);
        } else if (uc.transferAnyContainer(creep)) {
            console.log("transferAnyContainer");
        } else if (uc.buildClosestConstructionSite(creep)) {
            console.log("buildClosestConstructionSite");
        }
    }
};

/**
 * @param {Creep} creep
 * @param {ConstructionSite} constructionSite
 */

function getRoomResourcesSortedByDistance(spawn: StructureSpawn) {
    return spawn.room.find(FIND_SOURCES).sort((a, b) => spawn.pos.getRangeTo(a) - spawn.pos.getRangeTo(b));
}

// /** */
// function getWalkableAreaNearSource(source: Source) {
//     const terrain = new Room.Terrain(source.room);
// }

// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x - 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x + 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y - 2, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y + 2, STRUCTURE_EXTENSION);
