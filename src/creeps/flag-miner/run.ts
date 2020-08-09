import {
    buildClosestConstructionSite,
    renewCreep,
    transferAnyContainer,
    transferSpawn,
    upgradeController
} from "creeps/shared/actions";
import { isEmpty, isFull, updateRenewingState } from "creeps/shared/utilities";
import { harvestRemote } from "./actions";

// TODO: changing the number value breaks the link between flag miners and their flag name.
//  most robust solution is to just reassign flag miners like outdated roles to these "new" flags.
export const runFlagMiners = (): void => {
    const flagMiners = Object.values(Game.creeps).filter(
        creep => creep.memory.role === "flag-miner"
    ) as FlagMiner[];

    flagMiners.forEach(creep => {
        creep.say(creep.memory.flagMiner.flagName);
        updateRenewingState(creep);
        if (renewCreep(creep)) return;

        if (isFull(creep)) {
            creep.memory.flagMiner.mining = false;
        }
        if (isEmpty(creep)) {
            creep.memory.flagMiner.mining = true;
        }

        // TODO: additional routine switching like scavenger actions can.
        if (creep.memory.flagMiner.mining) {
            const didMine = mine(creep);
            if (!didMine) console.log("error in mine flag-miner");
        } else {
            const didTransfer = transfer(creep);
            if (!didTransfer) console.log("error in transfer flag-miner");
        }
    });
};

function mine(creep: FlagMiner): boolean {
    return harvestRemote(creep);
}

function transfer(creep: FlagMiner): boolean {
    if (creep.memory.flagMiner.flagName.endsWith("home")) {
        return (
            transferSpawn(creep, Game.spawns.Spawn1) || upgradeController(creep)
        );
    }
    return (
        transferAnyContainer(creep) ||
        buildClosestConstructionSite(creep) ||
        upgradeController(creep)
    );
}
