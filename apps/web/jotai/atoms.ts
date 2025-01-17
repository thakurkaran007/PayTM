import { participants, userType } from '@/schema';
import { atom } from 'jotai';

export const userSocket = atom<WebSocket | null>(null);
export const otherSocket = atom<WebSocket | null>(null);
export const onlineUsers = atom<userType[]>([]);
export const ring = atom<boolean>(false);
export const onGoing = atom<participants | null>(null);
export const incomingcall = atom<participants | null>(null);
export const localstream = atom<MediaStream | null>(null);
export const remotestream = atom<MediaStream | null>(null);
export const peerAtom =  atom<RTCPeerConnection | null>(null)
export const onCall = atom<boolean>(false);