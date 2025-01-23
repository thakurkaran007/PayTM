"use client";

import { Button } from "@repo/ui/src/components/button";
import { signOut } from "next-auth/react";


const AppBar = () => {
    return <div className="flex justify-between border-b px-4">
        <div className="flex flex-col justify-center text-lg">
            PayTM
        </div>
        <div className="flex flex-col justify-center pt-2">
            <Button variant={"secondary"} onClick={() => signOut()}>Logout</Button>
        </div>
    </div>
}
export default AppBar;