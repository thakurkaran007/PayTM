import { signOut } from "next-auth/react"

const LogoutButton = ({children}: {children: React.ReactNode}) => {
    return <div onClick={() => signOut()} className="cursor-pointer">
       {children} 
    </div>
}

export default LogoutButton;