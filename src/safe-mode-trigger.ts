// checks spawn room for enemy units
// if (enemy units are found) enable counter measures

// counter measures:
// - get the owner of the unit if possible. (add to memory?)
// - enable safe mode if available.
// - send a notification if possible to email.
// - add attack units to queue.
// -
export const checkAlarms = () => {
    if (!isAlarmAlreadyTripped()) return;
    if (!isEnemyInSpawnRoom()) return;
    tripAlarm();
    deployCounterMeasures();
};

const deployCounterMeasures = () => {
    sendNotificationToEmail(getOwnerOfUnit());
    enableSafeModeIfAvailable();
};

const getOwnerOfUnit = (): string => {
    try {
        return Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS)[0].owner.username;
    } catch {
        return "username-not-captured-somehow";
    }
};

const isEnemyInSpawnRoom = (): boolean => {
    return Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS).length > 0;
};

const enableSafeModeIfAvailable = (): boolean => {
    return Game.spawns.Spawn1.room.controller?.activateSafeMode() === 0;
};

const sendNotificationToEmail = (enemyUsername: string): void => {
    Game.notify(`hostile unit detected in spawn room. username: ${enemyUsername}`);
};

const isAlarmAlreadyTripped = () => {
    return Memory.alarmSounded;
};

const tripAlarm = () => {
    Memory.alarmSounded = true;
};
