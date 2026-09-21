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
    trend: "up",
    tag: "Monthly",
  },
  {
    value: "18%+",
    label: "Reduce Reverse Logistics Costs",
    kind: "big",
    trend: "down",
    tag: "Live",
  },
  {
    value: "7×24h",
    label: "Automated Processing",
    kind: "wide",
  },
  {
    value: "80%",
    label: "Support Workload",
    kind: "meter",
    trend: "down",
    fill: 80,
  },
];

/**
 * Explore Tracking 卡真实轨迹（Park 2026-09-21 提供完整 USPS MO）。
 * order: 最新在前。默认只显示前几条，超出卡片渐隐隐藏。
 */
export const TRACK_EVENTS = [
  { title: "Delivered", meta: "SAINT LOUIS, MO 63109 · 9/14/26, 8:23 PM", latest: true },
  { title: "Out for Delivery", meta: "RUSTON, LA 71270 · 10/31/24, 8:23 AM" },
  { title: "Arrived at Post Office", meta: "RUSTON, LA 71270 · 10/31/24, 6:49 AM" },
  { title: "In Transit to Next Facility", meta: "10/31/24, 6:38 AM" },
  { title: "Departed USPS Facility", meta: "MONROE, LA 71203 · 10/31/24, 4:17 AM" },
  { title: "Arrived at USPS Facility", meta: "MONROE, LA 71203 · 10/31/24, 4:00 AM" },
  { title: "In Transit to Next Facility", meta: "10/30/24, 6:38 PM" },
  { title: "Departed USPS Regional Facility", meta: "SHREVEPORT LA DISTRIBUTION CENTER · 10/30/24, 5:28 PM" },
  { title: "Accepted at USPS Regional Destination Facility", meta: "SHREVEPORT LA DISTRIBUTION CENTER · 10/30/24, 4:44 PM" },
  { title: "Arrived at USPS Regional Facility", meta: "SHREVEPORT LA DISTRIBUTION CENTER · 10/30/24, 2:28 PM" },
  { title: "In Transit to Next Facility", meta: "10/30/24, 2:33 AM" },
  { title: "Departed USPS Regional Facility", meta: "DALLAS TX LOGISTICS CENTER · 10/29/24, 11:57 PM" },
  { title: "Arrived USPS Regional Facility", meta: "DALLAS TX LOGISTICS CENTER · 10/29/24, 10:15 PM" },
  { title: "Departed Shipping Partner Facility, USPS Awaiting Item", meta: "GRAND PRAIRIE, TX 75052 · 10/29/24, 3:26 PM" },
  { title: "Arrived Shipping Partner Facility, USPS Awaiting Item", meta: "GRAND PRAIRIE, TX 75052 · 10/28/24, 7:22 PM" },
  { title: "Delivered to local carrier", meta: "10/28/24, 4:45 PM" },
  { title: "Departed from facility", meta: "LOS ANGELES, CALIFORNIA, US · 10/28/24, 6:57 AM" },
  { title: "Arrived at sort facility", meta: "LOS ANGELES, CALIFORNIA, US · 10/26/24, 10:58 PM" },
  { title: "Arrived at sort facility", meta: "10/25/24, 12:05 PM" },
  { title: "Departed from facility", meta: "10/25/24, 11:10 AM" },
  { title: "Clearance processing completed - Import", meta: "LOS ANGELES, CALIFORNIA, US · 10/25/24, 11:10 AM" },
  { title: "In clearance processing - Import", meta: "10/24/24, 9:09 AM" },
  { title: "International flight has arrived", meta: "US · 10/24/24, 8:03 AM" },
  { title: "International flight has departed", meta: "CN · 10/24/24, 7:56 AM" },
  { title: "Arrived at the origin international airport", meta: "CN · 10/24/24, 4:54 AM" },
  { title: "Shipment is in transit to next facility", meta: "Mainland China, CN · 10/22/24, 6:35 PM" },
  { title: "Departed from sort facility", meta: "Mainland China, CN · 10/22/24, 3:05 PM" },
  { title: "Arrived at origin facility", meta: "Mainland China, CN · 10/21/24, 9:52 PM" },
  { title: "Shipment information received", meta: "10/21/24, 9:26 PM" },
  { title: "Shipping Label Created, USPS Awaiting Item", meta: "9/9/26, 12:23 PM" },
];

export const BRANDS = {
  title: "Trusted by over 100,000 brands across various industries worldwide",
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
