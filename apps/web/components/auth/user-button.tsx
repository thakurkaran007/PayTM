"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@repo/ui/src/components/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
// import { useRecoilState } from "recoil";
// import { currUser } from "@/recoil/atom";

const UserButton = () => {
    // const [user] = useRecoilState(currUser);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarFallback className="rounded-lg bg-sky-700">
                        <FaUser className=""/>
                    </AvatarFallback>
                    <AvatarImage src={""}/>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                        <div className="flex justify-center items-center gap-x-2 cursor-pointer" onClick={() => signOut()}>
                            <ExitIcon className="w-4 h-4 mr-2 font-extrabold"/>
                            Logout
                        </div>
                </DropdownMenuItem>                                        
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton;