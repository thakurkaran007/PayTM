"use client";

export const Header = ({label}: { label: string}) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-1">
            <h6 className="text-3xl font-extrabold font">🔐 Auth</h6>
            <p className="font-extralight text-sm">{label}</p>
        </div>
    );
}