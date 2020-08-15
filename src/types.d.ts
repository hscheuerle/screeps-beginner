// example declaration file - remove these and add your own custom typings

// import { FlagMinerMemory } from "creeps/flag-miner/models";
// import { ScavengerMemory } from "creeps/scavenger/models";

interface CreepMemory {
    role: "scavenger" | "flag-miner" | "defender" | "claimer";
    renewing: boolean;
}

interface ScavengerMemory extends CreepMemory {
    role: "scavenger";
    scavenger: { scavenging: boolean };
}
interface FlagMinerMemory extends CreepMemory {
    role: "flag-miner";
    flagMiner: { flagName: string; mining: boolean };
}

interface DefenderMemory extends CreepMemory {
    role: "defender";
}

interface Scavenger extends Creep {
    memory: ScavengerMemory;
}

interface FlagMiner extends Creep {
    memory: FlagMinerMemory;
}

interface Defender extends Creep {
    memory: DefenderMemory;
}

interface Memory {
    uuid: number;
    log: any;
    spawner: {
        [roomName: string]: {
            [sourceId: string]: {
                role: string;
                count: number;
            };
        };
    };
    remote: {
        [flagName: string]: number;
    };
    alarmSounded: boolean;
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
