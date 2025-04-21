"use client";

import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const AppBar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex justify-between items-center border-b px-4 py-2 border-b-gray-50">
      {/* Logo */}
      <img
        src="./razorpay-icon.png"
        alt="logo"
        className="h-20 w-auto object-contain"
      />

      {/* User Info */}
      {user && (
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-x-7 cursor-pointer">
            <span className="text-sm font-medium">{user.name}</span>
              <Avatar>
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => signOut()}
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default AppBar;
