import { onGoingCall, userType } from '@/schema';
import { atom } from 'jotai';

export const userSocket = atom<WebSocket | null>(null);
export const serverSock = atom<WebSocket | null>(null);
export const onlineUsers = atom<userType[]>([]);
export const onGoing = atom<onGoingCall | null>(null);