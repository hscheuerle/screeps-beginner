// example declaration file - remove these and add your own custom typings

// import { Role } from "consts";

// memory extension samples
interface CreepMemory {
    role: "homestead" | "pioneer";
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
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
