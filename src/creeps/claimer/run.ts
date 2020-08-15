// Don't need to automate spawning of claimers, its so rare its better just to manually spawn.
export const runClaimer = (): void => {
    Object.values(Game.flags)
        .filter(flag => flag.name.startsWith("c:"))
        .forEach(claim => {
            runClaimers(claim);
        });
};

function runClaimers(flag: Flag) {
    Object.values(Game.creeps)
        .filter(creep => creep.memory.role === "claimer")
        .forEach(creep => {
            claimRemote(creep, flag);
        });
}

export function claimRemote(creep: Creep, flag: Flag): boolean {
    // if (!creep.memory.flagMiner.mining) return false;
    try {
        const controller = flag.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTROLLER }
        }) as StructureController;

        const res = creep.claimController(controller);
        if (res === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {
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
