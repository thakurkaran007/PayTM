import { atom } from 'recoil';

export const scoket = atom<WebSocket | null>({
    key: "socket",
    default: null
});