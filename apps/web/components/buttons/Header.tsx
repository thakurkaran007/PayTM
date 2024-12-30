"use client";
export const Header = ({label}: { label: string}) => {
    return (
        <div className="flex flex-col items-center space-y-2">
            <h1 className="text-4xl font-semibold">🔐 Auth</h1>
            <p className="font-extralight text-sm">{label}</p>
        </div>
    );
}