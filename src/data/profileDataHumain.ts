// src/data/profileDataHumain.ts
// Humain-targeted profile — Travel & Entertainment sectors, executive role positioning.
// Overrides: headline, about, FlyAkeed/Zid/Tihama descriptions, pinned skills, 2 posts.
// Everything else (name, photo, education, certifications, languages, etc.) is unchanged.

import { profile } from './profileData'
import type { Profile } from './profileData'

export const profileHumain: Profile = {
  ...profile,

  headline: 'AI-Powered Commercial Leader | Travel Tech · Entertainment & Retail | 3B SAR GMV · 12K+ Merchants | Vision 2030 GCC',

  about: `Saudi Arabia is building the world's third-largest AI market. The companies that win won't just have the best models — they'll have the commercial architecture to deploy AI at scale across Travel, Entertainment, and Retail.

That is the intersection where I operate.

I hold an M.Sc. in Artificial Intelligence from KFUPM and have spent 18 years as a CCO, CRO, and COO — one of the few executives in the GCC who combines formal AI credentials with a track record of building and running commercial organisations at scale. I don't just advise on AI strategy. I deploy it, and I own the P&L it affects.

At FlyAkeed — Saudi Arabia's leading AI-powered corporate travel management platform — I'm actively building the commercial AI engine: deploying AI SDR, AI-driven lead generation, and intelligent spend management systems that are transforming how corporations across the Kingdom manage business travel. Travel is a data problem disguised as a logistics problem. AI is how you solve it.

At Zid, I scaled Saudi Arabia's leading e-commerce platform to 12,000+ merchants across retail, entertainment, F&B, and consumer services — driving 3B SAR in cumulative GMV. I built the commercial architecture that made it possible: the sales motion, the onboarding system, the merchant success function, and the data infrastructure that connected them. Before Zid, I was SVP at Tihama Group — one of Saudi Arabia's largest media, entertainment, and publishing conglomerates — driving enterprise business development across its diversified portfolio.

My conviction: AI doesn't transform sectors on its own. It needs a commercial operating system — the right data, the right GTM motion, the right team structure — to generate outcomes at scale. I build those systems.

Specialties: AI-Powered Commercial Growth | Travel Tech | Entertainment & Retail GTM | Revenue Architecture | Go-to-Market Strategy | Commercial Transformation | P&L Management | Saudi Vision 2030 | GCC Markets`,

  experience: profile.experience.map(exp => {
    if (exp.id === 'flyakeed-ccro') {
      return {
        ...exp,
        description: `FlyAkeed is Saudi Arabia's leading AI-powered corporate travel management platform — transforming how organisations across the Kingdom plan, book, and optimise business travel through intelligent automation.

Pioneered an AI-powered commercial engine, deploying AI SDR and AI-driven lead generation and nurturing workflows — significantly accelerating pipeline velocity and reducing cost of acquisition across the corporate travel market.
Restructured the revenue organisation for efficiency, reducing operational costs by 40% while sustaining GBV and SaaS revenue growth — resetting the commercial architecture without sacrificing momentum.
Lead the full revenue organisation across Sales, BD & Partnerships, Customer Success & Account Management, and Marketing — with full P&L accountability for GBV and SaaS revenue growth.
Opened new revenue streams by identifying and closing project-based commercial opportunities, diversifying FlyAkeed's income beyond core subscription and transaction revenue.
Revamped the Customer Success function to reduce churn and improve NPS, repositioning CS as a commercial retention and growth function — integrating it fully into the revenue operating system rather than treating it as a cost centre.`,
      }
    }
    if (exp.id === 'zid-cco') {
      return {
        ...exp,
        description: `Zid is Saudi Arabia's leading e-commerce enablement platform — powering thousands of merchants across retail, entertainment, F&B, and consumer services to build and scale their digital commerce operations.

Drove 3B SAR in cumulative GMV across retail, entertainment, and consumer categories — acquiring 12,000+ merchants and setting a record monthly GMV high of 300M SAR, through strategic resource allocation and cross-functional alignment across the merchant lifecycle.
Architected and scaled Zid's entire commercial function from the ground up — spanning Sales, Onboarding, Merchant Success, and Customer Operations — building a 100+ person organisation that generated 30M SAR in revenue within two years.
Executed a company-wide commercial strategy reset — redesigning pricing, relaunching the product offering, and leading competitive benchmarking — converting 3,000 paid merchants onto the new entry package within one month of launch.
Championed a strategic shift to product-led growth (PLG), reducing average time-to-subscribe from 13 to 4 days — directly compressing the sales cycle and improving unit economics.
Won 30+ high-value enterprise key accounts away from entrenched competitors — personally driving the strategy to identify, pursue, and convert enterprise merchants and expand Zid's market share in competitive segments.`,
      }
    }
    if (exp.id === 'tihama-svp') {
      return {
        ...exp,
        description: `Tihama Group is one of Saudi Arabia's largest and most established media, entertainment, publishing, and advertising conglomerates — with a diversified portfolio spanning content, events, outdoor media, and consumer entertainment across the Kingdom.

Led enterprise-scale business development and strategic partnerships across Tihama's entertainment and media portfolio — identifying and closing high-value commercial opportunities across entertainment, publishing, and advertising verticals.
Drove corporate performance frameworks including KPI design, organisational alignment, and revenue growth programmes across Tihama's business units.
Managed key stakeholder relationships with enterprise clients and government entities, leveraging deep GCC market relationships to accelerate commercial outcomes in the media and entertainment sector.`,
      }
    }
    return exp
  }),

  skills: {
    ...profile.skills,
    pinned: ['AI-Powered Growth', 'Travel Tech', 'Entertainment & Retail GTM'],
    hard: [
      'Artificial Intelligence', 'Travel Tech', 'Revenue Architecture', 'Commercial Strategy',
      'P&L Management', 'Revenue Operations (RevOps)', 'Business Development',
      'Pricing Strategy', 'Financial Modeling', 'Revenue Forecasting', 'Sales Enablement',
      'Customer Success', 'Product-Led Growth (PLG)', 'Enterprise Sales', 'Market Expansion',
      'Partnership Development', 'Competitive Analysis', 'Market Research', 'Commercial Excellence',
      'Sales Operations', 'Customer Acquisition', 'Revenue Model Design', 'Subscription Revenue',
      'Digital Transformation', 'Data Analytics', 'Data-Driven Decision Making', 'CRM',
      'Machine Learning', 'Strategic Planning', 'Organisational Design',
    ],
    industry: [
      'Travel Tech', 'Entertainment & Retail', 'SaaS', 'E-Commerce', 'GMV', 'GBV',
      'Net Revenue Retention (NRR)', 'ARR / MRR', 'CAC / LTV', 'Merchant Acquisition',
      'Merchant Success', 'B2B', 'Saudi Vision 2030', 'GCC Markets', 'FinTech', 'HealthTech',
      'Marketplace Platforms', 'Management Consulting', 'Digital Payments', 'Insurance Tech',
    ],
    // soft and emerging skill categories are intentionally inherited unchanged from profile
  },

  posts: [
    {
      id: 'travel-ai',
      body: `Corporate travel is a data problem disguised as a logistics problem.

Most companies can't answer basic questions: Where is our travel spend going? Which policies are being bypassed? What is our actual cost per trip versus what we approved?

At FlyAkeed, we're deploying AI to change that — real-time spend visibility, intelligent booking nudges, and automated compliance that keeps organisations in control of one of their largest unmanaged cost lines.

But here is what I've learned deploying AI in travel:

The problem is never the AI. The problem is the data architecture feeding it. Clean, enriched, segmented data is the infrastructure that makes AI work. Without it, you have a sophisticated tool running on broken inputs.

When we got the architecture right — enriched lead data, precise AI-to-human handoffs, full CRM integration — pipeline velocity increased significantly and cost of acquisition dropped.

Travel tech is not a nice-to-have in 2025. For any organisation managing business travel at scale across the GCC, it is a competitive advantage.

The companies that deploy intelligent commercial systems now will own the category. The ones that don't will compete on price.

What is the one thing your organisation still manages manually in corporate travel that you know should be automated?`,
      reactions: 1204,
      comments: 91,
    },
    {
      id: 'entertainment-ai',
      body: `Saudi Arabia's entertainment sector went from near-zero to one of the most active consumer markets in the region in under a decade.

The next wave isn't about opening more venues or booking more events. It's about knowing your customer before they walk in the door.

At Zid, I watched this shift happen in real time. We powered thousands of entertainment, F&B, and consumer merchants — and the ones who pulled ahead were not the ones with the best product. They were the ones who understood their customer data and built commercial systems around it.

AI-powered demand forecasting. Personalised offers at scale. Real-time inventory and capacity management. Intelligent customer success that reduces churn before it happens.

These are not future capabilities. They are available now. And the gap between operators who deploy them and those who don't is widening fast.

My conviction: the entertainment and retail transformation in Saudi Arabia under Vision 2030 is not a marketing story. It is a commercial infrastructure story. The sector needs leaders who understand both the AI layer and the go-to-market layer — not just one or the other.

I've spent 18 years building at that intersection.

What's the biggest commercial gap you're seeing in the Saudi entertainment or retail sector right now?`,
      reactions: 847,
      comments: 63,
    },
    // 'building-teams' post inherited unchanged from base profile
    profile.posts.find(p => p.id === 'building-teams')!,
  ],
}
