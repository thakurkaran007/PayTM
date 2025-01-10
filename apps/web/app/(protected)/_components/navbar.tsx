"use client";
import UserButton from "@/components/auth/user-button";
import { FaVideo } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600xl] shadow-sm">
            <div className="flex items-center justify-center space-x-1">
                <FaVideo className="text-3xl text-accent" />
                <div>VideoCall</div>
            </div>
            <div>   
                <UserButton />
            </div>
        </nav>
    );
};

export default Navbar;
