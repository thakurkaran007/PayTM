import { VerificationForm } from "@/components/form/VerificationForm";
import { Suspense } from "react";

const VerificationPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Suspense fallback={<div>Loading...</div>} >
                <VerificationForm/>
            </Suspense>
        </div>
    )
}
export default VerificationPage;