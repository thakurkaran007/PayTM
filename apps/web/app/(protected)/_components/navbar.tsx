"use client";
import UserButton from "@/components/auth/user-button";
import { getUser } from "@/hooks/getUser";
import { onGoing, onlineUsers, userSocket } from "@/jotai/atoms";
import { participants, userType } from "@/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/src/components/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { FaUser, FaVideo } from "react-icons/fa";

const Navbar = () => {
    const [online] = useAtom(onlineUsers);
    const [socket, setSocket] = useAtom(userSocket);
    const currUser = getUser();
    const [onGoingCall, setOnGoingCall] = useAtom(onGoing);

    const handleCall = useCallback((user: userType) => {
        if (!socket || !currUser) {
            console.log("Socket is not there");
            return;
        }
        const participants: participants = { caller: { ...currUser }, reciever: { ...user.user } };
        setOnGoingCall({ participants: participants, isRinging: false });
        socket.send(JSON.stringify({ type: 'call', participants }));
        console.log("calling");
      }, [socket, currUser, onGoingCall, online]);

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600xl] shadow-sm">
            <div className="flex items-center justify-center space-x-2">
                {
                    online.map((k, i) => (
                        <DropdownMenu key={i}>
                            <DropdownMenuTrigger>
                            <Avatar className="hover: cursor-pointer">
                                <AvatarImage src={k?.user.image || ''} />
                                <AvatarFallback className='bg-sky-300 h-full w-full rounded'>
                                    <FaUser />
                                </AvatarFallback>
                            </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex items-center justify-center space-x-0 hover: cursor-pointer" onClick={() => handleCall(k)}>
                                <FaVideo className="h-6 w-6 mr-2 text-green-300"/>
                                <div className="mr-2">Facetime</div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ))
                }
            </div>
            <div>   
                <UserButton />
            </div>
        </nav>
    );
};

export default Navbar;
;