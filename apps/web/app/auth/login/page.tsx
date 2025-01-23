import { LoginForm } from "@/components/form/LoginForm";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const Login = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Suspense fallback={<div className="flex justify-center items-center text-white"> <BeatLoader /> </div>} >
                <LoginForm/>
            </Suspense>
        </div>
    )
}
export default Login;