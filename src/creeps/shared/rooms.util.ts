import { Workers, minMax } from "creeps/shared/consts";

// TODO: since some parts don't increment 50, eventually need to find highest cost unit available to create.
export const getBuild = (available: number): BodyPartConstant[] => {
    const remainder = available % 50;
    let cost = available - remainder;
    cost = Math.max(minMax[0], cost);
    cost = Math.min(minMax[1], cost);
    const body = Workers[cost as keyof typeof Workers];
    return (body as unknown) as BodyPartConstant[];
};
