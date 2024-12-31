import { auth, signOut } from "@/auth"

const Setting = async () => {
    const session = await auth();
    return <div>
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