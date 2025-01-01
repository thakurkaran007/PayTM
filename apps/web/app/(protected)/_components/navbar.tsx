"use client";

import UserButton from "@/components/auth/user-button";
import PathButton from "@/components/button/PathButton";

const Navbar = () => {
    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600xl] shadow-sm">
            <div className="flex gap-x-2">
                <PathButton path="/settings" label="Settings" />
                <PathButton path="/admin" label="Admin" />
                <PathButton path="/user" label="User" />
            </div>  
            <UserButton/>
        </nav>  
    )
}
export default Navbar;