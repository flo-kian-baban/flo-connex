import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Check creator profile
        const { data: creatorProfile } = await supabase
            .from("creator_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

        // Check provider profile
        const { data: providerProfile } = await supabase
            .from("providers")
            .select("*")
            .eq("claimed_by_user_id", user.id)
            .single();

        return NextResponse.json({
            userId: user.id,
            email: user.email,
            userMetadata: user.user_metadata,
            appMetadata: user.app_metadata,
            creatorProfile,
            providerProfile,
            detectedRole: creatorProfile ? 'creator' : providerProfile ? 'provider' : 'none'
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
