// MOCK DATA EXPORTS

// NAVIGATION
// NAVIGATION
export const navLinks = [
    { label: "For Creators", href: "/" },
    { label: "Explore Offers", href: "/auth/signup" },
    { label: "Login", href: "/auth/login" },
];

// CATEGORIES
export const categories = [
    { id: "cat-1", label: "Skincare" },
    { id: "cat-2", label: "Aesthetics" },
    { id: "cat-3", label: "Fitness" },
    { id: "cat-4", label: "Dental" },
    { id: "cat-5", label: "Dining" },
    { id: "cat-6", label: "Travel" },
    { id: "cat-7", label: "Automotive" },
    { id: "cat-8", label: "Lifestyle" },
];

// CREATORS (Mock Profiles)
export const creators = [
    {
        id: "c-1",
        name: "Sarah Jenkins",
        niche: "Beauty & Skincare",
        rating: 4.9,
        reviewsCount: 124,
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["UGC", "Reels", "TikTok"],
    },
    {
        id: "c-2",
        name: "David Chen",
        niche: "Tech Reviewer",
        rating: 5.0,
        reviewsCount: 89,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["Tech", "Unboxing", "YouTube"],
    },
    {
        id: "c-3",
        name: "Elara V.",
        niche: "Travel & Lifestyle",
        rating: 4.8,
        reviewsCount: 215,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["Vlog", "Photo", "Hotel"],
    },
    {
        id: "c-4",
        name: "Marcus Ruth",
        niche: "Fitness Coach",
        rating: 4.9,
        reviewsCount: 56,
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["Fitness", "Training", "Shorts"],
    },
    {
        id: "c-5",
        name: "Priya Patel",
        niche: "Foodie",
        rating: 4.7,
        reviewsCount: 310,
        avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["Recipes", "ASMR", "Taste Test"],
    },
    {
        id: "c-6",
        name: "James Wilson",
        niche: "Finance & Crypto",
        rating: 4.9,
        reviewsCount: 42,
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["Education", "Talking Head"],
    },
    {
        id: "c-7",
        name: "Chloe Moss",
        niche: "Home Decor",
        rating: 4.8,
        reviewsCount: 178,
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["DIY", "Styling", "Aesthetic"],
    },
    {
        id: "c-8",
        name: "Andre F.",
        niche: "Gaming",
        rating: 5.0,
        reviewsCount: 99,
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop",
        tags: ["Stream", "Twitch", "Clips"],
    },
];

// HERO STRIP CREATORS (Just images)
export const heroStripCreators = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&h=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&h=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&h=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=300&h=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=300&h=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=300&h=400&auto=format&fit=crop",
];

// FEATURES
export const features = [
    {
        id: "f-1",
        title: "Verified Offers",
        desc: "Access premium services from trusted providers.",
        cta: "See offers",
        icon: "ShieldCheck", // String reference to Lucide icon
    },
    {
        id: "f-2",
        title: "Real Value",
        desc: "Get free or significantly discounted services for your content.",
        cta: "Learn more",
        icon: "Zap",
    },
    {
        id: "f-3",
        title: "Direct Access",
        desc: "Connect directly with business owners. No middlemen.",
        cta: "Start chatting",
        icon: "MessageCircle",
    },
];

// LOGOS
export const logos = [
    { id: "l-1", name: "Acme Co" },
    { id: "l-2", name: "GlobalTech" },
    { id: "l-3", name: "SaaS Inc" },
    { id: "l-4", name: "FashionForward" },
    { id: "l-5", name: "EcoLife" },
    { id: "l-6", name: "NextGen" },
];

// HOW IT WORKS - CREATORS
export const steps = [
    {
        num: "01",
        title: "Connect",
        desc: "Build your profile and apply to offers that match your niche and style.",
        videoUrl: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop",
    },
    {
        num: "02",
        title: "Create",
        desc: "Receive clear deliverables and create content that works for both you and the brand.",
        videoUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop",
    },
    {
        num: "03",
        title: "Exchange",
        desc: "Get paid or receive experiences without chasing invoices or managing admin.",
        videoUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    },
];

// HOW IT WORKS - BUSINESS
export const businessSteps = [
    {
        num: "01",
        title: "Post an Offer",
        desc: "Describe what you need. Set your budget and deliverables in minutes.",
        videoUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop", // Business/Laptop
    },
    {
        num: "02",
        title: "Review Creators",
        desc: "See real profiles and portfolios. Approve only the creators who fit your brand.",
        videoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop", // Reviewing/Meeting
    },
    {
        num: "03",
        title: "Get Results",
        desc: "Receive authentic content ready to post. Track ROI directly in your dashboard.",
        videoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop", // Analytics/Growth
    },
];

// SHOWCASE
export const showcases = [
    {
        id: "s-1",
        title: "Neon Gym Access",
        subtitle: "1 Month Membership • 3 TikToks",
        imageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&h=600&auto=format&fit=crop",
    },
    {
        id: "s-2",
        title: "Luxe Facial Treatment",
        subtitle: "Full Treatment • IG Reels Series",
        imageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&h=600&auto=format&fit=crop",
    },
    {
        id: "s-3",
        title: "TechGear Review Unit",
        subtitle: "Product Keep • YouTube Segment",
        imageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&h=600&auto=format&fit=crop",
    },
];

// TESTIMONIALS
export const testimonials = [
    {
        id: "t-1",
        name: "Sarah Miller",
        role: "Lifestyle Creator",
        quote: "Connex lets me access amazing services I'd normally pay for. I just create content doing what I love, and everyone wins.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=500&auto=format&fit=crop",
    },
];

// FAQ
export const faqs = [
    {
        id: "q-1",
        q: "How does Connex work?",
        a: "Connex is an exchange platform. Businesses offer free or discounted services (like gym memberships, treatments, or dining) in exchange for your content.",
    },
    {
        id: "q-2",
        q: "Is there a cash payment?",
        a: "No. Connex is strictly for value exchange. You receive products, services, or experiences instead of a paycheck.",
    },
    {
        id: "q-3",
        q: "Do I need a huge following?",
        a: "Not necessarily. Businesses look for content quality and fit. If your style matches their brand, you can get engaged regardless of follower count.",
    },
    {
        id: "q-4",
        q: "Who is this for?",
        a: "It's for creators who want to upgrade their lifestyle, try new experiences, and build their portfolio by trading their skills for real-world value.",
    },
];
