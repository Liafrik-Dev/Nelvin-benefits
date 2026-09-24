import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Menu,
  X,
  Check,
  ChevronDown,
  Sparkles,
  UserCheck,
  Building2,
  Store,
  Compass,
  Tag,
  Trophy,
  HeartHandshake,
  Wallet,
  Smartphone,
  Zap,
  Layers,
  FileText,
  MessageSquare,
  Calendar,
  Newspaper,
  MapPin,
  HelpCircle,
  Briefcase,
  Leaf,
  Search,
} from "lucide-react";
import UserMenu from "@/components/nelvin/UserMenu";
import NotificationBell from "@/components/nelvin/NotificationBell";
import { BrandLogo } from "@/components/nelvin/Brand";
import { useAuth } from "@/lib/AuthContext";
import { LANGUAGES, useLanguage } from "@/lib/i18n";

const productItems = [
  { title: "Benefits Platform", desc: "Manage & administer engaging employee benefits", to: "/benefits", icon: Compass },
  { title: "Global Discounts", desc: "Instant savings on top international brands", to: "/offers", icon: Tag },
  { title: "Reward & Recognition", desc: "Celebrate team wins and elevate company culture", to: "/corporate", icon: Trophy },
  { title: "Wellbeing Hub", desc: "Guided mental, physical & financial support", to: "/benefits", icon: HeartHandshake },
  { title: "Smart Wallet", desc: "Card-based allowances & instant cashbacks", to: "/profile", icon: Wallet },
  { title: "Mobile Experience", desc: "Anywhere, anytime benefits on mobile", to: "/", icon: Smartphone },
  { title: "AI-Powered Matching", desc: "Smart offer recommendations for members", to: "/offers", icon: Zap },
  { title: "Unified Dashboard", desc: "Connect benefits, rewards & analytics in one space", to: "/corporate", icon: Layers },
];

const resourcesItems = [
  { title: "Research & Insights", desc: "Latest research and employee engagement guides", to: "/#faq", icon: FileText },
  { title: "Customer Success", desc: "How top enterprises empower their workforces", to: "/#testimonials", icon: MessageSquare },
  { title: "Events & Webinars", desc: "Join live workshops and view on-demand sessions", to: "/#events", icon: Calendar },
  { title: "Articles & Trends", desc: "Actionable insights from Nelvin benefit specialists", to: "/#events", icon: Newspaper },
  { title: "Global Spotlights", desc: "Country-by-country benefit compliance overview", to: "/offers", icon: MapPin },
  { title: "Help & Knowledge", desc: "Guides, FAQs, and support articles", to: "/#faq", icon: HelpCircle },
];

const companyItems = [
  { title: "About Nelvin", desc: "Our story, values, and mission to empower workforces", to: "/corporate", icon: Building2 },
  { title: "Careers & Life", desc: "Join us in shaping the future of employee experience", to: "/corporate", icon: Briefcase },
  { title: "Impact & ESG", desc: "Sustainability and social responsibility commitments", to: "/corporate", icon: Leaf },
];

const portalItems = [
  { title: "Particuliers", desc: "Individual member portal", to: "/explore", icon: UserCheck },
  { title: "HR Team", desc: "Employer benefits administration", to: "/corporate", icon: Building2 },
  { title: "Partner", desc: "Merchant & business tools", to: "/business", icon: Store },
];

const MENUS = {
  product: { label: "Platform", items: productItems },
  resources: { label: "Resources", items: resourcesItems },
  company: { label: "Company", items: companyItems },
  portals: { label: "Portals", items: portalItems },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open surface when the route changes.
  useEffect(() => {
    setMenuKey(null);
    setMobileOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onAway = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setMenuKey(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuKey(null);
        setLangOpen(false);
      }
    };
    document.addEventListener("pointerdown", onAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onAway);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleMenu = (key) => setMenuKey((k) => (k === key ? null : key));

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setMenuKey(null);
    setMobileOpen(false);
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b bg-white backdrop-blur-xl transition-shadow duration-300 ${
          scrolled ? "border-[#F1F1F1] shadow-nv-header" : "border-[#F4F4F4]"
        }`}
      >
        <div className="container-nv">
          <div className="flex h-16 items-center gap-3 lg:h-20 lg:gap-6">
            {/* Brand */}
            <BrandLogo size="md" className="shrink-0" />

            {/* Primary navigation — mirrors the reference's flat link row */}
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
              {Object.entries(MENUS).map(([key, config]) => {
                const open = menuKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleMenu(key)}
                    aria-expanded={open}
                    aria-haspopup="true"
                    className={`btn-nv btn-nv-sm gap-1.5 px-3 ${
                      open ? "text-gold bg-[#F9F8F7]" : "btn-nv-ghost"
                    }`}
                  >
                    {config.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Right cluster */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              {/* Discover search — the reference leads with search in the header */}
              <form onSubmit={submitSearch} className="relative hidden xl:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ivory-dim" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Discover offers…"
                  aria-label="Discover offers"
                  className="h-9 w-44 rounded-lg border border-[#F1F1F1] bg-[#F9F8F7] pl-9 pr-3 text-xs font-medium text-ivory outline-none transition-all placeholder:text-ivory-dim focus:w-52 focus:border-gold focus:bg-white/[0.07]"
                />
              </form>

              {/* Language */}
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => { setLangOpen((v) => !v); setMenuKey(null); }}
                  aria-label={t("nav.language")}
                  aria-expanded={langOpen}
                  className="btn-nv btn-nv-sm gap-1.5 border border-[#F1F1F1] px-3 text-[#282828]/90 hover:border-[#1B4F9C]/50 hover:text-gold"
                >
                  <Globe className="h-3.5 w-3.5 text-gold" />
                  <span className="uppercase">{lang}</span>
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-50 mt-2 w-44 rounded-xl border border-[#F1F1F1] bg-[#FFFFFF] p-1.5 shadow-nv-card"
                    >
                      {LANGUAGES.map((lng) => (
                        <button
                          key={lng.code}
                          type="button"
                          onClick={() => { setLang(lng.code); setLangOpen(false); }}
                          className="flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-xs font-semibold text-[#282828]/90 transition-colors hover:bg-[#F9F8F7] hover:text-gold"
                        >
                          <span>{lng.label}</span>
                          {lang === lng.code && <Check className="h-3.5 w-3.5 text-gold" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isAuthenticated && <NotificationBell />}

              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link to="/login" className="btn-nv btn-nv-sm btn-nv-ghost hidden sm:inline-flex">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-nv btn-nv-sm btn-nv-gold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Get Started</span>
                  </Link>
                </div>
              )}

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="btn-nv btn-nv-sm btn-nv-ghost border border-[#F1F1F1] px-2.5 lg:hidden"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega panel — full-width row beneath the header */}
        <AnimatePresence>
          {menuKey && (
            <motion.div
              key={menuKey}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-full hidden border-b border-[#F1F1F1] bg-[#FFFFFF] shadow-nv-header lg:block"
            >
              <div className="container-nv py-8">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {MENUS[menuKey].items.map((item) => {
                    const ItemIcon = item.icon || Compass;
                    return (
                      <Link
                        key={item.title}
                        to={item.to}
                        onClick={() => setMenuKey(null)}
                        className="group flex items-start gap-3 rounded-xl border border-transparent p-3.5 transition-colors hover:border-[#1B4F9C]/25 hover:bg-[#F9F8F7]"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#1B4F9C]/20 bg-[#1B4F9C]/10 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                          <ItemIcon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold text-ivory transition-colors group-hover:text-gold">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-[11px] leading-snug text-ivory-dim">
                            {item.desc}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[#F1F1F1] bg-[#FFFFFF] shadow-nv-header lg:hidden"
          >
            <div className="container-nv space-y-6 py-6">
              <form onSubmit={submitSearch} className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-dim" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Discover offers…"
                  aria-label="Discover offers"
                  className="h-11 w-full rounded-lg border border-[#F1F1F1] bg-[#F9F8F7] pl-10 pr-3 text-sm font-medium text-ivory outline-none placeholder:text-ivory-dim focus:border-gold"
                />
              </form>

              <div>
                <p className="eyebrow-nv mb-3">Switch portal space</p>
                <div className="grid grid-cols-3 gap-2">
                  {portalItems.map((p) => (
                    <Link
                      key={p.title}
                      to={p.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-[#F1F1F1] bg-[#F9F8F7] p-3 text-center transition-colors hover:border-[#1B4F9C]/40"
                    >
                      <p.icon className="h-4 w-4 text-gold" />
                      <span className="text-[11px] font-bold text-ivory">{p.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rule-nv" />

              <div className="space-y-5">
                {Object.entries(MENUS)
                  .filter(([key]) => key !== "portals")
                  .map(([key, config]) => (
                    <div key={key}>
                      <p className="eyebrow-nv mb-2.5">{config.label}</p>
                      <div className="grid grid-cols-1 gap-1">
                        {config.items.map((item) => (
                          <Link
                            key={item.title}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#282828]/90 transition-colors hover:bg-[#F9F8F7] hover:text-gold"
                          >
                            <item.icon className="h-3.5 w-3.5 shrink-0 text-gold" />
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="rule-nv" />

              {/* Language on mobile */}
              <div>
                <p className="eyebrow-nv mb-2.5">{t("nav.language")}</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lng) => (
                    <button
                      key={lng.code}
                      type="button"
                      onClick={() => setLang(lng.code)}
                      className={`btn-nv btn-nv-sm border ${
                        lang === lng.code
                          ? "border-gold bg-gold text-white"
                          : "border-[#F1F1F1] text-[#282828]/85"
                      }`}
                    >
                      {lng.label}
                    </button>
                  ))}
                </div>
              </div>

              {!isAuthenticated && (
                <>
                  <div className="rule-nv" />
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-nv btn-nv-md btn-nv-outline"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="btn-nv btn-nv-md btn-nv-gold"
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}