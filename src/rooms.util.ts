import { Workers, minMax } from "consts";

export function getTest(room: Room): number {
    return room.energyAvailable;
}

// move to rooms util!.
export function getRoomResourcesSortedByDistance(
    spawn: StructureSpawn
): Source[] {
    return spawn.room
        .find(FIND_SOURCES)
        .sort((a, b) => spawn.pos.getRangeTo(a) - spawn.pos.getRangeTo(b));
}

// TODO: since some parts don't increment 50, eventually need to find highest cost unit available to create.
export const getBuild = (available: number): BodyPartConstant[] => {
    const remainder = available % 50;
    let cost = available - remainder;
    cost = Math.max(minMax[0], cost);
    cost = Math.min(minMax[1], cost);
    const body = Workers[cost as keyof typeof Workers];
    return (body as unknown) as BodyPartConstant[];
};

/** the number of locations a resource can be harvested from. */
export const getSourceExposures = (
    room: Room
): { source: Source; count: number }[] => {
    if (!(room instanceof Room)) {
        console.log("room wasnt instance of rooom!!");
        console.log(room);
        return [];
    }
    const sources = room.find(FIND_SOURCES);
    const terrain = room.getTerrain();

    return sources.map(source => {
        return {
            source,
            count: [
                { x: source.pos.x - 1, y: source.pos.y - 1 },
                { x: source.pos.x, y: source.pos.y - 1 },
                { x: source.pos.x + 1, y: source.pos.y - 1 },
                { x: source.pos.x - 1, y: source.pos.y },
                { x: source.pos.x + 1, y: source.pos.y },
                { x: source.pos.x - 1, y: source.pos.y + 1 },
                { x: source.pos.x, y: source.pos.y + 1 },
                { x: source.pos.x + 1, y: source.pos.y + 1 }
            ].filter(pos => terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL)
                .length
        };
    });
};
