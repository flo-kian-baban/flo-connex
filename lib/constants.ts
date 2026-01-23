export const GTA_LOCATIONS = [
    "Toronto (Downtown)",
    "Toronto (North York)",
    "Toronto (Scarborough)",
    "Toronto (Etobicoke)",
    "Richmond Hill",
    "Markham",
    "Vaughan",
    "Mississauga",
    "Brampton",
    "Oakville",
    "Burlington",
    "Pickering",
    "Ajax",
    "Whitby",
    "Oshawa",
    "Newmarket",
    "Aurora",
    "King City",
    "Stouffville",
    "Milton"
] as const;

export type GTALocation = typeof GTA_LOCATIONS[number];

export const CONTENT_TYPES = [
    "Short-form video (Reels, TikTok, Shorts)",
    "Long-form video (YouTube, podcasts, vlogs)",
    "Photo content",
    "UGC-style content",
    "Educational / explainer content",
    "Lifestyle content",
    "Voice-over / narration",
    "Live content / streaming",
    "Written content (blogs, captions, scripts)"
] as const;

export type ContentType = typeof CONTENT_TYPES[number];

export const NICHES = [
    "Adventure",
    "Aesthetics",
    "Affiliate",
    "AI",
    "Anime",
    "Architecture",
    "Art",
    "Athletics",
    "Automotive",
    "Baking",
    "Beauty",
    "Books",
    "Budgeting",
    "Business",
    "Cafe",
    "Career",
    "Cars",
    "Cinema",
    "Clean-Living",
    "Coffee",
    "Comedy",
    "Cooking",
    "Cosmetics",
    "Crafting",
    "Crypto",
    "Design",
    "Digital",
    "DIY",
    "Drawing",
    "Education",
    "Entertainment",
    "Entrepreneur",
    "Family",
    "Fashion",
    "Film",
    "Finance",
    "Fitness",
    "Food",
    "Gadgets",
    "Gaming",
    "Gardening",
    "Growth",
    "Gym",
    "Health",
    "Hiking",
    "History",
    "Hobby",
    "Home",
    "Hotel",
    "Interior",
    "Investing",
    "Jewelry",
    "Journaling",
    "Language",
    "Lifestyle",
    "Literature",
    "Luxury",
    "Makeup",
    "Manga",
    "Marketing",
    "Massage",
    "Medicine",
    "Mental Health",
    "Minimalism",
    "Modeling",
    "Motivation",
    "Music",
    "Nature",
    "Nutrition",
    "Organization",
    "Outdoor",
    "Painting",
    "Parenting",
    "Pets",
    "Photography",
    "Physics",
    "Planning",
    "Podcasting",
    "Politics",
    "Productivity",
    "Psychology",
    "Real Estate",
    "Relationships",
    "Reviews",
    "Running",
    "Science",
    "Self-Care",
    "Shopping",
    "Skincare",
    "Sneakers",
    "Soccer",
    "Software",
    "Spirituality",
    "Sports",
    "Stocks",
    "Streetwear",
    "Style",
    "Sustainability",
    "Tax",
    "Tech",
    "Theater",
    "Trading",
    "Travel",
    "UGC",
    "Venture",
    "Vlogging",
    "Web3",
    "Wellness",
    "Writing",
    "Yoga"
] as const;

export type Niche = typeof NICHES[number];

export const LANGUAGES = [
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Burmese",
    "Cantonese",
    "Catalan",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Estonian",
    "Farsi",
    "Finnish",
    "French",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Italian",
    "Japanese",
    "Kannada",
    "Kazakh",
    "Khmer",
    "Korean",
    "Lao",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay",
    "Malayalam",
    "Mandarin",
    "Marathi",
    "Mongolian",
    "Nepali",
    "Norwegian",
    "Pashto",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Serbian",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish",
    "Swahili",
    "Swedish",
    "Tagalog",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Welsh",
    "Zulu"
] as const;


export type Language = typeof LANGUAGES[number];

export const PLATFORMS = [
    "Instagram",
    "TikTok",
    "YouTube",
    "YouTube Shorts",
    "Other"
] as const;

export type Platform = typeof PLATFORMS[number];

export const CONTENT_FORMATS = [
    "Short-form video",
    "Long-form video",
    "Mixed"
] as const;

export type ContentFormat = typeof CONTENT_FORMATS[number];

export const AUDIENCE_AGES = [
    "18–24",
    "25–34",
    "35–44",
    "45+"
] as const;

export type AudienceAge = typeof AUDIENCE_AGES[number];

export const GENDER_SKEWS = [
    "Mostly Male",
    "Mostly Female",
    "Mixed"
] as const;

export type GenderSkew = typeof GENDER_SKEWS[number];

export const DELIVERY_SPEEDS = [
    "Same day",
    "1–3 days",
    "3–7 days"
] as const;

export type DeliverySpeed = typeof DELIVERY_SPEEDS[number];

export const PRODUCTION_STYLES = [
    "Raw/Authentic",
    "Polished/Cinematic",
    "Educational/Scripted"
] as const;

export type ProductionStyle = typeof PRODUCTION_STYLES[number];

export const AUDIENCE_FOCUS_OPTIONS = [
    "Mostly GTA",
    "Mostly Canada",
    "International",
    "Mixed"
] as const;;

export type AudienceFocus = typeof AUDIENCE_FOCUS_OPTIONS[number];
