import { testRoomStuff, getSourceExposure as getSourceExposures, getBuild } from "rooms.util";
const TEMP_CREEP_BUFFER = 2;
// instead use reduce and create room.name entry as value can be assigned to it in one step.
export const spawnerSetup = () => {
    const spawn: StructureSpawn = Game.spawns.Spawn1;
    const room: Room = spawn.room;

    let memorySpawner: Memory["spawner"] = {
        [room.name]: {}
    };

    getSourceExposures(room)
        .sort(sortSourceExposuresByDistanceToSpawn(spawn))
        .forEach(addSpawnerSourceEntry(memorySpawner, room));

    Memory["spawner"] = memorySpawner;
};

// need to give source to creep memory so creeps can be renewed to specific sources when created.
export const spawnerLoop = () => {
    const spawn: StructureSpawn = Game.spawns.Spawn1;
    const room: Room = spawn.room;
    const orders = Object.entries(Memory.spawner[room.name]);
    const creeps = Object.values(Game.creeps);
    // let orderSource = ;

    // will find homesteads since source is first when accessing keys now, need error checking though.
    const nextBuild = getSourceExposures(room)
        .sort(sortSourceExposuresByDistanceToSpawn(spawn))
        .find(exposure => {
            const sourceValue = Memory.spawner[room.name][exposure.source.id.toString()];
            const creepsOnSource = creeps.filter(creep => creep.memory.sourceId === exposure.source.id.toString())
                .length;

            return creepsOnSource < sourceValue.count;
        });

    if (nextBuild) {
        const memKey = nextBuild.source.id.toString();
        const { role } = Memory.spawner[room.name][memKey];
        const available = room.energyAvailable;

        // Fix role key because idk why its having issues and it lead to mistake offline.
        spawn.spawnCreep(getBuild(available), Game.time.toString(), {
            memory: {
                role: role as "homestead" | "pioneer",
                room: room.name,
                sourceId: memKey,
                working: true
            }
        });
    }
};

// Still need to make sure harvesters are prioritized.

type SourceExposure = { source: Source; count: number };
type SortSourceExposureCB = (a: SourceExposure, b: SourceExposure) => number;
type ForEachSourceExposureCB = (value: SourceExposure, index: number) => void;

function addSpawnerSourceEntry(memorySpawner: Memory["spawner"], room: Room): ForEachSourceExposureCB {
    return (sourceExposure, index) => {
        memorySpawner[room.name][sourceExposure.source.id.toString()] = {
            role: index === 0 ? "homestead" : "pioneer",
            count: sourceExposure.count + TEMP_CREEP_BUFFER
        };
    };
}

function sortSourceExposuresByDistanceToSpawn(spawn: StructureSpawn): SortSourceExposureCB {
    return (a, b) =>
        a.source.pos.getRangeTo(spawn.pos.x, spawn.pos.y) - b.source.pos.getRangeTo(spawn.pos.x, spawn.pos.y);
}
