import { checkScavengerSpawn, runScavengers } from "creeps/scavenger";
import { ErrorMapper } from "utils/ErrorMapper";
import { atLeastOneDefense } from "creeps/defender/spawn";
import { checkAlarms } from "checks/defensive-measures";
import { cleanupCreepMemory } from "creeps/shared/creeps.util";
import { runClaimer } from "creeps/claimer/run";
import { runDefenders } from "creeps/defender/run";
import { runFlagMiners } from "creeps/flag-miner/run";
import { spawnFlagCreepCheck } from "creeps/flag-miner/spawn";

Memory.alarmSounded = false;
export const loop = ErrorMapper.wrapLoop(() => {
    checkAlarms();
    cleanupCreepMemory();

    spawnerLoop();
    runLoop();
});

function spawnerLoop(): void {
    if (atLeastOneDefense() || spawnFlagCreepCheck() || checkScavengerSpawn())
        return;
}

function runLoop(): void {
    runScavengers();
    runFlagMiners();
    runDefenders();
    runTowers();
    runClaimer();
}

function runTowers() {
    const towers = Object.values(Game.structures).filter(
        structure => structure.structureType === STRUCTURE_TOWER
    ) as StructureTower[];

    towers.forEach(tower => {
        const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) tower.attack(hostile);
    });
}
