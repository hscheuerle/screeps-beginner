export const Roles = {
    HOMESTEAD: "homestead",
    PIONEER: "pioneer"
} as const;

export type Role = typeof Roles[keyof typeof Roles];

export const Workers = {
    300: [WORK, CARRY, CARRY, MOVE, MOVE],
    400: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
};
