// checks spawn room for enemy units
// if (enemy units are found) enable counter measures

// counter measures:
// - get the owner of the unit if possible. (add to memory?)
// - enable safe mode if available.
// - send a notification if possible to email.
// - add attack "role:antibody" units to queue.
// -
export function checkAlarms(): void {
    if (!isAlarmAlreadyTripped()) return;
    if (!isEnemyInSpawnRoom()) return;
    tripAlarm();
    deployCounterMeasures();
}

function deployCounterMeasures() {
    sendNotificationToEmail(getOwnerOfUnit());
    enableSafeModeIfAvailable();
}

function getOwnerOfUnit(): string {
    try {
        return Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS)[0].owner
            .username;
    } catch {
        return "username-not-captured-somehow";
    }
}

function isEnemyInSpawnRoom(): boolean {
    return Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS).length > 0;
}

function enableSafeModeIfAvailable(): boolean {
    return Game.spawns.Spawn1.room.controller?.activateSafeMode() === 0;
}

function sendNotificationToEmail(enemyUsername: string): void {
    Game.notify(
        `hostile unit detected in spawn room. username: ${enemyUsername}`
    );
}

function isAlarmAlreadyTripped(): boolean {
    return Memory.alarmSounded;
}

function tripAlarm(): void {
    Memory.alarmSounded = true;
}
