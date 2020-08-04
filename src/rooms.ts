import { getSourceExposures, getBuild } from "rooms.util";
import { Offense } from "consts";

// instead use reduce and create room.name entry as value can be assigned to it in one step.
export const spawnerSetup = () => {
    const spawn: StructureSpawn = Game.spawns.Spawn1;
    const room: Room = spawn.room;

    let memorySpawner = {} as any;

    let secondary = {} as any;

    getSourceExposures(room)
        .sort(sortSourceExposuresByDistanceToSpawn(spawn))
        .forEach(addSpawnerSourceEntry(memorySpawner, room));

    getSourceExposures(Game.rooms.E4S27).forEach(sourceExposure => {
        memorySpawner[sourceExposure.source.id.toString()] = {
            role: "pioneer",
            count: sourceExposure.count + 2
        };
    });

    console.log(memorySpawner);
    console.log(secondary);

    Memory["spawner"] = {
        [room.name]: { ...memorySpawner },
        [Game.rooms.E4S27.name]: { ...secondary }
    } as any;
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
        .concat(getSourceExposures(Game.rooms.E4S27))
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
    } else {
        // spawn.spawnCreep(Offense.ATTACK, "defense" + Game.time, {
        //     memory: { role: "defense", room: "", sourceId: "", working: true }
        // });
        // spawn.spawnCreep(Offense.CLAIM, "claim-" + Game.time, {
        //     memory: { role: "claimer", room: "", sourceId: "", working: true }
        // });
        // TODO: for claimers, there's 4 available areas of attack on that enemy controller.
    }
};

// Still need to make sure harvesters are prioritized.

type SourceExposure = { source: Source; count: number };
type SortSourceExposureCB = (a: SourceExposure, b: SourceExposure) => number;
type ForEachSourceExposureCB = (value: SourceExposure, index: number) => void;

function addSpawnerSourceEntry(memorySpawner: any, room: Room): ForEachSourceExposureCB {
    return (sourceExposure, index) => {
        memorySpawner[sourceExposure.source.id.toString()] = {
            role: index === 0 ? "homestead" : "pioneer",
            count: index === 0 ? sourceExposure.count : sourceExposure.count + 2
        };
    };
}

function sortSourceExposuresByDistanceToSpawn(spawn: StructureSpawn): SortSourceExposureCB {
    return (a, b) =>
        a.source.pos.getRangeTo(spawn.pos.x, spawn.pos.y) - b.source.pos.getRangeTo(spawn.pos.x, spawn.pos.y);
}
