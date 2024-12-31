"use client";
import { useCurrentUser } from "@/hooks/user-component"
import { Button } from "@repo/ui/src/components/button";
import { signOut } from "next-auth/react";

const Setting = () => {
    const session = useCurrentUser();
    return <div className="w-px-500 h-px-500 bg-white flex items-center justify-center">
        {JSON.stringify(session)}
        <div onClick={() => signOut()}>
            <Button>Sign Out</Button>
        </div>
    </div>
}
export default Setting;