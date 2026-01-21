import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This needs admin privileges
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        // Check which table has this user
        const { data: creatorProfile } = await supabaseAdmin
            .from("creator_profiles")
            .select("user_id")
            .eq("user_id", userId)
            .single();

        const { data: providerProfile } = await supabaseAdmin
            .from("providers")
            .select("claimed_by_user_id")
            .eq("claimed_by_user_id", userId)
            .single();

        const role = creatorProfile ? 'creator' : providerProfile ? 'provider' : null;

        if (!role) {
            return NextResponse.json({ error: "User not found in any profile table" }, { status: 404 });
        }

        // Update user metadata
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            {
                user_metadata: { role }
            }
        );

        if (error) throw error;

        return NextResponse.json({
            success: true,
            userId,
            role,
            message: `Successfully set role to '${role}'. Please log out and log back in.`
        });
    } catch (error) {
        console.error("Error fixing user role:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
