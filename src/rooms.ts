import { getBuild, getSourceExposures } from "rooms.util";
import { spawnFlagCreepCheck } from "capabilites/flag-driven-mining";

// instead use reduce and create room.name entry as value can be assigned to it in one step.
export const spawnerSetup = (): void => {
    const spawn: StructureSpawn = Game.spawns.Spawn1;
    const room: Room = spawn.room;

    const memorySpawner = {} as Memory["spawner"][0];

    getSourceExposures(room)
        .sort(sortSourceExposuresByDistanceToSpawn(spawn))
        .forEach(addSpawnerSourceEntry(memorySpawner));

    Memory.spawner = {
        [room.name]: { ...memorySpawner }
    };
};

// need to give source to creep memory so creeps can be renewed to specific sources when created.
export const spawnerLoop = (): void => {
    const spawn: StructureSpawn = Game.spawns.Spawn1;
    const room: Room = spawn.room;
    const creeps = Object.values(Game.creeps);

    // will find homesteads since source is first when accessing keys now, need error checking though.
    const nextBuild = getSourceExposures(room)
        .sort(sortSourceExposuresByDistanceToSpawn(spawn))
        .find(exposure => {
            const sourceValue =
                Memory.spawner[room.name][exposure.source.id.toString()];
            const creepsOnSource = creeps.filter(
                creep => creep.memory.sourceId === exposure.source.id.toString()
            ).length;

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
                working: true,
                renewing: false
            }
        });
    } else {
        spawnFlagCreepCheck();
    }
};

// Still need to make sure harvesters are prioritized.

interface SourceExposure {
    source: Source;
    count: number;
}
type SortSourceExposureCB = (a: SourceExposure, b: SourceExposure) => number;
type ForEachSourceExposureCB = (value: SourceExposure, index: number) => void;

export const checkRemoteMinerSpawns = (
    spawn: StructureSpawn,
    room: Room
): void => {
    for (const [flagName, count] of Object.entries(Memory.remote)) {
        const c = Object.values(Game.creeps).filter(
            creep => creep.memory.flagName === flagName
        ).length;
        if (c < count) {
            spawn.spawnCreep(
                getBuild(room.energyAvailable),
                `remote-${Game.time}`,
                {
                    memory: {
                        role: "remote-miner",
                        room: "",
                        sourceId: "",
                        working: true,
                        flagName,
                        renewing: false
                    }
                }
            );
        }
    }
};

function addSpawnerSourceEntry(
    memorySpawner: Memory["spawner"][0]
): ForEachSourceExposureCB {
    return (sourceExposure, index) => {
        memorySpawner[sourceExposure.source.id.toString()] = {
            role: index === 0 ? "homestead" : "pioneer",
            count: index === 0 ? sourceExposure.count : sourceExposure.count
        };
    };
}

function sortSourceExposuresByDistanceToSpawn(
    spawn: StructureSpawn
): SortSourceExposureCB {
    return (a, b) =>
        a.source.pos.getRangeTo(spawn.pos.x, spawn.pos.y) -
        b.source.pos.getRangeTo(spawn.pos.x, spawn.pos.y);
}
