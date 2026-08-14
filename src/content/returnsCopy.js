/**
 * 17TRACK Returns landing copy — source:
 * https://www.17track.com/en/products/returns
 */

export const HERO = {
  titleLine1: "Turn every return",
  titleLine2: "into a growth opportunity",
  lead: "AI-powered 24/7 returns automation that recovers revenue and fuels growth.",
  trial: "Free Trial",
  demo: "Book a Demo",
  trialHref:
    "https://www.17returns.com?utm_source=www.17track.com&utm_medium=products&utm_campaign=button",
  demoHref: "https://www.17track.com/en/contact-us",
};

/** Stats 四象限板块标题（对齐官方 EN 落地页语气） */
export const STATS_HEAD = {
  titleBefore: "Impact that compounds with every ",
  titleAccent: "return",
  /* \u00A0 粘住末两词，杜绝 lone orphan 行 */
  lead: "Recover more revenue, cut reverse logistics cost, automate 24/7, and free your support\u00A0team.",
};

export const STATS = [
  {
    value: "20%+",
    label: "Recover Revenue",
    kind: "spark",
    hint: "Increasing",
    tag: "Monthly",
  },
  {
    value: "18%+",
    label: "Reduce Reverse Logistics Costs",
    kind: "big",
    hint: "Lower shipping cost day by day",
    tag: "Live",
  },
  {
    value: "7×24h",
    label: "Automated Processing",
    kind: "wide",
    kicker: "Always on",
    points: ["AI rules", "Auto labels", "Refunds"],
  },
  {
    value: "80%",
    label: "Support Workload",
    kind: "meter",
    hint: "Tickets automated",
    fill: 80,
  },
];

export const BRANDS = {
  title: "Trusted by over 100,000 brands across various industries worldwide",
  subtitle: "Returns automation for DTC, cross-border, and Shopify merchants.",
};

export const ROI = {
  titleBefore: "How Much Revenue Can",
  titleAfter: "Recover?",
  brand: "17RETURNS",
  lossLabel: "Average Monthly Return Loss",
  recoveryLabel: "Estimated Recovery",
  monthlyRecoverLabel: "Recoverable Revenue per Month",
  ordersLabel: "Monthly Orders",
  aovLabel: "Average Order Value (AOV)",
  rateLabel: "Return Rate",
  tip1: "*Total Return Loss=(Orders×Return Rate)×(Refunds+Shipping+Labor+Chargeback Risk+Traffic Loss)",
  tip2: "*Based on a 20.15% average recovery rate and industry reverse logistics costs. Actual results may vary",
  demo: "Book a Demo",
  recoveryRate: 0.2015,
  defaultOrders: 10000,
  defaultAov: 100,
  defaultRate: 10,
  costFactor: 1.84,
  ordersMin: 500,
  ordersMax: 50000,
  ordersStep: 100,
  aovMin: 10,
  aovMax: 500,
  aovStep: 1,
  rateMin: 1,
  rateMax: 40,
  rateStep: 0.5,
};

export const FEATURES = [
  {
    title: "Branded Self-Service Returns Portal",
    summary: "Make returns part of your brand experience.",
    body: "Let customers start returns, exchanges, and track progress on their own, reducing support workload and improving satisfaction.",
    bullets: [
      "Customize branding, visuals and messaging",
      "Auto-translate into multiple languages",
      "Real-time refund & tracking updates with 9 automated milestones",
    ],
    cta: "Free Trial",
    badge: "3.5x",
    badgeLabel: "Customer LTV",
    reverse: false,
    badgeInArt: true,
  },
  {
    title: "AI Workflows for 24/7 Returns Automation",
    summary: "Describe return policies in plain language. AI builds the workflow automatically.",
    body: null,
    bullets: [
      "9 triggers × 8 actions for complex return scenarios",
      "AI answers return questions based on your policies",
      "Filter pending returns by status, reason, channel, and more",
    ],
    cta: "Free Trial",
    badge: "-80%",
    badgeLabel: "Support Workload",
    reverse: true,
    badgeInArt: true,
  },
  {
    title: "Multiple Ways to Recover Revenue",
    summary: "Turn returns into retention opportunities with credits, exchanges, and smart incentives.",
    body: null,
    bullets: [
      "Prevent refunds with compensation, credits, or exchange offers",
      "Drive retention after refunds with store credits",
      "Revenue Recovery Dashboard with real-time return metrics",
    ],
    cta: "Free Trial",
    badge: "20%+",
    badgeLabel: "Revenue Recovery Rate",
    reverse: false,
  },
  {
    title: "Multi-Carrier Rate Comparison",
    summary: "Automatically choose the best return shipping option while reducing reverse logistics costs.",
    body: null,
    bullets: [
      "Compare carrier rates in real time and recommend the best option",
      "Supports USPS, DHL, UPS, FedEx and more",
      "Multiple return addresses with automatic label generation",
    ],
    cta: "Free Trial",
    badge: "18%+",
    badgeLabel: "Reduce Return Shipping Costs",
    reverse: true,
    /** badge is rendered inside DomStageCarriers art */
    badgeInArt: true,
  },
];

export const PLANS = {
  title: "Returns Solutions for Every DTC Growth Stage",
  trial: "Free Trial",
  demo: "Book a Demo",
  subscribe: "Subscribe",
  recommended: "★ RECOMMENDED",
  items: [
    {
      name: "Basic",
      subtitle:
        "Built for returnless refunds and basic after-sales automation — cut product return shipping costs",
      price: null,
      priceUnit: null,
      quota: null,
      solve: "Challenges We Solve",
      problems: [
        "High cost of shipping returns back",
        "Manual handling of simple refund cases",
        "No self-serve options for shoppers",
      ],
      rightsTitle: "Key Capabilities",
      capabilities: [
        "Returnless refund (green return)",
        "Cancel unfulfilled orders",
        "Basic workflows",
        "Rule configuration & process automation",
        "AI Rule Builder",
        "AI multi-language localization",
      ],
      recommended: false,
    },
    {
      name: "Pro",
      subtitle: "Reduce return costs and build a branded returns experience",
      price: null,
      priceUnit: null,
      quota: null,
      solve: "Challenges We Solve",
      problems: [
        "Inefficient return processing",
        "Unclear reverse logistics costs",
        "Poor returns experience",
      ],
      rightsTitle: "Key Capabilities",
      capabilities: [
        "AI-Powered Workflows, Built from Natural Language",
        "Branded Returns Portal",
        "Automated Store Credits & Return Fees",
        "Compare rates in real time and choose the best carrier automatically.",
      ],
      recommended: false,
    },
    {
      name: "Max",
      subtitle: "Turn returns into a new revenue channel",
      price: null,
      priceUnit: null,
      quota: null,
      solve: "Challenges We Solve",
      problems: [
        "Revenue lost through returns",
        "Recovery efforts are hard to measure",
        "Complex return scenarios are hard to manage",
      ],
      rightsTitle: "Key Capabilities",
      capabilities: [
        "All Pro Features",
        "Compensation / Store Credits / Exchange Offers",
        "Revenue Recovery ROI Dashboard",
        "Advanced Workflows + Open API",
      ],
      recommended: true,
    },
  ],
};

/** FAQs shown on product page (+ full i18n answers) */
export const FAQS = [
  {
    q: "1. How does the AI Rule Builder work? Do I need technical skills?",
    a: "No technical skills required. Simply describe your return policy in plain language, and AI will build the workflow automatically. Supports 9 trigger types × 8 actions with built-in conflict detection.",
  },
  {
    q: "2. What return methods are supported?",
    a: "Four common return flows cover most return and exchange scenarios.",
    list: [
      "Return & Refund: generate label, return item, refund after receipt",
      "Returnless Refund (Keep-It Refund): no return required, refund instantly, save on reverse logistics",
      "Same-Item Exchange",
      "Exchange with Price Difference",
    ],
  },
  {
    q: "3. Is 17RETURNS right for me if I don't have many returns?",
    a: "Absolutely. Even with low return volumes, support teams spend significant time on emails, approvals, and cross-time-zone communication. 17RETURNS automates the process with a branded returns portal.",
    a2: "Start with automation to reduce support workload, then unlock advanced revenue recovery and workflow features as you grow.",
  },
];

export const META = {
  title: "Ecommerce Returns Solution & Global Returns Management - 17TRACK Returns",
  description:
    "Optimize global ecommerce returns with automated workflows, lower operating costs, and a better customer experience across international logistics networks.",
};

export const EXPLORE = {
  title: "Need branded tracking or shipment data infrastructure?",
  lead: "Beyond returns, explore order tracking experiences and shipment data APIs — pick the product that matches your stage.",
  trackingTitle: "17 Order Tracking",
  trackingDesc:
    "Create a branded tracking page that cuts WISMO tickets and turns high-intent visits into repurchase moments.",
  trackingCta: "Explore 17 Order Tracking",
  apiTitle: "Tracking API",
  apiDesc:
    "Global shipment tracking data for developers and enterprise systems — less multi-carrier integration overhead.",
  apiCta: "Explore Tracking API",
};
