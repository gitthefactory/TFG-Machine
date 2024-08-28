// socketEvents.ts
export const SOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    USER_UPDATED: 'userUpdated',
    GAME_UPDATED: 'gameUpdated',
    OPERATOR_UPDATED: 'operatorUpdated',
    ROOM_UPDATED: 'roomUpdated',
    MACHINE_UPDATED: 'machineUpdated',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
