"use client";
import UserButton from "@/components/auth/user-button";
import { onlineUsers } from "@/jotai/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/src/components/avatar";
import { useAtom } from "jotai";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
    const [online] = useAtom(onlineUsers);

    

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600xl] shadow-sm">
            <div className="flex items-center justify-center space-x-2">
                {
                    online.map((k) => (
                        <Avatar key={k?.user.id} className="hover: cursor-pointer">
                            <AvatarImage src={k?.user.image || ''} />
                            <AvatarFallback className='bg-sky-300 h-full w-full rounded'>
                                <FaUser />
                            </AvatarFallback>
                        </Avatar>
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
