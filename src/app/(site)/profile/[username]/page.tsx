"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { fetchProfile } from "@/lib/client/api";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileHistory from "./_components/ProfileHistory";
import type { UserProfile } from "@/types/database";

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile(username)
            .then((res) => setProfile(res.data))
            .catch(() => toast.error("User not found."))
            .finally(() => setLoading(false));
    }, [username]);

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-lg px-6 py-8">
                <p className="text-sm text-muted-foreground text-center">Loading...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="mx-auto w-full max-w-lg px-6 py-8">
                <p className="text-sm text-muted-foreground text-center">User not found.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-lg px-6 py-8 space-y-8">
            <ProfileHeader
                username={profile.username}
                balance={profile.balance ?? 0}
                rank={profile.rank}
                createdAt={profile.created_at!}
            />
            <ProfileHistory username={username} />
        </div>
    );
}