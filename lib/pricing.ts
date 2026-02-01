// Pricing plans - all monetary values in cents (per project standards)

export const PRICING_PLANS = [
  {
    id: "starter",
    oneTimeCents: 9900, // €99
    monthlyCents: 900, // €9/mo
    popular: false,
    featureKeys: [
      "nfcPlaque",
      "customLanding",
      "basicAnalytics",
      "emailSupport",
      "englishGreek",
    ],
  },
  {
    id: "pro",
    oneTimeCents: 24900, // €249
    monthlyCents: 1900, // €19/mo
    popular: true,
    featureKeys: [
      "smartPlaques5",
      "landingPages5",
      "advancedAnalytics",
      "prioritySupport",
      "multiLanguage",
      "abTesting",
      "customBranding",
    ],
  },
  {
    id: "business",
    oneTimeCents: 49900, // €499
    monthlyCents: 3900, // €39/mo
    popular: false,
    featureKeys: [
      "smartPlaques20",
      "unlimitedLandingPages",
      "fullAnalyticsSuite",
      "dedicatedAccountManager",
      "apiAccess",
      "teamCollaboration",
      "whiteLabel",
      "onboardingWorkshop",
    ],
  },
] as const;

export type PlanId = (typeof PRICING_PLANS)[number]["id"];
