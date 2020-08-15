export function harvestRemote(creep: FlagMiner): boolean {
    // if (!creep.memory.flagMiner.mining) return false;

    const { flagName, mining } = creep.memory.flagMiner;
    if (!mining) return false;
    if (!flagName) return false;

    const flag = Game.flags[flagName];
    if (!flag) return false;

    try {
        const energy = flag.pos.findClosestByRange(FIND_SOURCES) as Source;

        const res = creep.harvest(energy);
        if (res === ERR_NOT_IN_RANGE) {
            creep.moveTo(energy, {
                visualizePathStyle: { stroke: "#ffffff" }
            });
        } else {
            console.log(`err ${res}`);
        }
    } catch {
        creep.moveTo(flag);
    }
    return true;
}
