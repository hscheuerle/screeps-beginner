import { minMax, Workers } from "consts";

export function getTest(room: Room) {
    return room.energyAvailable;
}

// move to rooms util!.
export function getRoomResourcesSortedByDistance(spawn: StructureSpawn) {
    return spawn.room.find(FIND_SOURCES).sort((a, b) => spawn.pos.getRangeTo(a) - spawn.pos.getRangeTo(b));
}

// TODO: since some parts don't increment 50, eventually need to find highest cost unit available to create.
export const getBuild = (available: number): BodyPartConstant[] => {
    const remainder = available % 50;
    let cost = available - remainder;
    cost = Math.max(minMax[0], cost);
    cost = Math.min(minMax[1], cost);
    const body = Workers[cost as keyof typeof Workers] as typeof Workers[keyof typeof Workers];
    return body as unknown as BodyPartConstant[];
}

// TODO: map not flat, or in another function, so that I can get number of units to allocate to a resource.
export const testRoomStuff = (room: Room) => {
    const spawns = room.find(FIND_MY_SPAWNS);
    const sources = room.find(FIND_SOURCES);
    const terrain = room.getTerrain();

    sources
        .flatMap(source => [
            { x: source.pos.x - 1, y: source.pos.y - 1 },
            { x: source.pos.x, y: source.pos.y - 1 },
            { x: source.pos.x + 1, y: source.pos.y - 1 },
            { x: source.pos.x - 1, y: source.pos.y },
            { x: source.pos.x + 1, y: source.pos.y },
            { x: source.pos.x - 1, y: source.pos.y + 1 },
            { x: source.pos.x, y: source.pos.y + 1 },
            { x: source.pos.x + 1, y: source.pos.y + 1 },
        ])
        .map(pos => {
            console.log('flatmap', pos.x, pos.y);
            return pos;
        }).filter(pos =>
            terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL // &&  TERRAIN_MASK_LAVA
        ).map(pos => {
            console.log('filter', pos.x, pos.y);
            return pos;
        }).forEach(pos => {
            room.visual.circle(pos.x, pos.y)
        });
}
