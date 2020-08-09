import { Offense } from "creeps/shared/consts";

export const atLeastOneDefense = (): boolean => {
    if (Game.spawns.Spawn1.room.energyAvailable < 800) {
        return false;
    }
    if (
        Object.values(Game.creeps).filter(
            creep => creep.memory.role === "defender"
        ).length >= 1
    ) {
        return false;
    }
    Game.spawns.Spawn1.spawnCreep(Offense.ATTACK, `defense-${Game.time}`, {
        memory: {
            role: "defender",
            renewing: false
        }
    });
    return true;
};
