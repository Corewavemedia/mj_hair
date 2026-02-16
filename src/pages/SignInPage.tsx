import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center min-h-[60vh] py-10">
            <SignIn path="/login" />
        </div>
    );
}
