import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center min-h-[60vh] py-10">
            <SignUp path="/signup" />
        </div>
    );
}
