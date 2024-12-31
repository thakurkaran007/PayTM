import { VerificationForm } from "@/components/form/VerificationForm";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const VerificationPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Suspense fallback={<div className="flex justify-center items-center">
                <BeatLoader />
            </div>} >
                <VerificationForm/>
            </Suspense>
        </div>
    )
}
export default VerificationPage;