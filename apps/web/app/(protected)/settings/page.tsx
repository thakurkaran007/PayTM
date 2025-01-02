"use client";
import { useCurrentUser } from "@/hooks/user-component"

const Setting = () => {
    const session = useCurrentUser();
    return <div className="w-px-500 h-px-500 bg-white flex items-center justify-center">
        {JSON.stringify(session)}
    </div>
}
export default Setting;