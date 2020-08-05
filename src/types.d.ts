// example declaration file - remove these and add your own custom typings

// import { Role } from "consts";

// memory extension samples
interface CreepMemory {
    role: "homestead" | "pioneer" | "defense" | "claimer" | "remote-miner";
    flagName?: string;
    room: string;
    working: boolean;
    sourceId: string;
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
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
