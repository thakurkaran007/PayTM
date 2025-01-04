import { atom } from 'jotai'
export const userSocket = atom<WebSocket | null>(null);
