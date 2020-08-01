// example declaration file - remove these and add your own custom typings

// import { Role } from "consts";

// memory extension samples
interface CreepMemory {
    role: "homestead" | "pioneer";
    room: string;
    working: boolean;
}

interface Memory {
    uuid: number;
    log: any;
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}
