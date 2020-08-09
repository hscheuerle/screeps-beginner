export const runDefenders = (): void => {
    Object.entries(Game.creeps)
        .filter(([, creep]) => creep.memory.role === "defender")
        .forEach(([, creep]) => {
            const hostiles = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);
            if (!hostiles.length) {
                creep.moveTo(Game.spawns.Spawn1);
                return;
            }
            const hostile = hostiles[0];

            const res = creep.attack(hostile);

            if (res === OK) return;

            if (res === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile);
                return;
            }

            console.log("some other error on defender ", res);
        });
};
