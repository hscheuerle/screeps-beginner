export function findClosestTombstone(pos: RoomPosition): Tombstone | null {
    return pos.findClosestByRange(FIND_TOMBSTONES, {
        filter: target => target.store.getCapacity()
    });
}

export function getFirstResourceInStore(
    store: Tombstone["store"] | Creep["store"]
): ResourceConstant | null {
    const storeEntries = Object.entries(store) as [ResourceConstant, boolean][];

    const e = storeEntries.find(([, exists]) => exists);
    if (!e) return null;

    return e[0];
}
