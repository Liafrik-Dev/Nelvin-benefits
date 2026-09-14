import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Users,
  Award,
  Leaf
} from "lucide-react";
import UserMenu from "@/components/nelvin/UserMenu";
import NotificationBell from "@/components/nelvin/NotificationBell";
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onAway = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setMenuKey(null);
    };
    document.addEventListener("pointerdown", onAway);
    return () => document.removeEventListener("pointerdown", onAway);
  }, []);

  const menus = {
    product: { label: "Platform", items: productItems },
    resources: { label: "Resources", items: resourcesItems },
    company: { label: "Company", items: companyItems },
  };

  const toggleMenu = (key) => setMenuKey((k) => (k === key ? null : key));

  return (
    <header className="fixed top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 z-50">
      <div className="max-w-6xl mx-auto">
        <div className={`rounded-full bg-[#062B23]/95 backdrop-blur-xl text-white shadow-2xl border border-white/15 transition-all duration-300 ${scrolled ? "py-1 shadow-[#062B23]/40" : "py-1.5"}`}>
          <div className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">

            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-gradient-to-br from-[#D6B56D] to-[#E5C77A] rounded-lg flex items-center justify-center shadow-md shadow-[#D6B56D]/20 group-hover:scale-105 transition-transform">
                  <span className="text-[#062B23] font-black text-base tracking-tighter">N</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg sm:text-xl font-heading tracking-tight leading-none text-[#D6B56D]">
                    Nelvin<span className="text-ivory">.</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#D6B56D] tracking-widest uppercase hidden sm:block">
                    Perks for Everyone
                  </span>
                </div>
              </Link>
            </div>

            {/* Main Navigation Menus */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {Object.entries(menus).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => toggleMenu(key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    menuKey === key
                      ? "text-[#062B23] bg-[#D6B56D] shadow-sm"
                      : "text-ivory/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{config.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${menuKey === key ? "rotate-180" : ""}`} />
                </button>
              ))}

              {/* Portal Quick Links Pill */}
              <div className="ml-2 pl-2 border-l border-white/15 flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                <Link
                  to="/explore"
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                    location.pathname.startsWith('/explore') || location.pathname.startsWith('/dashboard')
                      ? 'bg-[#D6B56D] text-[#062B23]'
                      : 'text-ivory/80 hover:text-[#D6B56D]'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Particuliers</span>
                </Link>

                <Link
                  to="/corporate"
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                    location.pathname.startsWith('/corporate')
                      ? 'bg-[#0A3A2F] text-white'
                      : 'text-white/80 hover:text-[#D6B56D]'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>HR Team</span>
                </Link>

                <Link
                  to="/business"
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                    location.pathname.startsWith('/business')
                      ? 'bg-[#0A3A2F] text-white'
                      : 'text-white/80 hover:text-[#D6B56D]'
                  }`}
                >
                  <Store className="w-3 h-3" />
                  <span>Partner</span>
                </Link>
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Selector */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label={t('nav.language')}
                  className="flex items-center gap-1.5 text-white/90 hover:text-[#D6B56D] text-xs font-bold transition-colors px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20"
                >
                  <Globe className="w-3.5 h-3.5 text-[#D6B56D]" />
                  <span className="uppercase">{lang}</span>
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 rounded-lg border border-white/15 bg-[#062B23] text-white p-1.5 shadow-2xl z-50 backdrop-blur-xl"
                    >
                      {LANGUAGES.map((lng) => (
                        <button
                          key={lng.code}
                          onClick={() => {
                            setLang(lng.code);
                            setLangOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-white/90 hover:bg-white/10 transition-colors"
                        >
                          <span>{lng.label}</span>
                          {lang === lng.code && <Check className="h-3.5 w-3.5 text-[#D6B56D]" />}
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
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-white/90 hover:text-[#D6B56D] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#D6B56D] text-[#062B23] text-xs font-extrabold px-4 py-2 rounded-lg hover:bg-[#E5C77A] shadow-md shadow-[#062B23]/20 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get Started</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Trigger */}
              <button
                className="lg:hidden text-white p-2 rounded-xl bg-white/10 hover:bg-emerald-black/35 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Static Unanimated Dropdown Panel */}
          {menuKey && (
            <div
              ref={dropdownRef}
              className="hidden lg:block absolute left-0 right-0 top-full mt-3 bg-[#062B23] text-white rounded-xl p-6 shadow-2xl border border-white/15 z-50 backdrop-blur-xl"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {menus[menuKey].items.map((item) => {
                  const ItemIcon = item.icon || Compass;
                  return (
                    <Link
                      key={item.title}
                      to={item.to}
                      onClick={() => setMenuKey(null)}
                      className="group flex items-start gap-3 border border-white/10 hover:border-[#D6B56D]/40 bg-white/5 hover:bg-white/10 rounded-lg p-3.5 transition-all duration-150"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#D6B56D]/10 border border-[#D6B56D]/20 flex items-center justify-center shrink-0 group-hover:bg-[#D6B56D] group-hover:text-[#062B23] transition-colors">
                        <ItemIcon className="w-4 h-4 text-[#D6B56D] group-hover:text-[#F5F1E8]" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white group-hover:text-[#D6B56D] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-white/60 text-[11px] leading-tight mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 bg-[#062B23] border border-white/15 rounded-xl shadow-2xl overflow-hidden text-white p-5 space-y-5"
            >
              {/* Role Switcher Drawer Header */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#D6B56D]">Switch Portal Space</p>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    to="/explore"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#D6B56D] text-center"
                  >
                    <UserCheck className="w-4 h-4 text-[#D6B56D]" />
                    <span className="text-[11px] font-extrabold">Employee</span>
                  </Link>

                  <Link
                    to="/corporate"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#0A3A2F] text-center"
                  >
                    <Building2 className="w-4 h-4 text-[#E5C77A]" />
                    <span className="text-[11px] font-extrabold">HR Admin</span>
                  </Link>

                  <Link
                    to="/business"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#0A3A2F] text-center"
                  >
                    <Store className="w-4 h-4 text-[#E5C77A]" />
                    <span className="text-[11px] font-extrabold">Partner</span>
                  </Link>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* Mobile Links */}
              <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-1">
                {Object.entries(menus).map(([key, config]) => (
                  <div key={key} className="space-y-2">
                    <p className="text-[#D6B56D] font-extrabold text-[11px] uppercase tracking-widest">{config.label}</p>
                    <div className="grid grid-cols-1 gap-1.5">
                      {config.items.map((item) => (
                        <Link
                          key={item.title}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors"
                        >
                          <item.icon className="w-3.5 h-3.5 text-[#D6B56D]" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/10" />

              {/* Mobile Auth Actions */}
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="border border-white/20 text-white font-bold text-center rounded-full py-2 text-xs hover:bg-white/10 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="bg-[#D6B56D] text-[#062B23] font-extrabold text-center rounded-lg py-2 text-xs shadow-md shadow-[#062B23]/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}