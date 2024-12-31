import { auth, signOut } from "@/auth"
import { useCurrentUser } from "@/hooks/user-component"

const Setting = async () => {
    const session = useCurrentUser();
    return <div className="w-px-500 h-px-500 bg-white flex items-center justify-center">
        {JSON.stringify(session)}
        <form action={async() => {
            "use server"
            await signOut();
        }}>
            <button type="submit">
                SignOut
            </button>
        </form>
    </div>
}
export default Setting;