"use client";
import { getUser } from '@/hooks/getUser';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@repo/ui/src/components/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/src/components/avatar';
import { FaUser } from 'react-icons/fa';
import { ExitIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';

const UserButton = () => {
    const user = getUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className='bg-sky-300 h-full w-full rounded'>
                        <FaUser />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <div onClick={() => signOut()} className='cursor-pointer'>
                <DropdownMenuContent className='flex space-x-4 items-center'>
                    <ExitIcon className='w-4 h-4 mr-2'/>
                    <div >Logout</div>
                </DropdownMenuContent>
            </div>
        </DropdownMenu>
    )
}
export default UserButton;