"use client";

import { useCurrentUser } from "@/hooks/user-component";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/src/components/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { FaUser } from "react-icons/fa";
import LogoutButton from "./logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

const UserButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""}/>
                    <AvatarFallback className="bg-sky-500 ">
                        <FaUser className="text -white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <LogoutButton>
                        <ExitIcon className="w-4 h-4 mr-2"/>
                        Logout
                    </LogoutButton>
                </DropdownMenuItem>                                        
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton;