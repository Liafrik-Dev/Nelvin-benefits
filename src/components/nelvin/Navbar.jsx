import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, Check } from "lucide-react";
import UserMenu from "@/components/nelvin/UserMenu";
import NotificationBell from "@/components/nelvin/NotificationBell";
import { useAuth } from "@/lib/AuthContext";
import { LANGUAGES, useLanguage } from "@/lib/i18n";

const links = [
  { key: "nav.offers", to: "/offers" },
  { key: "nav.countries", to: "/" },
  { key: "nav.categories", to: "/" },
  { key: "nav.membership", to: "/choose-plan" },
  { key: "nav.corporate", to: "/corporate" },
  { key: "nav.forBusiness", to: "/partner" },
  { key: "nav.support", to: "/#faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t, lang, setLang } = useLanguage();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm shadow-amber-500/30"
          >
            <span className="text-white font-bold text-sm">N</span>
          </motion.div>
          <span className="text-white font-bold text-xl font-heading tracking-tight transition-colors group-hover:text-amber-400">Nelvin</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            >
              <Link to={link.to} className="relative inline-block text-white/90 hover:text-white text-xs font-medium whitespace-nowrap transition-all duration-200 group hover:-translate-y-0.5">
                {t(link.key)}
                <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLangOpen(!langOpen)}
              aria-label={t('nav.language')}
              className="flex items-center gap-1.5 text-white/90 hover:text-white text-sm transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-semibold">{lang}</span>
            </motion.button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-100 bg-white/95 backdrop-blur p-1.5 shadow-xl"
                >
                  {LANGUAGES.map((lng) => (
                    <button
                      key={lng.code}
                      onClick={() => {
                        setLang(lng.code)
                        setLangOpen(false)
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <span>{lng.label}</span>
                      {lang === lng.code && <Check className="h-3.5 w-3.5 text-amber-500" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isAuthenticated && <NotificationBell />}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <UserMenu />
          </motion.div>
        </div>

        <motion.button whileTap={{ scale: 0.9 }} className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-black/90 backdrop-blur-md px-4 overflow-hidden"
          >
            <div className="pb-6 pt-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link to={link.to} className="block text-white/90 hover:text-amber-400 hover:pl-1 py-3 border-b border-white/10 text-sm transition-all duration-200">
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4">
                <UserMenu />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}