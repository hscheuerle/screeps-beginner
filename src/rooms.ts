import { testRoomStuff } from "rooms.util";

export const run = () => {
    const spawn: StructureSpawn = Game.spawns.Spawn1;
    const room: Room = spawn.room;
    testRoomStuff(room);
}
