import { findClosestTombstone } from "./utilities";

const spawn = Game.spawns.Spawn1;

export function checkScavengerSpawn(): boolean {
    // TODO: add || findClosestDrop when implemented
    const hasTargets = findClosestTombstone(spawn.pos);
    const hasScavenger = Object.values(Game.creeps).find(
        creep => creep.memory.role === "scavenger"
    );

    const shouldSpawn = hasTargets && !hasScavenger;
    if (!shouldSpawn) return false;

    const memory: ScavengerMemory = {
        role: "scavenger",
        scavenger: { scavenging: true },
        renewing: false
    };

    // TODO: get from available memory.
    // TODO: more dynamic recycling behavior (since not all large units have work type or need many parts).
    spawn.spawnCreep(
        [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        `scavenger-${Game.time}`,
        { memory }
    );

    return true;
}
