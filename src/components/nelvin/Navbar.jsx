import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, Check, ChevronDown } from "lucide-react";
import UserMenu from "@/components/nelvin/UserMenu";
import NotificationBell from "@/components/nelvin/NotificationBell";
import { useAuth } from "@/lib/AuthContext";
import { LANGUAGES, useLanguage } from "@/lib/i18n";

const productItems = [
  { title: "Benefits", desc: "Run, manage and administer engaging employee benefits", to: "/benefits", img: "/images/benifex/benefits-page-your-benefits.png" },
  { title: "Discounts", desc: "Global savings on global brands to instantly increase the value of post payroll spend", to: "/offers", img: "/images/benifex/Discounts.png" },
  { title: "Reward & Recognition", desc: "Shine a light on all the incredible things happening across your organisation", to: "/corporate", img: "/images/benifex/recognition-page-prove-the-impact.png" },
  { title: "Wellbeing", desc: "Enhanced wellbeing with customised and guided support for every employee", to: "/benefits", img: "/images/benifex/benefits-page-your-benefits.png" },
  { title: "Wallet", desc: "Give every member exactly what they want from their benefits with card-based allowances", to: "/profile", img: "/images/benifex/Discounts.png" },
  { title: "Mobile", desc: "Anywhere, anytime rewards and benefits for all your people", to: "/", img: "/images/benifex/Recognition2.png" },
  { title: "AI-powered Benefits", desc: "Transformative, AI-driven technology to unlock the next generation of engagement", to: "/offers", img: "/images/benifex/Recognition2.png" },
  { title: "Platform overview", desc: "Connect all your benefits, wellbeing, reward,and recognition in one home", to: "/offers", img: "/images/benifex/8.png" },
];

const resourcesItems = [
  { title: "Free downloads", desc: "Get the latest research, thought leadership,and practical advice", to: "/#faq" },
  { title: "Customer stories", desc: "See what we've helped our members achieve", to: "/#testimonials" },
  { title: "Events and webinars", desc: "Check out our upcoming events and on-demand webinars", to: "/#events" },
  { title: "Articles and news", desc: "Latest trends, ideas and actionable insights from Nelvin", to: "/#events" },
  { title: "Country spotlights", desc: "An overview of the benefits landscape in key countries", to: "/offers" },
  { title: "All Nelvin resources", desc: "Insights, ideas and guides from the Nelvin team", to: "/#faq" },
];

const careersItems = [
  { title: "Nelvin careers", desc: "Join our mission to create exceptional employee experiences", to: "/corporate" },
  { title: "Life at Nelvin", desc: "Explore our culture, employee stories,and more", to: "/corporate" },
  { title: "Open roles", desc: "See our open roles and apply today", to: "/corporate" },
];

const companyItems = [
  { title: "About Nelvin", desc: "Find out more about Nelvin, our values,and mission", to: "/corporate" },
  { title: "Customer stories", desc: "What's it like to work with Nelvin?", to: "/#testimonials" },
  { title: "Awards", desc: "Recognition for excellence in delivering exceptional experiences", to: "/#awards" },
  { title: "Sustainability & Impact", desc: "Our commitment to making a difference", to: "/corporate" },
  { title: "Get in touch", desc: "Contact us for enquiries, partnerships, or to say hello", to: "/#faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const isHome = window.location.pathname === "/";
  const { isAuthenticated } = useAuth();
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
    product: productItems,
    resources: resourcesItems,
    careers: careersItems,
    company: companyItems,
  };

  const toggleMenu = (key) => setMenuKey((k) => (k === key ? null : key));

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50"
    >
      <div className="max-w-5xl mx-auto">
        <div className="rounded-full bg-[#082F24] text-white shadow-lg shadow-[#180126]/20 transition-all duration-300">
          <div className="h-16 px-4 sm:px-6 flex items-center gap-1 sm:gap-2">
            <Link to="/" className="flex items-center gap-2 mr-2 sm:mr-4">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="w-8 h-8 bg-[#B8FF00] rounded-xl flex items-center justify-center"
              >
                <span className="text-[#082F24] font-extrabold text-sm">N</span>
              </motion.div>
              <span className="font-bold text-lg font-heading tracking-tight hidden sm:block">Nelvin</span>
            </Link>

            <nav className="hidden lg:flex items-center">
              {Object.keys(menus).map((key) => (
                <button
                  key={key}
                  onClick={() => toggleMenu(key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-colors hover:text-[#B8FF00] ${
                    menuKey === key ? "text-[#B8FF00]" : "text-white/90"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuKey === key ? "rotate-180" : ""}`} />
                </button>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  aria-label={t('nav.language')}
                  className="flex items-center gap-1.5 text-white/90 hover:text-[#B8FF00] text-sm font-semibold transition-colors px-2 py-2"
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{lang}</span>
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 rounded-2xl border border-gray-100 bg-white text-slate-700 p-1.5 shadow-xl"
                    >
                      {LANGUAGES.map((lng) => (
                        <button
                          key={lng.code}
                          onClick={() => {
                            setLang(lng.code);
                            setLangOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-sm text-slate-700 hover:bg-gray-50 transition-colors"
                        >
                          <span>{lng.label}</span>
                          {lang === lng.code && <Check className="h-3.5 w-3.5 text-[#00BD00]" />}
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
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-white/90 hover:text-[#B8FF00] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[#00BD00] hover:bg-[#8DF01F] text-white text-sm font-bold px-4.5 py-2.5 rounded-full transition-colors"
                  >
                    Create account
                  </Link>
                </div>
              )}

              <motion.button whileTap={{ scale: 0.9 }} className="lg:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {menuKey && (
            <div ref={dropdownRef} className="hidden lg:block px-6 pb-6 rounded-b-[38px] bg-[#082F24]">
              <div className="border-t border-white/10 pt-5">
                {menuKey === "resources" ? (
                  <div className="grid grid-cols-3 gap-3">
                    {menus[menuKey].map((item) => (
                      <Link
                        key={item.title}
                        to={item.to}
                        onClick={() => setMenuKey(null)}
                        className="group border-2 border-[#F7F3ED]/20 hover:border-[#00BD00] rounded-3xl p-4 transition-colors"
                      >
                        <h4 className="font-bold mb-1 text-white group-hover:text-[#B8FF00] transition-colors">{item.title}</h4>
                        <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {menus[menuKey].map((item, i) => (
                      <Link
                        key={item.title}
                        to={item.to}
                        onClick={() => setMenuKey(null)}
                        className={`group rounded-3xl overflow-hidden border-2 border-[#F7F3ED]/20 hover:border-[#00BD00] transition-colors flex flex-col ${
                          menuKey === "product" && i === 4 ? "col-span-2" : ""
                        }`}
                      >
                        <div className="h-28 overflow-hidden">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold mb-1 text-white group-hover:text-[#B8FF00] transition-colors">{item.title}</h4>
                          <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 bg-[#082F24] rounded-3xl shadow-xl overflow-hidden text-white"
            >
              <div className="p-5 max-h-[70vh] overflow-y-auto">
                {Object.entries(menus).map(([key, items]) => (
                  <div key={key} className="mb-4">
                    <p className="text-[#B8FF00] font-bold text-xs uppercase tracking-widest mb-2">{key}</p>
                    {items.map((item) => (
                      <Link
                        key={item.title}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 border-b border-white/10 text-sm font-medium text-white/80 hover:text-[#B8FF00] transition-colors"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="flex flex-col gap-2 mt-5">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="border-2 border-white/30 text-white font-bold text-center rounded-full py-2.5 text-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="bg-[#00BD00] text-white font-bold text-center rounded-full py-2.5 text-sm"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}