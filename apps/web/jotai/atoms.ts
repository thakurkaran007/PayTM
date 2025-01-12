import { ExtendedUser } from '@/next-auth';
import { userType } from '@/schema';
import { atom } from 'jotai';

export const userSocket = atom<WebSocket | null>(null);
export const onlineUsers = atom<userType[]>([])