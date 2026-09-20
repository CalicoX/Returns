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
  logos: [
    { src: "/assets/logos/aliexpress.svg", alt: "AliExpress" },
    { src: "/assets/logos/baleaf.png", alt: "Baleaf" },
    { src: "/assets/logos/cainiao.png", alt: "Cainiao" },
    { src: "/assets/logos/anker.svg", alt: "Anker" },
    { src: "/assets/logos/coofandy.png", alt: "COOFANDY" },
    { src: "/assets/logos/eufy.png", alt: "eufy" },
    { src: "/assets/logos/xgimi.svg", alt: "XGIMI" },
    { src: "/assets/logos/sharge.png", alt: "SHARGE" },
    { src: "/assets/logos/totwoo.png", alt: "totwoo" },
    { src: "/assets/logos/vaporesso.svg", alt: "Vaporesso" },
    { src: "/assets/logos/goelia.svg", alt: "GOELIA" },
    { src: "/assets/logos/plaud.png", alt: "Plaud" },
  ],
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
    badgeInArt: true,
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

/**
 * Pricing —— 文案与价格矩阵取自 17track 官方定价页（2026-09-20 抓取）：
 * https://www.17track.net/en/pricing  → 17RETURNS 分档
 * quotas 的 price 是「月费」，annualQuota 是年付时该档包含的年度退货量。
 */
export const PLANS = {
  title: "Pricing",
  lead: "Pay based on monthly return volume. Upgrade or downgrade anytime. Save ~18% with annual billing.",
  billedYearly: "Billed yearly",
  save: "Save ~18%",
  perMonth: "/month",
  startTrial: "Start Free Trial",
  getQuote: "Get a Quote",
  recommended: "★ RECOMMENDED",
  items: [
    {
      name: "Free",
      subtitle:
        "Ideal for no-return refunds and basic after-sales automation, reducing return costs",
      freeQuota: "10 returns per month",
      rightsTitle: "Free plan benefits",
      capabilities: [
        "Green return",
        "Unfulfilled order cancellation",
        "Basic workflows",
        "Rule configuration and process automation",
        "AI rule builder",
        "AI multi-language localization",
      ],
      recommended: false,
    },
    {
      name: "Basic",
      subtitle:
        "Ideal for no-return refunds and basic after-sales automation, reducing return costs",
      overage: 0.2,
      quotas: {
        month: [
          { quota: 20, price: 5 },
          { quota: 60, price: 12 },
          { quota: 100, price: 18 },
          { quota: 200, price: 32 },
          { quota: 400, price: 59 },
        ],
        year: [
          { quota: 20, price: 4, annualQuota: 240 },
          { quota: 60, price: 10, annualQuota: 720 },
          { quota: 100, price: 15, annualQuota: 1200 },
          { quota: 200, price: 27, annualQuota: 2400 },
          { quota: 400, price: 48, annualQuota: 4800 },
        ],
      },
      rightsTitle: "Basic plan benefits",
      capabilities: [
        "Green return",
        "Unfulfilled order cancellation",
        "Basic workflows",
        "Rule configuration and process automation",
        "AI rule builder",
        "AI multi-language localization",
      ],
      recommended: false,
    },
    {
      name: "Pro",
      subtitle: "Automate returns and exchanges with a branded self-service experience.",
      overage: 0.5,
      quotas: {
        month: [
          { quota: 20, price: 11 },
          { quota: 60, price: 29 },
          { quota: 100, price: 44 },
          { quota: 200, price: 79 },
          { quota: 400, price: 139 },
        ],
        year: [
          { quota: 20, price: 9, annualQuota: 240 },
          { quota: 60, price: 24, annualQuota: 720 },
          { quota: 100, price: 36, annualQuota: 1200 },
          { quota: 200, price: 65, annualQuota: 2400 },
          { quota: 400, price: 115, annualQuota: 4800 },
        ],
      },
      rightsTitle: "24 Core Features",
      capabilities: [
        "Branded Portal · Self-Service Returns · Tracking · Embedded Center",
        "Refunds · Exchanges · Keep-It Refunds · Cancellations",
        "AI Rules · Workflows · Smart Queues · AI Assistant",
        "Store Credit Refunds · Fees · Price Difference Settlement",
        "Shipping Rate Comparison · Aggregated/Own Carriers · Labels · QR Codes",
        "Branded Emails · Shopify · Multi-Store · Multi-Language",
      ],
      recommended: false,
    },
    {
      name: "Max",
      subtitle: "Turn returns into a new revenue stream.",
      overage: 1.2,
      quotas: {
        month: [
          { quota: 20, price: 29 },
          { quota: 60, price: 79 },
          { quota: 100, price: 119 },
          { quota: 200, price: 209 },
          { quota: 400, price: 369 },
        ],
        year: [
          { quota: 20, price: 24, annualQuota: 240 },
          { quota: 60, price: 65, annualQuota: 720 },
          { quota: 100, price: 99, annualQuota: 1200 },
          { quota: 200, price: 169, annualQuota: 2400 },
          { quota: 400, price: 299, annualQuota: 4800 },
        ],
      },
      rightsTitle: "Everything in Pro, plus:",
      capabilities: [
        "Advanced Workflows (Amount / Country / Delivery Time)",
        "Compensation-Based Retention",
        "Store Credit Retention",
        "Exchange-Based Retention",
        "Revenue Recovery Dashboard",
        "Open API Access",
      ],
      recommended: true,
    },
  ],
  /** 企业定制版横幅 */
  enterprise: {
    name: "Enterprise Plan",
    subtitle:
      "Tailored for Enterprise Merchants with Custom Return Capacity and Deep Integrations",
    cta: "Get a Quote",
    href: "https://www.17track.com/en/contact-us",
    featureTitle: "Includes everything in Max, plus:",
    features: [
      "Enterprise Benefits",
      "Custom Return Volume",
      "Dedicated Customer Success Manager",
      "SLA & Priority Support",
      "Custom Integrations",
      "Data Migration Service",
      "Multi-Brand / Multi-Region Deployment",
    ],
  },
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
  trackingTitle: "17TRACK Order Tracking",
  trackingDesc:
    "Create a branded tracking page that cuts WISMO tickets and turns high-intent visits into repurchase moments.",
  trackingCta: "17TRACK Order Tracking",
  apiTitle: "Tracking API",
  apiDesc:
    "Global shipment tracking data for developers and enterprise systems — less multi-carrier integration overhead.",
  apiCta: "Explore Tracking API",
};
