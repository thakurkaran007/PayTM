"use client";

export const Header = ({label}: { label: string}) => {
    return (
        <div className="flex flex-col items-center space-y-2">
            <h6 className="text-2xl font-semibold">🔐 Auth</h6>
            <p className="font-extralight text-sm">{label}</p>
        </div>
    );
}