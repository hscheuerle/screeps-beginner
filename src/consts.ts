export const Roles = {
    HOMESTEAD: "homestead",
    PIONEER: "pioneer"
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export const Workers = {
    300: [WORK, CARRY, CARRY, MOVE, MOVE],
    350: [WORK, CARRY, MOVE, MOVE, MOVE],
    400: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    450: [WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE],
    500: [WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    550: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]
} as const;

export const minMax = Object.keys(Workers)
    .map(string => parseInt(string, 10))
    .reduce((range, cost) => [Math.min(range[0], cost), Math.max(range[1], cost)], [
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER
    ]);
