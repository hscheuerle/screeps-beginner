/*
 * closestX methods don't need target parameter.
 */

export function updateRenewingState(creep: Creep): void {
    if (
        creep.ticksToLive &&
        creep.ticksToLive < 300 &&
        creep.getActiveBodyparts(WORK) >= 5
    ) {
        creep.memory.renewing = true;
    }
}

export function isEmpty(creep: Creep): boolean {
    return creep.store[RESOURCE_ENERGY] === 0;
}

export function isFull(creep: Creep): boolean {
    return creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
}

export function buildClosestConstructionSite(creep: Creep): boolean {
    const constructionSite = creep.pos.findClosestByRange(
        FIND_MY_CONSTRUCTION_SITES
    );

    if (!constructionSite) {
        return false;
    }

    const res = creep.build(constructionSite);
    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite);
    }

    return true;
}

export function transferSpawn(
    creep: Creep,
    spawnStructure: StructureSpawn
): boolean {
    if (spawnStructure.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        return false;
    }

    const res = creep.transfer(spawnStructure, RESOURCE_ENERGY);

    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawnStructure);
    }

    return true;
}

export function transferAnyContainer(creep: Creep): boolean {
    const emptyContainers = creep.room.find(FIND_MY_STRUCTURES, {
        filter(object) {
            return (
                object.structureType === STRUCTURE_EXTENSION &&
                object.store.getFreeCapacity(RESOURCE_ENERGY) !== 0
            );
        }
    });

    if (emptyContainers.length === 0) {
        return false;
    }

    const res = creep.transfer(emptyContainers[0], RESOURCE_ENERGY);
    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(emptyContainers[0]);
    }

    return true;
}

export function upgradeController(
    creep: Creep,
    controller: StructureController | null
): boolean {
    if (!controller) {
        console.log("no controller?");
        return false;
    }

    const res = creep.upgradeController(controller);
    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
    }

    return true;
}

export const harvestRemoteSafe = (creep: FlagMiner): boolean => {
    if (!creep.memory.flagMiner.mining) return false;

    const { flagName } = creep.memory.flagMiner;
    if (!flagName) return false;

    const flag = Game.flags[flagName];
    if (!flag) return false;

    if (flag.room?.name !== creep.room.name) {
        creep.moveTo(flag);
        return true;
    }

    const source = flag.room
        .lookAt(flag)
        .filter(object => object.type === "source")
        .map(object => object.source)
        .find(() => true);
    if (!source) return false;

    const res = creep.harvest(source);
    if (res === OK) {
        return true;
    }
    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
        return true;
    }

    console.log("err harvest remote safe: ", res);
    return true;
};

// need memory to know when process has started, and only unsets when returns -8.
export function renewCreep(creep: Creep): boolean {
    if (creep.memory.renewing === undefined) return false;
    if (creep.memory.renewing === false) return false;

    const spawn = Game.spawns.Spawn1;
    const res = spawn.renewCreep(creep);

    if (res === ERR_FULL) {
        creep.memory.renewing = false;
        return false;
    }

    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
        return true;
    }

    if (res === ERR_NOT_ENOUGH_ENERGY) {
        creep.transfer(spawn, RESOURCE_ENERGY);
        creep.memory.renewing = false;
        return true;
    }

    return true;
}

export function cleanupCreepMemory(): void {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
}
