export function isEmpty(creep: Creep): boolean {
    return creep.store[RESOURCE_ENERGY] === 0;
}

export function isFull(creep: Creep): boolean {
    return creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;
}

export const parts = (
    part: BodyPartConstant,
    count: number
): BodyPartConstant[] => Array(count).fill(part) as BodyPartConstant[];

export function updateRenewingState(creep: Creep): void {
    if (
        creep.ticksToLive &&
        creep.ticksToLive < 300 &&
        creep.getActiveBodyparts(WORK) >= 5
    ) {
        creep.memory.renewing = true;
    }
}
