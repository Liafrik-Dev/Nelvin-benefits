// Centralised content for the premium Nelvin landing page.
// Keeps the existing visual identity (Plus Jakarta Sans &#43; brand palette) while adding rich, navigable sections.

const imgBase = "/images/benifex/cat/";

export const LANDING_CATEGORIES = [
  { name: "Food & Dining", slug: "restaurants-cafes", icon: "utensils", img: `${imgBase}food-dining.jpg`, desc: "Exclusive dining deals at top restaurants and cafés" },
  { name: "Travel & Holidays", slug: "travel-airlines", icon: "plane", img: `${imgBase}travel-holidays.jpg`, desc: "Flights, getaways and holidays at member-only rates" },
  { name: "Hotels & Hospitality", slug: "hotels-resorts", icon: "hotel", img: `${imgBase}hotels-hospitality.jpg`, desc: "Hand-picked hotels, resorts and stays worldwide" },
  { name: "Fitness & Sports", slug: "fitness-sports", icon: "dumbbell", img: `${imgBase}fitness-sports.jpg`, desc: "Gym memberships, classes and athletic gear savings" },
  { name: "Wellness & Mental Health", slug: "beauty-spa", icon: "heart-pulse", img: `${imgBase}wellness-mental.jpg`, desc: "Spa, therapy and mental wellbeing support" },
  { name: "Healthcare", slug: "healthcare", icon: "stethoscope", img: `${imgBase}healthcare.jpg`, desc: "Clinics, telemedicine, dental and optical care" },
  { name: "Financial Wellness", slug: "professional-services", icon: "wallet", img: `${imgBase}financial-wellness.jpg`, desc: "Savings, investments, insurance and money coaching" },
  { name: "Shopping & Retail", slug: "shopping-fashion", icon: "shopping-bag", img: `${imgBase}shopping-retail.jpg`, desc: "Cashback and discounts across retail and e-commerce" },
  { name: "Technology", slug: "entertainment", icon: "laptop", img: `${imgBase}technology.jpg`, desc: "Gadgets, software, streaming and mobile deals" },
  { name: "Family & Parenting", slug: "home-services", icon: "baby", img: `${imgBase}family-parenting.jpg`, desc: "Childcare, education and family-friendly offers" },
  { name: "Education & Learning", slug: "education", icon: "graduation-cap", img: `${imgBase}education-learning.jpg`, desc: "Courses, tutoring and lifelong learning benefits" },
  { name: "Home & Living", slug: "home-services", icon: "home", img: `${imgBase}home-living.jpg`, desc: "Furniture, utilities and home services savings" },
  { name: "Automotive & Mobility", slug: "automotive", icon: "car", img: `${imgBase}automotive-mobility.jpg`, desc: "Fuel, servicing, rides and vehicle benefits" },
  { name: "Beauty & Personal Care", slug: "beauty-spa", icon: "sparkles", img: `${imgBase}beauty-personal-care.jpg`, desc: "Salons, grooming and self-care indulgences" },
  { name: "Entertainment", slug: "entertainment", icon: "clapperboard", img: `${imgBase}entertainment.jpg`, desc: "Cinema, live events, gaming and streaming" },
  { name: "Pets", slug: "shopping-fashion", icon: "paw-print", img: `${imgBase}pets.jpg`, desc: "Pet food, care and accessories for furry friends" },
  { name: "Fashion", slug: "shopping-fashion", icon: "shirt", img: `${imgBase}fashion.jpg`, desc: "Designer, streetwear and everyday style savings" },
  { name: "Telecom & Digital", slug: "entertainment", icon: "smartphone", img: `${imgBase}telecom-digital.jpg`, desc: "Data plans, airtime and digital services" },
  { name: "Sustainability", slug: "home-services", icon: "leaf", img: `${imgBase}sustainability.jpg`, desc: "Ethical, eco-friendly brands making a difference" },
];

export const LANDING_EXPERIENCES = [
  {
    id: "employee",
    name: "Employee App",
    desc: "The member-facing super app for benefits, rewards, wallet and wellbeing — all in one home.",
    points: ["Browse exclusive offers", "QR / barcode redemption", "Digital wallet & cashback", "Personalised recommendations"],
    to: "/dashboard",
  },
  {
    id: "employer",
    name: "Employer / HR Portal",
    desc: "Configure benefits packages, budgets and eligibility — and real-time analytics for your workforce.",
    points: ["Benefits administration", "Budgets & eligibility rules", "Engagement analytics", "Automated renewals"],
    to: "/corporate-dashboard",
  },
  {
    id: "partner",
    name: "Partner / Merchant Portal",
    desc: "Manage offers, track redemptions and go live across Africa MENA in minutes.",
    points: ["Offer lifecycle management", "Redemption analytics", "Billing & settlements", "Campaign self-service"],
    to: "/partner",
  },
  {
    id: "admin",
    name: "Super Admin",
    desc: "The command centre for platform operators: users, compliance, payments and global config.",
    points: ["Users & companies", "Offers & categories moderation", "Payments & settlements", "Audit logs & compliance"],
    to: "/admin",
  },
];

export const LANDING_MODULES = [
  { name: "Benefits Marketplace", icon: "layout-grid", link: "/offers", desc: "Curated deals from 20,000+ brands across Africa MENA." },
  { name: "Flexible Benefits", icon: "sliders-horizontal", link: "/benefits", desc: "Let members flex their package around what matters most." },
  { name: "Rewards & Loyalty", icon: "gift", link: "/my-offers", desc: "Points, recognition and incentives that keep people engaged." },
  { name: "Wallet & Payments", icon: "wallet", link: "/profile", desc: "Multi-currency digital wallet with cards, cashback and split payments." },
  { name: "Health & Wellness", icon: "heart-pulse", link: "/benefits", desc: "Clinics, telemedicine, EAP and wellbeing programmes." },
  { name: "Financial Wellness", icon: "piggy-bank", link: "/benefits", desc: "Savings, insurance and money coaching for peace of mind." },
  { name: "Family & Life", icon: "baby", link: "/offers", desc: "Benefits that extend to dependants and everyday family life." },
  { name: "Travel & Lifestyle", icon: "plane", link: "/travel-airlines", desc: "Flights, hotels and lifestyle perks for living well." },
  { name: "HR & Employer", icon: "briefcase", link: "/corporate", desc: "Administration, budgets, eligibility and analytics for HR teams." },
  { name: "Partner & Merchant", icon: "store", link: "/partner", desc: "Self-serve tools to publish offers and track redemptions." },
  { name: "AI Intelligence", icon: "brain-circuit", link: "/offers", desc: "Personalised recommendations and predictive engagement." },
  { name: "Developer /API", icon: "code-2", link: "/partner", desc: "REST APIs, webhooks and integrations to embed Nelvin." },
  { name: "Security & Compliance", icon: "shield-check", link: "/corporate", desc: "ISO-grade security, encryption and SOC2-style controls." },
  { name: "Analytics & Reporting", icon: "bar-chart-3", link: "/dashboard", desc: "Real-time dashboards on engagement, spend and ROI." },
  { name: "Notifications", icon: "bell-ring", link: "/dashboard", desc: "Smart push, email and in-app alerts that drive action." },
  { name: "Support", icon: "headset", link: "/#faq", desc: "Fast human support, 24/7, in every market." },
  { name: "CMS", icon: "file-pen", link: "/corporate", desc: "Reusable content blocks for offers, pages and campaigns." },
  { name: "Localization", icon: "languages", link: "/offers", desc: "Languages, currencies and local formats across all markets." },
  { name: "White Label", icon: "gem", link: "/corporate", desc: "Launch under your own brand with full theming." },
  { name: "Subscriptions", icon: "credit-card", link: "/choose-plan", desc: "Plans, billing cycles and member lifecycle management." },
];

export const LANDING_AFRICA_POINTS = [
  { icon: "map-pin", title: "Local benefits", desc: "Offers tuned to each market's culture, tastes and lifestyle." },
  { icon: "globe", title: "Multi-country", desc: "One platform, 54 African countries+MENA — deploy instantly." },
  { icon: "coins", title: "Multi-currency", desc: "Prices, wallets and payouts in local currencies, automatically." },
  { icon: "smartphone", title: "Local payments", desc: "Mobile money, cards and bank transfers — payment methods people actually use." },
  { icon: "store", title: "Local merchants", desc: "Thousands of vetted local businesses across every region." },
  { icon: "languages", title: "Languages", desc: "Localised experiences in 40+ languages and dialects." },
  { icon: "clock", title: "24/7 support", desc: "Round-the-clock human support in local time zones." },
];

export const LANDING_AUDIENCES = [
  {
    title: "Benefits for Employees",
    kicker: "Members",
    desc: "Everything your people need to feel valued: exclusive deals, flexible benefits, rewards, wallet and wellbeing toolkit.",
    points: ["Exclusive member deals", "Flexible benefits pot", "Rewards & cashback", "Digital wallet & payments"],
    to: "/dashboard",
    cta: "Explore member app",
    img: "https://images.unsplash.com/photo-1521737711867-e3b97325c3e4?w=900&q=80",
  },
  {
    title: "Benefits for Employers",
    kicker: "Organisations",
    desc: "One home for admin, budgets, eligibility and analytics — so HR focusses on people, not spreadsheets.",
    points: ["Effortless administration", "Budgets & eligibility", "Engagement analytics", "Local & global roll-out"],
    to: "/corporate",
    cta: "Talk to sales",
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80",
  },
  {
    title: "Benefits for Partners",
    kicker: "Merchants",
    desc: "Reach millions of engaged members with powerful self-serve tools, analytics and settlement engine.",
    points: ["Publish offers in minutes", "Reach engaged members", "Redemption analytics", "Fast settlements"],
    to: "/partner",
    cta: "Become a partner",
    img: "https://images.unsplash.com/photo-1556742049-0f2e2a2f2a?w=900&q=80",
  },
];

export const LANDING_HOWITWORKS = [
  { num: "01", title: "Sign up & pick a plan", desc: "Create an account for free and choose the plan that fits your team or lifestyle.", icon: "user-plus" },
  { num: "02", title: "Invite your people", desc: "Add members with a few clicks — we handle onboarding, cards and invites.", icon: "users" },
  { num: "03", title: "Configure benefits", desc: "Set budgets, perks and eligibility from a rich catalogue, or build custom packs.", icon: "sliders-horizontal" },
  { num: "04", title: "Go live & grow", desc: "Members redeem anywhere; you track engagement and ROI in real time.", icon: "rocket" },
];

export const LANDING_STATS = [
  { value: "500K+", label: "Exclusive offers" },
  { value: "54", label: "African countries" },
  { value: "20K+", label: "Partner brands" },
  { value: "4.8/5", label: "Average member rating" },
];
