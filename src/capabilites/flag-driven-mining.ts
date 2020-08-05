// because "non-visible" rooms make this automation unreliable (for now)
//  instead create parsable flags that control spawn allocation of remote miners.

import { getBuild } from "rooms.util";

interface FlagData {
    flag: Flag;
    count: number;
}

export const spawnFlagCreepCheck = (): boolean => {
    const requiredCreep = flagDataForSpawn();
    if (!requiredCreep) return false;

    spawnFlagCreep(requiredCreep);
    return true;
};

// check if sufficient creeps assigned to flag.

const flagDataForSpawn = () => {
    return Object.values(Game.flags).filter(flagIsParsable).map(flagToFlagData).find(flagDataNeedsSpawn);
};
const flagIsParsable = (flag: Flag) => flag.name.startsWith("p:");
const flagToFlagData = (flag: Flag) => ({ flag: flag, count: parseInt(flag.name.split(":")[1], 10) });
const flagDataNeedsSpawn = (flagData: FlagData) =>
    Object.values(Game.creeps).filter(creep => creep.memory.flagName === flagData.flag.name).length < flagData.count;

function spawnFlagCreep(requiredCreep: { flag: Flag; count: number }) {
    const spawn = Game.spawns.Spawn1;
    spawn.spawnCreep(getBuild(spawn.room.energyAvailable), `remote-${Game.time}`, {
        memory: {
            role: "remote-miner",
            flagName: requiredCreep.flag.name,
            room: spawn.room.name,
            sourceId: "",
            working: true
        }
    });
}
