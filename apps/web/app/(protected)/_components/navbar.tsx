"use client";

import { onlineUsers, userSocket } from "@/jotai/atoms";
import { useAtom } from "jotai";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { FaUser } from "react-icons/fa";
import { Button } from "@repo/ui/src/components/button";
import { signOut } from "next-auth/react";
import { getUser } from "@/hooks/getUser";
import { useEffect } from "react";

const Navbar = () => {
    const user = getUser();
    const[socket] = useAtom(userSocket);
    const [users, setUsers] = useAtom(onlineUsers);

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600xl] shadow-sm">
            <div className="flex gap-x-2">
                {users.length > 0 &&
                    users.map((user) => (
                        <Avatar key={user.id}>
                            <AvatarFallback className="rounded bg-sky-500">
                                <FaUser />
                            </AvatarFallback>
                            <AvatarImage src={user.image || ""} />
                        </Avatar>
                    ))}
            </div>
            <div>
                <Button variant="default" onClick={() => signOut()}>
                    SignOut
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;
