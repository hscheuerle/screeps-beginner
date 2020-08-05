import * as uc from "./creeps.util";

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
            }
            // GCL not my cl!!!
            else if (uc.upgradeController(homestead, CONTROLLER)) {
                console.log("upgradeController");
            } else {
                console.log("do nothing");
            }
        });
}

export function runPioneers(): void {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "pioneer")
        .forEach(([, pioneer]) => {
            // if (pioneer.room.name != pioneer.memory.room) {
            //     const exitDir = Game.map.findExit(pioneer.room, pioneer.memory.room);
            //     if (exitDir) {
            //         const exit = pioneer.pos.findClosestByRange(exitDir as any);
            //         pioneer.moveTo(exit as any);
            //         return;
            //     }
            // }

            uc.setHarvestingState(pioneer);

            if (pioneer.memory.working) {
                const source = Game.getObjectById(pioneer.memory.sourceId) as Source;
                if (!source) {
                    pioneer.moveTo(10, 0);
                } else {
                    uc.harvestSource(pioneer, source);
                    console.log("harvest", pioneer.memory.sourceId);
                }
            } else if (uc.transferAnyContainer(pioneer)) {
                console.log("transferAnyContainer");
            } else if (uc.buildClosestConstructionSite(pioneer)) {
                console.log("buildClosestConstructionSite");
            } else if (uc.upgradeController(pioneer, CONTROLLER)) {
                console.log("do nothing");
            }
        });
}

export function runRemoteMiners() {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "remote-miner")
        .forEach(([, remoteMiner]) => {
            uc.setHarvestingState(remoteMiner);
            if (harvestRemote(remoteMiner)) return;
            if (uc.buildClosestConstructionSite(remoteMiner)) return;
            if (uc.upgradeController(remoteMiner, CONTROLLER)) return;
        });
}

export function runDefense() {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "defense")
        .forEach(([, defender]) => {
            if (defender.memory.sourceId) {
                const target = Game.getObjectById(defender.memory.sourceId);
                if (target) {
                    const res = defender.attack(target as Creep);
                    if (res === ERR_NOT_IN_RANGE) {
                        defender.moveTo(target as Creep);
                    }
                } else {
                    console.log("invalid attack target");
                }
            } else {
                const stagingFlag: Flag = Game.flags.staging;
                if (stagingFlag) {
                    defender.moveTo(stagingFlag);
                }
            }
        });
}

export function runClaim() {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "claimer")
        .forEach(([, claimer]) => {
            if (claimer.memory.sourceId) {
                const target = Game.getObjectById(claimer.memory.sourceId);
                if (target instanceof StructureController) {
                    const res = claimer.claimController(target);
                    if (res === ERR_NOT_IN_RANGE) {
                        claimer.moveTo(target);
                    } else {
                        console.log("claimer-res", res);
                    }
                } else {
                    console.log("invalid claim target");
                }
            } else {
                const stagingFlag: Flag = Game.flags.staging;
                if (stagingFlag) {
                    claimer.moveTo(stagingFlag);
                }
            }
        });
}

// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x - 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x + 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y - 2, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y + 2, STRUCTURE_EXTENSION);

export function harvestRemote(remoteMiner: Creep): boolean {
    if (!remoteMiner.memory.working) return false;

    const { flagName } = remoteMiner.memory;
    if (!flagName) return false;

    const flag = Game.flags[flagName];
    if (!flag) return false;

    try {
        const energy = flag.pos.findClosestByRange(FIND_SOURCES) as Source;
        console.log(energy);
        const res = remoteMiner.harvest(energy as Source);
        if (res === ERR_NOT_IN_RANGE) {
            remoteMiner.moveTo(energy);
        } else {
            console.log("!!!" + res);
        }
    } catch {
        remoteMiner.moveTo(flag);
    }
    return true;
}
