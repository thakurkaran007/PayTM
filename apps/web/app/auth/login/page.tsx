import { LoginForm } from "@/components/form/LoginForm";
import { Suspense } from "react";

const Login = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Suspense fallback={<div>Loading...</div>} >
                <LoginForm/>
            </Suspense>
        </div>
    )
}
export default Login;