import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";

const linkRoutes = { Partners: "/partner" };
const mailtoLinks = { Contact: "mailto:Nelvin23@proton.me", "Contact Us": "mailto:Nelvin23@proton.me" };

const labelKeyMap = {
  About: "footer.about", Careers: "footer.careers", Partners: "footer.partners", Affiliates: "footer.affiliates", Investors: "footer.investors", News: "footer.news", Blog: "footer.blog", Contact: "footer.contact",
  "Browse Offers": "footer.browse", Countries: "footer.countries", Cities: "footer.cities", Categories: "footer.categories", "Premium Brands": "footer.brands", Events: "footer.events",
  Free: "footer.free", Premium: "footer.premium", VIP: "footer.vip", Family: "footer.family", Corporate: "footer.corporate", Enterprise: "footer.enterprise", Student: "footer.student",
  "Help Center": "footer.help", FAQs: "footer.faqs", "Live Chat": "footer.livechat", "Contact Us": "footer.contactus", "Merchant Portal": "footer.merchant", Accessibility: "footer.accessibility",
  "Privacy Policy": "footer.privacy", "Terms of Service": "footer.terms", "Refund Policy": "footer.refund", "Cookie Policy": "footer.cookie",
};

const footerLinks = {
  COMPANY: ["About", "Careers", "Partners", "Affiliates", "Investors", "News", "Blog", "Contact"],
  DISCOVER: ["Browse Offers", "Countries", "Cities", "Categories", "Premium Brands", "Events"],
  MEMBERSHIP: ["Free", "Premium", "VIP", "Family", "Corporate", "Enterprise", "Student"],
  SUPPORT: ["Help Center", "FAQs", "Live Chat", "Contact Us", "Merchant Portal", "Accessibility"],
  LEGAL: ["Privacy Policy", "Terms of Service", "Refund Policy", "Cookie Policy"],
};

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#1a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-xl font-heading">Nelvin</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-6">
              Africa's savings super app. Unlock exclusive offers, cashback, and premium experiences across all 54 countries.
            </p>
            <div className="flex flex-col gap-2">
              <button className="bg-white/10 hover:bg-white/15 text-white rounded-lg px-3 py-2 flex items-center gap-2 text-xs transition-colors w-fit">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                {t('footer.appstore')}
              </button>
              <button className="bg-white/10 hover:bg-white/15 text-white rounded-lg px-3 py-2 flex items-center gap-2 text-xs transition-colors w-fit">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
                {t('footer.googleplay')}
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([titleKey, links]) => (
            <div key={titleKey}>
              <h4 className="font-bold text-xs tracking-wider uppercase mb-4 text-white/80">{t(titleKey)}</h4>
              <ul className="space-y-2.5">
                {links.map(label => (
                  <li key={label}>
                    {linkRoutes[label] ? (
                      <Link to={linkRoutes[label]} className="text-white/50 hover:text-white text-xs transition-colors">{t(labelKeyMap[label] || label)}</Link>
                    ) : mailtoLinks[label] ? (
                      <a href={mailtoLinks[label]} className="text-white/50 hover:text-white text-xs transition-colors">{t(labelKeyMap[label] || label)}</a>
                    ) : (
                      <a href="#" className="text-white/50 hover:text-white text-xs transition-colors">{t(labelKeyMap[label] || label)}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">{t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            {["Instagram", "Facebook", "X", "LinkedIn", "YouTube", "TikTok"].map(social => (
              <a key={social} href="#" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <span className="text-white/60 text-xs font-bold">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}