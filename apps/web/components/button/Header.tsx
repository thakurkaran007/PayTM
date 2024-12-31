"use client";

import { cn } from "@repo/ui/src/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

export const Header = ({label}: { label: string}) => {
    return (
        <div className="flex flex-col items-center space-y-2">
            <h6 className={cn("text-xl font-bold", font.className)}>🔐 Auth</h6>
            <p className="font-extralight text-sm">{label}</p>
        </div>
    );4
}