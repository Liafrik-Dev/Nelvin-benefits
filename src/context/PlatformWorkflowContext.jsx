import React, { createContext, useContext, useState } from "react";

const PlatformWorkflowContext = createContext(null);

const INITIAL_OFFERS = [
  {
    id: "off-101",
    title: "20% Off Gym Membership",
    businessName: "FitGym Nation",
    businessId: "biz-1",
    category: "Wellness",
    status: "approved", // draft | pending_admin | approved | rejected | activated_by_hr
    activeCompanies: ["comp-1", "comp-2"],
    discount: "20%",
    code: "FIT2025",
    redemptionsCount: 142,
    totalSavingsGenerated: 2840,
  },
  {
    id: "off-102",
    title: "15% Off organic lunches",
    businessName: "GreenBowl Café",
    businessId: "biz-2",
    category: "Food & Dining",
    status: "approved",
    activeCompanies: ["comp-1"],
    discount: "15%",
    code: "ORGANIC15",
    redemptionsCount: 89,
    totalSavingsGenerated: 1335,
  },
];

const INITIAL_REDEMPTIONS = [
  {
    id: "red-501",
    employeeName: "Sophia Martinez",
    companyId: "comp-1",
    businessId: "biz-1",
    offerTitle: "20% Off Gym Membership",
    amount: 45,
    timestamp: new Date().toISOString(),
    status: "verified",
  },
];

export function PlatformWorkflowProvider({ children }) {
  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [redemptions, setRedemptions] = useState(INITIAL_REDEMPTIONS);
  const [currency, setCurrency] = useState({ code: "EUR", symbol: "€", rate: 1 });

  // Merchant creates offer
  const createBusinessOffer = (offerData) => {
    const newOffer = {
      ...offerData,
      id: `off-${Date.now()}`,
      status: "pending_admin",
      activeCompanies: [],
      redemptionsCount: 0,
      totalSavingsGenerated: 0,
    };
    setOffers((prev) => [newOffer, ...prev]);
    return newOffer;
  };

  // Admin approves/rejects offer
  const updateOfferStatus = (offerId, newStatus) => {
    setOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, status: newStatus } : off))
    );
  };

  // HR activates/deactivates offer for their company
  const toggleCompanyOffer = (offerId, companyId) => {
    setOffers((prev) =>
      prev.map((off) => {
        if (off.id !== offerId) return off;
        const exists = off.activeCompanies.includes(companyId);
        const activeCompanies = exists
          ? off.activeCompanies.filter((id) => id !== companyId)
          : [...off.activeCompanies, companyId];
        return { ...off, activeCompanies };
      })
    );
  };

  // Employee redeems offer
  const redeemOffer = (offerId, employeeName = "John Doe", companyId = "comp-1", amount = 30) => {
    const targetOffer = offers.find((o) => o.id === offerId);
    if (!targetOffer) return false;

    const newRedemption = {
      id: `red-${Date.now()}`,
      employeeName,
      companyId,
      businessId: targetOffer.businessId,
      offerTitle: targetOffer.title,
      amount,
      timestamp: new Date().toISOString(),
      status: "verified",
    };

    setRedemptions((prev) => [newRedemption, ...prev]);
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              redemptionsCount: o.redemptionsCount + 1,
              totalSavingsGenerated: o.totalSavingsGenerated + amount,
            }
          : o
      )
    );
    return newRedemption;
  };

  return (
    <PlatformWorkflowContext.Provider
      value={{
        offers,
        redemptions,
        currency,
        setCurrency,
        createBusinessOffer,
        updateOfferStatus,
        toggleCompanyOffer,
        redeemOffer,
      }}
    >
      {children}
    </PlatformWorkflowContext.Provider>
  );
}

export const usePlatformWorkflow = () => {
  const ctx = useContext(PlatformWorkflowContext);
  if (!ctx) {
    return {
      offers: INITIAL_OFFERS,
      redemptions: INITIAL_REDEMPTIONS,
      currency: { code: "EUR", symbol: "€", rate: 1 },
      setCurrency: () => {},
      createBusinessOffer: () => {},
      updateOfferStatus: () => {},
      toggleCompanyOffer: () => {},
      redeemOffer: () => {},
    };
  }
  return ctx;
};
