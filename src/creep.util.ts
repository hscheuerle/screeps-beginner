/*
 * closestX methods don't need target parameter.
 */

// rename toggle harvest toggle working? something?
export function setHarvestingState(creep: Creep): void {
    if (isEmpty(creep)) {
        creep.memory.working = true;
    }
    if (isFull(creep)) {
        creep.memory.working = false;
    }
}

export function isEmpty(creep: Creep): boolean {
    return creep.store[RESOURCE_ENERGY] === 0;
}

export function isFull(creep: Creep): boolean {
    return creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
}

export function buildClosestConstructionSite(creep: Creep): boolean {
    const constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

    if (!constructionSite) {
        return false;
    }

    const res = creep.build(constructionSite);
    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSite);
    }

    return true;
}

export function harvestSource(creep: Creep, resource: Source | null): boolean {
    if (!resource) {
        return false;
    }

    const res = creep.harvest(resource);

    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(resource.pos.x, resource.pos.y);
    }

    return true;
}

export function transferSpawn(creep: Creep, spawnStructure: StructureSpawn): boolean {
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
            return object.structureType === STRUCTURE_EXTENSION && object.store.getFreeCapacity(RESOURCE_ENERGY) !== 0;
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

export function upgradeController(creep: Creep, controller: StructureController | null): boolean {
    if (!controller) {
        return false;
    }

    const res = creep.upgradeController(controller);
    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
    }

    return true;
}
