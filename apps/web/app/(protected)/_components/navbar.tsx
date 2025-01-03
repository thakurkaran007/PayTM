"use client";

import UserButton from "@/components/auth/user-button";

const Navbar = () => {
    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600xl] shadow-sm">
            <div className="flex gap-x-2">

            </div>  
            <UserButton/>
        </nav>  
    )
}
export default Navbar;