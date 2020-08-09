// eventually all creeps should be iterated under
import {
    tryTransferAnyContainer,
    tryTransferSpawn,
    tryTransferStorage,
    tryWithdrawAnyDropped,
    tryWithdrawAnyTombstone
} from "./actions";

//  the same loop for performance. in root-level run file.
export function runScavengers(): void {
    Object.values(Game.creeps).forEach(creep => {
        if (creep.memory.role === "scavenger")
            return runScavenger(creep as Scavenger);
    });
}

function runScavenger(creep: Scavenger) {
    // is this necessary anymore? or are these common to all routines and should do logic at top most for that reason?
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory.scavenger.scavenging = true;
    }
    if (creep.store.getFreeCapacity() === 0) {
        creep.memory.scavenger.scavenging = false;
    }

    // This lets a failed transfer routine try a scavenge routine in the same game tick.
    if (creep.memory.scavenger.scavenging) {
        if (scavenge(creep)) return;
        if (transfer(creep)) return;
    } else {
        if (transfer(creep)) return;
        if (scavenge(creep)) return;
    }
}

function scavenge(creep: Scavenger): boolean {
    const didScavenge =
        tryWithdrawAnyTombstone(creep) || tryWithdrawAnyDropped(creep);

    creep.memory.scavenger.scavenging = didScavenge;
    return didScavenge;
}

function transfer(creep: Scavenger): boolean {
    const didTransfer =
        tryTransferSpawn(creep) ||
        tryTransferAnyContainer(creep) ||
        tryTransferStorage(creep);

    creep.memory.scavenger.scavenging = !didTransfer;
    return didTransfer;
}
