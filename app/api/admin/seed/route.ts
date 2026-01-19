import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { GTA_LOCATIONS } from '@/lib/constants';

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const BUSINESS_PREFIXES = ["The", "Elite", "Prime", "Luxe", "Urban", "Modern", "Classic", "Pure", "Zen", "Vitality", "Peak", "Glow", "Radiant"];
const BUSINESS_TYPES = ["Dental", "Spa", "Fitness", "Wellness", "Yoga", "Aesthetics", "Gym", "Auto Detail", "Boutique", "Cafe", "Restaurant", "Studio", "Clinic"];
const NICHES = ["Beauty", "Fitness", "Health", "Lifestyle", "Food", "Tech", "Cars", "Home"];
const EXCHANGES = ["free", "discount", "gifted"];

const PICS = {
    dental: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600",
    spa: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
    fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    car: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600",
    food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    generic: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600"
};

const LOGOS = [
    "https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=000000",
    "https://api.dicebear.com/7.x/initials/svg?seed=CD&backgroundColor=1f2937",
    "https://api.dicebear.com/7.x/initials/svg?seed=EF&backgroundColor=374151"
];

function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(request: Request) {
    if (!SERVICE_ROLE_KEY || !SUPABASE_URL) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        const providersCreated = [];

        for (let i = 0; i < 10; i++) {
            const type = pick(BUSINESS_TYPES);
            const prefix = pick(BUSINESS_PREFIXES);
            const name = `${prefix} ${type} ${randomInt(1, 99)}`;
            const email = `provider_${Date.now()}_${i}@example.com`;
            const password = "password123";

            // 1. Create Auth User
            const { data: userData, error: userError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { role: 'provider' }
            });

            if (userError) {
                console.error(`Failed to create user ${email}:`, userError);
                continue;
            }

            const userId = userData.user.id;

            // 2. Create Provider Profile
            const { data: providerData, error: providerError } = await supabase
                .from('providers')
                .insert({
                    claimed_by_user_id: userId,
                    business_name: name,
                    brand_description: `Premium ${type.toLowerCase()} experience in the GTA. Specialized in high-end services.`,
                    tagline: `Elevating your ${type.toLowerCase()} lifestyle`,
                    service_areas: [pick(GTA_LOCATIONS), pick(GTA_LOCATIONS)],
                    years_in_business: randomInt(2, 20),
                    logo_url: pick(LOGOS),
                    phone_number: "555-0100",
                    website: "https://example.com",
                    address: "123 Main St",
                    terms_accepted: true,
                    google_rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
                    google_review_count: randomInt(10, 500)
                })
                .select()
                .single();

            if (providerError) {
                console.error(`Failed to create provider for ${email}:`, providerError);
                // Cleanup user
                await supabase.auth.admin.deleteUser(userId);
                continue;
            }

            const providerId = providerData.id;
            providersCreated.push({ name, email, id: providerId });

            // 3. Create Offers
            const numOffers = randomInt(1, 3);
            for (let j = 0; j < numOffers; j++) {
                const exchange = pick(EXCHANGES);
                const category = pick(NICHES);
                let img = PICS.generic;
                if (type.includes("Dental")) img = PICS.dental;
                else if (type.includes("Spa") || type.includes("Beauty")) img = PICS.spa;
                else if (type.includes("Fitness") || type.includes("Gym")) img = PICS.fitness;
                else if (type.includes("Auto")) img = PICS.car;
                else if (type.includes("Cafe") || type.includes("Restaurant")) img = PICS.food;

                const status = Math.random() > 0.3 ? 'published' : 'draft'; // 70% published

                await supabase.from('offers').insert({
                    provider_id: providerId,
                    title: `${exchange === 'free' ? 'Complimentary' : 'Exclusive'} ${type} Session`,
                    description: "Experience our top-tier services tailored for creators. Includes full access and consultation.",
                    category: category,
                    location_area: pick(GTA_LOCATIONS), // Maps to card's 'city' via location_area usually
                    image_url: img,
                    exchange_type: exchange,
                    discount_percent: exchange === 'discount' ? randomInt(20, 50) : null,
                    status: status,
                    value: randomInt(100, 500),
                    service_type: "In-person"
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Created ${providersCreated.length} providers`,
            providers: providersCreated
        });

    } catch (err: any) {
        console.error("Seeding error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
