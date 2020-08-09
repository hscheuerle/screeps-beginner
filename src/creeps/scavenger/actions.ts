// things a creep could do in a tick, makes up steps in a routine.
// returns true if an action is performed by these methods that invoke creep actions.

import { findClosestTombstone, getFirstResourceInStore } from "./utilities";

const spawn = Game.spawns.Spawn1;

export function tryWithdrawAnyTombstone(creep: Scavenger): boolean {
    const tombstone = findClosestTombstone(creep.pos);
    if (!tombstone) return false;

    const resourceConstant = getFirstResourceInStore(tombstone.store);
    if (!resourceConstant) return false;

    const res = creep.withdraw(tombstone, resourceConstant);
    if (res === OK) return true;

    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(tombstone);
        return true;
    }

    console.log(`tryWithdrawAnyTombstone:withdraw-err: ${res}`);
    // TODO: add fail cases here if they should change routine.
    return false;
}

export function tryWithdrawAnyDropped(creep: Creep): boolean {
    console.log("not implemented", creep);
    return false;
}

export function tryTransferSpawn(creep: Creep): boolean {
    console.log("not implemented", creep);
    return false;
}

export function tryTransferAnyContainer(creep: Creep): boolean {
    console.log("not implemented", creep);
    return false;
}

export function tryTransferStorage(creep: Creep): boolean {
    const storageStructures = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_STORAGE }
    });

    if (!storageStructures.length) return false;
    const storageStructure = storageStructures[0];

    const resourceConstant = getFirstResourceInStore(creep.store);
    if (!resourceConstant) return false;

    const res = creep.transfer(storageStructure, resourceConstant);

    if (res === OK) return true;

    if (res === ERR_NOT_IN_RANGE) {
        creep.moveTo(storageStructure);
        return true;
    }

    console.log(`tryTransferStorage:transfer-err: ${res}`);
    // TODO: add fail cases here if they should change routine.
    return false;
}
