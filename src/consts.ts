/* eslint-disable id-blacklist */
export const Roles = {
    HOMESTEAD: "homestead",
    PIONEER: "pioneer"
} as const;

export type Role = typeof Roles[keyof typeof Roles];

const parts = (part: BodyPartConstant, count: number): BodyPartConstant[] =>
    Array(count).fill(part) as BodyPartConstant[];

// adding a worker will automatically create these workers if enough energy available.
// FIX: missing 50 increments cause errors, since it limits to max, but won't find next possible value.
// pattern is add move, add carry, replace carry with work.
// i = cost / 50 floor
// 5,6,7 (1)  8,9,10 (2)   11,12,13 (3)

// change formula to accomodate more carry since all higher level workers can deplete resource without
//  an excessive amount of workers
const costToWorkBody = (n: number) => Math.floor((n - 250) / 150) + 1;
const costToCarryBody = (n: number) => (((n - 250) / 50) % 3 === 2 ? 2 : 1);
const costToMoveBody = (n: number) => Math.floor(n / 150) + 1;
export const costToBody = (cost: number): BodyPartConstant[] => [
    ...parts(WORK, costToWorkBody(cost)),
    ...parts(CARRY, costToCarryBody(cost)),
    ...parts(MOVE, costToMoveBody(cost))
];
export const availableToCost = (room: Room): number => {
    return room.energyAvailable;
};

// don't have to necessarily spend all resources if part would be useless, like an extra move!!!
export const Workers = {
    250: [...parts(WORK, 1), ...parts(CARRY, 1), ...parts(MOVE, 2)], // start of pattern. i = 0;  50s  = 5
    300: [...parts(WORK, 1), ...parts(CARRY, 1), ...parts(MOVE, 3)], // 1; 6
    350: [...parts(WORK, 1), ...parts(CARRY, 2), ...parts(MOVE, 3)], // 2; 7
    400: [...parts(WORK, 2), ...parts(CARRY, 1), ...parts(MOVE, 3)], // 3; 8
    450: [...parts(WORK, 2), ...parts(CARRY, 1), ...parts(MOVE, 4)], // 4; 9
    500: [...parts(WORK, 2), ...parts(CARRY, 2), ...parts(MOVE, 4)],
    550: [...parts(WORK, 3), ...parts(CARRY, 1), ...parts(MOVE, 4)],
    600: [...parts(WORK, 3), ...parts(CARRY, 1), ...parts(MOVE, 5)],
    650: [...parts(WORK, 3), ...parts(CARRY, 2), ...parts(MOVE, 5)],
    700: [...parts(WORK, 4), ...parts(CARRY, 1), ...parts(MOVE, 5)],
    750: [...parts(WORK, 4), ...parts(CARRY, 1), ...parts(MOVE, 6)],
    800: [...parts(WORK, 4), ...parts(CARRY, 2), ...parts(MOVE, 6)],
    850: [...parts(WORK, 5), ...parts(CARRY, 1), ...parts(MOVE, 6)],
    900: [...parts(WORK, 5), ...parts(CARRY, 1), ...parts(MOVE, 7)],
    950: [...parts(WORK, 5), ...parts(CARRY, 2), ...parts(MOVE, 7)],
    1000: [...parts(WORK, 6), ...parts(CARRY, 1), ...parts(MOVE, 7)],
    1050: [...parts(WORK, 6), ...parts(CARRY, 1), ...parts(MOVE, 8)],
    1100: [...parts(WORK, 6), ...parts(CARRY, 2), ...parts(MOVE, 8)],
    1150: [...parts(WORK, 7), ...parts(CARRY, 1), ...parts(MOVE, 8)],
    1200: [...parts(WORK, 7), ...parts(CARRY, 1), ...parts(MOVE, 9)],
    1250: [...parts(WORK, 7), ...parts(CARRY, 2), ...parts(MOVE, 9)],
    1300: [...parts(WORK, 6), ...parts(CARRY, 4), ...parts(MOVE, 10)] // 14 * 50
} as const;
// for WORK, f(1) = 250 - 350, f(2) = 400 - 500, f(3) = 550 - 650, f(4) = 700 - 800

export const Offense = {
    ATTACK: [
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE
    ],
    CLAIM: [CLAIM, ...parts(MOVE, 4)]
};

export const minMax = Object.keys(Workers)
    .map(key => parseInt(key, 10))
    .reduce(
        (range, cost) => [Math.min(range[0], cost), Math.max(range[1], cost)],
        [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    );
