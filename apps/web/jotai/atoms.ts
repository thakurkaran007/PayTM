import { ExtendedUser } from '@/next-auth';
import { atom } from 'jotai';

export const userSocket = atom<WebSocket | null>(null);
export const onlineUsers = atom<ExtendedUser[]>([])