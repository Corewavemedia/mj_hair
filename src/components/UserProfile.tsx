import { Link } from "react-router-dom";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useUser, SignedIn } from "@clerk/clerk-react";

export default function UserProfile() {
    const { user: clerkUser } = useUser();
    const user = useQuery(api.users.currentUser);
    const storeUser = useMutation(api.users.store);

    const { isAuthenticated } = useConvexAuth();

    useEffect(() => {
        if (isAuthenticated && clerkUser) {
            storeUser().catch(console.error);
        }
    }, [isAuthenticated, clerkUser, storeUser]);

    return (
        <SignedIn>
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition group">
                {/* User Image */}
                <div className="relative">
                    <img
                        src={user?.pictureUrl || clerkUser?.imageUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border-2 border-white/30 object-cover shadow-sm group-hover:border-white transition"
                    />
                </div>

                {/* Username */}
                {(user?.name || clerkUser?.fullName) && (
                    <span className="text-white text-sm font-bold font-['Comfortaa'] hidden xl:block">
                        Hi, {(user?.name || clerkUser?.fullName)?.split(' ')[0]}
                    </span>
                )}
            </Link>
        </SignedIn>
    );
}
