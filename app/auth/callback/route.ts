import { createServerClient, type CookieOptions } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const role = searchParams.get("role") as 'provider' | 'creator' | null
    const next = searchParams.get("next") ?? (role === 'provider' ? "/provider/offers" : "/creator/offers")

    console.log("📍 [AUTH CALLBACK] Role from URL:", role)
    console.log("📍 [AUTH CALLBACK] Next redirect:", next)

    if (code) {
        console.log("📍 [AUTH CALLBACK] Received code:", code?.substring(0, 20) + "...")

        const cookieStore = await cookies()

        // Manual client creation since createRouteHandlerClient is missing in this version
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )

        // 1. Exchange the code for a session
        console.log("📍 [AUTH CALLBACK] Exchanging code for session...")
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error("❌ [AUTH CALLBACK] Error exchanging code:", error.message)
            console.error("❌ [AUTH CALLBACK] Error details:", error)
        }

        if (!error && data.session) {
            console.log("✅ [AUTH CALLBACK] Session created for user:", data.user.email)
            const { session, user } = data;
            const providerToken = session.provider_token;
            const providerRefreshToken = session.provider_refresh_token;

            const provider = user.app_metadata.provider;
            const providerAccountId = user.user_metadata.provider_id || user.id;

            // Extract user info from OAuth provider
            const fullName = user.user_metadata.full_name || user.user_metadata.name;
            const avatarUrl = user.user_metadata.avatar_url || user.user_metadata.picture;

            // Determine final role: check if user already has a role in metadata
            const existingRole = user.user_metadata?.role as 'provider' | 'creator' | undefined;
            const finalRole = existingRole || role || 'creator';

            console.log("📍 [AUTH CALLBACK] Existing role:", existingRole)
            console.log("📍 [AUTH CALLBACK] Final role:", finalRole)

            // Update user metadata with role if not already set
            if (!existingRole && role) {
                await supabase.auth.updateUser({
                    data: { role: finalRole }
                });
                console.log("✅ [AUTH CALLBACK] Updated user metadata with role:", finalRole)
            }

            // 2. Persist tokens to connected_accounts
            if (provider && provider !== 'email') {
                try {
                    const { error: dbError } = await supabase
                        .from('connected_accounts')
                        .upsert({
                            user_id: user.id,
                            provider: provider,
                            provider_account_id: providerAccountId,
                            access_token: providerToken,
                            refresh_token: providerRefreshToken,
                            expires_at: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
                        }, { onConflict: 'user_id, provider' });

                    if (dbError) {
                        console.error("❌ [AUTH CALLBACK] Error upserting connected_account:", dbError)
                    } else {
                        console.log("✅ [AUTH CALLBACK] Connected account saved")
                    }
                } catch (err) {
                    console.error("❌ [AUTH CALLBACK] Failed to save tokens", err);
                }
            }

            // 3. Create/Update Profile based on role
            try {
                if (finalRole === 'provider') {
                    // Check if provider profile exists
                    const { data: providerProfile, error: providerFetchError } = await supabase
                        .from('providers')
                        .select('id, business_name, logo_url')
                        .eq('claimed_by_user_id', user.id)
                        .single();

                    if (providerFetchError && providerFetchError.code !== 'PGRST116') {
                        console.error("❌ [AUTH CALLBACK] Error fetching provider:", providerFetchError);
                    }

                    if (!providerProfile) {
                        // Create new provider profile
                        const { error: insertError } = await supabase.from('providers').insert({
                            claimed_by_user_id: user.id,
                            business_name: fullName || 'My Business',
                            email: user.email,
                            logo_url: avatarUrl,
                        });
                        if (insertError) {
                            console.error("❌ [AUTH CALLBACK] Provider insert error:", insertError);
                        } else {
                            console.log("✅ [AUTH CALLBACK] Provider profile created with name:", fullName);
                        }
                    } else {
                        // Update existing profile only for fields that are empty
                        const updates: Record<string, any> = {};
                        if (!providerProfile.business_name && fullName) {
                            updates.business_name = fullName;
                        }
                        if (!providerProfile.logo_url && avatarUrl) {
                            updates.logo_url = avatarUrl;
                        }

                        if (Object.keys(updates).length > 0) {
                            const { error: updateError } = await supabase.from('providers')
                                .update(updates)
                                .eq('claimed_by_user_id', user.id);
                            if (updateError) {
                                console.error("❌ [AUTH CALLBACK] Provider update error:", updateError);
                            } else {
                                console.log("✅ [AUTH CALLBACK] Provider profile updated:", updates);
                            }
                        } else {
                            console.log("📍 [AUTH CALLBACK] Provider profile exists, no update needed");
                        }
                    }
                } else {
                    // Creator flow (default)
                    const { data: creatorProfile, error: creatorFetchError } = await supabase
                        .from('creator_profiles')
                        .select('id, display_name, avatar_url')
                        .eq('user_id', user.id)
                        .single();

                    if (creatorFetchError && creatorFetchError.code !== 'PGRST116') {
                        console.error("❌ [AUTH CALLBACK] Error fetching creator:", creatorFetchError);
                    }

                    if (!creatorProfile) {
                        // Create new creator profile with Google data
                        const { error: insertError } = await supabase.from('creator_profiles').insert({
                            user_id: user.id,
                            email: user.email,
                            display_name: fullName,
                            avatar_url: avatarUrl,
                            status: 'pending'
                        });
                        if (insertError) {
                            console.error("❌ [AUTH CALLBACK] Creator insert error:", insertError);
                        } else {
                            console.log("✅ [AUTH CALLBACK] Creator profile created with name:", fullName, "avatar:", avatarUrl?.substring(0, 50));
                        }
                    } else {
                        // Update existing profile only for fields that are empty/null
                        const updates: Record<string, any> = {};
                        if (!creatorProfile.display_name && fullName) {
                            updates.display_name = fullName;
                        }
                        if (!creatorProfile.avatar_url && avatarUrl) {
                            updates.avatar_url = avatarUrl;
                        }

                        if (Object.keys(updates).length > 0) {
                            const { error: updateError } = await supabase.from('creator_profiles')
                                .update(updates)
                                .eq('user_id', user.id);
                            if (updateError) {
                                console.error("❌ [AUTH CALLBACK] Creator update error:", updateError);
                            } else {
                                console.log("✅ [AUTH CALLBACK] Creator profile updated:", updates);
                            }
                        } else {
                            console.log("📍 [AUTH CALLBACK] Creator profile exists with name:", creatorProfile.display_name, "- no update needed");
                        }
                    }
                }

            } catch (err) {
                console.error("❌ [AUTH CALLBACK] Profile upsert error", err);
            }

            // 4. Redirect with success flag to the correct dashboard
            const redirectPath = finalRole === 'provider' ? '/provider/offers' : '/creator/offers';
            console.log("✅ [AUTH CALLBACK] Redirecting to:", `${origin}${redirectPath}?auth=success`)
            return NextResponse.redirect(`${origin}${redirectPath}?auth=success`)
        } else {
            console.log("❌ [AUTH CALLBACK] No session created, redirecting to error page")
        }
    } else {
        console.log("❌ [AUTH CALLBACK] No code parameter received")
    }

    // return the user to an error page with instructions
    console.log("❌ [AUTH CALLBACK] Redirecting to error page")
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
