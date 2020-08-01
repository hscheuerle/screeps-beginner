import * as uc from "./creep.util";

const RESOURCE = Game.spawns.Spawn1.pos.findClosestByRange(FIND_SOURCES);
const CONTROLLER = Game.spawns.Spawn1.room.controller || null;

// TODO: now that this is so small, group this function in same file as pioneer in creeps.ts
export function run(): void {
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
