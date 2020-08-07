import * as uc from "./creeps.util";

const RESOURCE = Game.spawns.Spawn1.pos.findClosestByRange(FIND_SOURCES);
const CONTROLLER = Game.spawns.Spawn1.room.controller || null;

// TODO: now that this is so small, group this function in same file as pioneer in creeps.ts
export const runHomesteads = (): void => {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "homestead")
        .forEach(([, homestead]) => {
            uc.updateRenewingState(homestead);
            uc.updateWorkingState(homestead);

            if (uc.renewCreep(homestead)) return;
            if (uc.harvestSource(homestead, RESOURCE)) return;
            if (uc.transferSpawn(homestead, Game.spawns.Spawn1)) return;
            if (uc.upgradeController(homestead, CONTROLLER)) return;
        });
};

export const runPioneers = (): void => {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "pioneer")
        .forEach(([, pioneer]) => {
            uc.updateRenewingState(pioneer);
            uc.updateWorkingState(pioneer);

            if (uc.renewCreep(pioneer)) return;

            if (pioneer.memory.working) {
                const source = Game.getObjectById(
                    pioneer.memory.sourceId
                ) as Source;
                if (!source) {
                    pioneer.moveTo(10, 0);
                } else {
                    uc.harvestSource(pioneer, source);
                    console.log("harvest", pioneer.memory.sourceId);
                }
                return;
            }
            if (uc.transferAnyContainer(pioneer)) return;
            if (uc.buildClosestConstructionSite(pioneer)) return;
            if (uc.upgradeController(pioneer, CONTROLLER)) return;
        });
};

export const runRemoteMiners = (): void => {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "remote-miner")
        .forEach(([, remoteMiner]) => {
            uc.updateRenewingState(remoteMiner);
            uc.updateWorkingState(remoteMiner);

            if (uc.renewCreep(remoteMiner)) return;
            if (harvestRemote(remoteMiner)) return;
            if (uc.buildClosestConstructionSite(remoteMiner)) return;
            if (uc.transferAnyContainer(remoteMiner)) return;
            if (uc.upgradeController(remoteMiner, CONTROLLER)) return;
        });
};

export const runDefense = (): void => {
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
};

export const runClaim = (): void => {
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
};

// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x - 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x + 2, source.pos.y, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y - 2, STRUCTURE_EXTENSION);
// Game.spawns.Spawn1.room.createConstructionSite(source.pos.x, source.pos.y + 2, STRUCTURE_EXTENSION);

// KEEP: harvestRemoteSafe not working
export function harvestRemote(remoteMiner: Creep): boolean {
    if (!remoteMiner.memory.working) return false;

    const { flagName } = remoteMiner.memory;
    if (!flagName) return false;

    const flag = Game.flags[flagName];
    if (!flag) return false;

    try {
        const energy = flag.pos.findClosestByRange(FIND_SOURCES) as Source;
        const res = remoteMiner.harvest(energy);
        if (res === ERR_NOT_IN_RANGE) {
            remoteMiner.moveTo(energy);
        } else {
            console.log(`err ${res}`);
        }
    } catch {
        remoteMiner.moveTo(flag);
    }
    return true;
}
