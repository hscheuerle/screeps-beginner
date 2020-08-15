// because "non-visible" rooms make this automation unreliable (for now)
//  instead create parsable flags that control spawn allocation of remote miners.

import { getBuild } from "creeps/shared/rooms.util";

interface FlagData {
    flag: Flag;
    count: number;
}

export const spawnFlagCreepCheck = (): boolean => {
    const requiredCreep = flagDataForSpawn();
    console.log("flag creep required: ", requiredCreep);
    if (!requiredCreep) return false;

    if (tryRepurposeCreep(requiredCreep)) return true;
    spawnFlagCreep(requiredCreep);
    return true;
};

// check if sufficient creeps assigned to flag.

function flagDataForSpawn() {
    const flagData = Object.values(Game.flags)
        .filter(flagIsParsable)
        .map(flagToFlagData);
    console.log(flagData);
    const found = flagData.find(flagDataNeedsSpawn);
    console.log(found);
    return found;
}
function flagIsParsable(flag: Flag) {
    return flag.name.startsWith("p:");
}
function flagToFlagData(flag: Flag) {
    return { flag, count: parseInt(flag.name.split(":")[1], 10) };
}
function flagDataNeedsSpawn(flagData: FlagData) {
    const { name } = flagData.flag;

    const flagMiners = Object.values(Game.creeps).filter(
        creep => creep.memory.role === "flag-miner"
    ) as FlagMiner[];

    const flags = flagMiners.filter(
        creep => creep.memory.flagMiner.flagName === name
    );

    return flags.length < flagData.count;
}

function spawnFlagCreep(requiredCreep: { flag: Flag; count: number }) {
    const spawn = Game.spawns.Spawn1;

    const memory: FlagMinerMemory = {
        role: "flag-miner",
        flagMiner: { flagName: requiredCreep.flag.name, mining: true },
        renewing: false
    };

    spawn.spawnCreep(
        getBuild(spawn.room.energyAvailable),
        `remote-${Game.time}`,
        { memory }
    );
}

function tryRepurposeCreep(requiredCreep: {
    flag: Flag;
    count: number;
}): boolean {
    const activeRoles: CreepMemory["role"][] = [
        "defender",
        "scavenger",
        "flag-miner"
    ];

    const oldCreep = Object.values(Game.creeps).find(
        creep => !activeRoles.includes(creep.memory.role)
    );

    // TODO: reduce unique werid lint error.
    const flagNames = Object.values(Game.flags).map(flag => flag.name);

    const flagCreeps = Object.values(Game.creeps).filter(
        creep => creep.memory.role === "flag-miner"
    ) as FlagMiner[];

    const oldFlagCreep = flagCreeps.find(creep => {
        return !flagNames.includes(creep.memory.flagMiner.flagName);
    });

    if (!oldCreep && !oldFlagCreep) return false;

    if (oldCreep) {
        const memory: FlagMinerMemory = {
            role: "flag-miner",
            flagMiner: { flagName: requiredCreep.flag.name, mining: true },
            renewing: false
        };
        Memory.creeps[oldCreep.name] = memory;
    } else if (oldFlagCreep) {
        const memory: FlagMinerMemory = {
            role: "flag-miner",
            flagMiner: { flagName: requiredCreep.flag.name, mining: true },
            renewing: false
        };
        Memory.creeps[oldFlagCreep.name] = memory;
    }

    return true;
}
