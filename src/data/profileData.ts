// src/data/profileData.ts

export type RoleType = 'employment' | 'board' | 'advisory' | 'committee'

export interface Experience {
  id: string
  title: string
  company: string
  domain: string
  startDate: string
  endDate: string
  location: string
  description: string
  type: RoleType
}

export interface Education {
  id: string
  school: string
  domain: string
  degree: string
  field: string
  startYear: number
  endYear: number
  description: string
}

export interface Certification {
  name: string
  issuer: string
  domain: string
}

export interface Language {
  name: string
  proficiency: string
}

export interface Skill {
  pinned: string[]
  hard: string[]
  industry: string[]
  soft: string[]
  emerging: string[]
}

export interface Post {
  id: string
  body: string
  reactions: number
  comments: number
}

export interface FeaturedArticle {
  title: string
  description: string
}

export interface Profile {
  name: string
  headline: string
  location: string
  connections: string
  linkedinUrl: string
  email: string
  photo: string
  banner: string
  about: string
  experience: Experience[]
  education: Education[]
  certifications: Certification[]
  languages: Language[]
  skills: Skill
  posts: Post[]
  featuredArticle: FeaturedArticle
}

export const profile: Profile = {
  name: 'Feras H. Al-Bader',
  headline: 'Chief Commercial Officer | Revenue Architecture & AI-Powered Growth | 3B SAR GMV · 12K+ Merchants | GCC',
  location: 'Riyadh, Saudi Arabia',
  connections: '500+',
  linkedinUrl: 'https://www.linkedin.com/in/nasserff/',
  email: 'nasserff@gmail.com',
  photo: '/profile-photo.jpg',
  banner: '/banner.jpg',

  about: `I've spent 18 years building commercial teams and revenue systems across Saudi Arabia's fastest-growing industries, serving as a Chief Commercial Officer, Chief Revenue Officer, and Chief Operating Officer.

My background sits at an unusual intersection: I hold an M.Sc. in Artificial Intelligence from KFUPM and have spent my career on the commercial side. I deploy AI in commercial systems and own the P&L it affects.

At Zid, I built the entire commercial function from scratch, scaling it to a 100+ person team that acquired 12,000+ merchants and drove 3B SAR in cumulative GMV within two years. At FlyAkeed, I restructured the revenue organisation (40% cost reduction while sustaining growth) and deployed an AI-powered commercial engine, including AI SDR, that has transformed our pipeline and customer acquisition.

I'm a Saudi national with deep roots in the GCC, having worked from management consulting at EY to building national infrastructure at Najm (under SAMA), to scaling Zid and FlyAkeed. I'm equally comfortable navigating enterprise stakeholders, Vision 2030 entities, and high-growth tech companies.

Specialties: Revenue Architecture | Go-to-Market Strategy | Commercial Transformation | AI-Powered Growth | P&L Management | SaaS | E-Commerce | Travel Tech | Saudi Vision 2030 | GCC Markets`,

  experience: [
    {
      id: 'flyakeed-ccro',
      title: 'Chief Commercial & Revenue Officer',
      company: 'FlyAkeed',
      domain: 'flyakeed.com',
      startDate: 'Jul 2024',
      endDate: 'Present',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `FlyAkeed is Saudi Arabia's leading corporate travel management and SaaS platform, helping organisations streamline business travel, control costs, and optimise spend through technology.

Lead the full revenue organisation across Sales, BD & Partnerships, Customer Success & Account Management, and Marketing, with full P&L accountability for GBV and SaaS revenue growth.
Restructured the revenue organisation for efficiency, reducing operational costs by 40% while sustaining business revenue growth across both GBV and SaaS lines, resetting the commercial architecture without sacrificing momentum.
Pioneered an AI-powered commercial engine, deploying AI SDR and AI-driven lead generation and nurturing workflows that significantly accelerated pipeline velocity and reduced cost of acquisition.
Opened new revenue streams by identifying and closing project-based commercial opportunities, diversifying FlyAkeed's income beyond core subscription and transaction revenue.
Revamped the Customer Success function to reduce churn and improve NPS, repositioning CS as a commercial retention and growth function, integrating it fully into the revenue operating system rather than treating it as a cost centre.`,
    },
    {
      id: 'majmaah-advisory',
      title: 'Advisory Board Member',
      company: 'Majmaah University, Dept. of Computer Science',
      domain: 'mu.edu.sa',
      startDate: 'May 2024',
      endDate: 'Present',
      location: '',
      type: 'advisory',
      description: `Member of the Advisory Board for the Department of Computer Science and Information Technology at Majmaah University, contributing expertise in AI applications, commercial technology strategy, and industry-academia alignment in support of Saudi Vision 2030 digital economy goals.`,
    },
    {
      id: 'zid-cco',
      title: 'Chief Commercial Officer (CCO)',
      company: 'Zid | زد',
      domain: 'zid.sa',
      startDate: 'Apr 2021',
      endDate: 'Jul 2024',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `Zid is Saudi Arabia's leading e-commerce enablement platform, powering thousands of merchants to launch, operate, and grow their digital commerce businesses across the Kingdom.

Architected and scaled Zid's entire commercial function from the ground up, spanning Sales, Onboarding, Merchant Success, and Customer Operations, building a 100+ person organisation that generated 30M SAR in revenue and acquired 12,000+ merchants within two years.
Owned full commercial P&L accountability, driving 3B SAR in cumulative GMV and setting a record monthly high of 300M SAR through strategic resource allocation and cross-functional alignment across the merchant lifecycle.
Executed a company-wide commercial strategy reset: redesigned pricing, relaunched the product offering, and led competitive benchmarking, converting 3,000 paid merchants onto the new entry package within one month of launch.
Championed a strategic shift to product-led growth (PLG), reducing average time-to-subscribe from 13 to 4 days, directly compressing the sales cycle, improving unit economics, and embedding go-to-market efficiency into the product itself.
Won 30+ high-value enterprise key accounts away from entrenched competitors by personally driving the strategy to identify, pursue, and convert enterprise merchants and expanding Zid's market share in competitive segments.`,
    },
    {
      id: 'medformatix-board',
      title: 'Board Member',
      company: 'MedFormatix',
      domain: 'medformatix.com',
      startDate: 'May 2019',
      endDate: 'Present',
      location: '',
      type: 'board',
      description: `Board member contributing commercial strategy, business development, and go-to-market expertise to support MedFormatix's growth in healthcare technology and digital health solutions.`,
    },
    {
      id: 'excellence-health-board',
      title: 'Board Member',
      company: 'The Excellence Health Training',
      domain: 'excellencehealth.sa',
      startDate: 'Oct 2023',
      endDate: 'Dec 2024',
      location: 'Riyadh, Saudi Arabia',
      type: 'board',
      description: `Board member providing strategic guidance on commercial development, partnership structuring, and go-to-market execution in the health training and professional education sector.`,
    },
    {
      id: 'flyakeed-coo',
      title: 'Chief Operating Officer (COO)',
      company: 'FlyAkeed',
      domain: 'flyakeed.com',
      startDate: 'Nov 2018',
      endDate: 'Oct 2020',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `Led cross-functional operations across product, technology, finance, and commercial teams during FlyAkeed's early-stage scale-up, establishing the operational infrastructure that enabled commercial growth across the GCC corporate travel market.
Drove organisational design and operational process-building that allowed the business to grow its enterprise customer base and expand its travel management SaaS offering.
Established vendor relationships, partnership frameworks, and internal performance systems that positioned FlyAkeed for its next phase of commercial expansion.`,
    },
    {
      id: 'waseel-committee',
      title: 'Business Development Committee Member',
      company: 'Waseel ASP Ltd.',
      domain: 'waseel.com',
      startDate: 'Jun 2020',
      endDate: 'Feb 2022',
      location: 'Riyadh, Saudi Arabia',
      type: 'committee',
      description: `Strategic input on commercial partnerships, revenue growth initiatives, and market expansion in healthcare technology and insurance sectors.`,
    },
    {
      id: 'tihama-svp',
      title: 'Senior Vice President, Business Development and Corporate Performance',
      company: 'Tihama Group',
      domain: 'tihama.com',
      startDate: 'Sep 2016',
      endDate: 'Aug 2018',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `Led enterprise-scale business development and strategic partnerships across Tihama Group's diversified portfolio, identifying and closing high-value commercial opportunities across multiple verticals.
Drove corporate performance frameworks including KPI design, organisational alignment, and revenue growth programmes across business units.
Managed key stakeholder relationships with enterprise clients and government entities, leveraging deep GCC market relationships to accelerate commercial outcomes.`,
    },
    {
      id: 'najm-comms',
      title: 'Communication & Public Relations Manager / Spokesman',
      company: 'Najm Company for Insurance Services',
      domain: 'najm.sa',
      startDate: 'Jul 2014',
      endDate: 'Aug 2016',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `Served as official spokesman for Najm, managing all external communications under the regulatory oversight of the Saudi Arabian Monetary Authority (SAMA). Led communications strategy across media, government relations, and public affairs for Saudi Arabia's national motor insurance information company.`,
    },
    {
      id: 'najm-pm',
      title: 'NajmNet Project Manager',
      company: 'Najm Company for Insurance Services',
      domain: 'najm.sa',
      startDate: 'Nov 2012',
      endDate: 'Jun 2014',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `Developed and managed the Saudi National Information Center for Motor Insurance (NajmNet), a national infrastructure project that digitised the Kingdom's motor insurance data ecosystem across every licensed insurer in Saudi Arabia.

Delivered end-to-end project management across design, development, and full national rollout. NajmNet is now the backbone of Saudi Arabia's motor insurance information infrastructure.`,
    },
    {
      id: 'aldar-founder',
      title: 'Co-Founder and General Manager',
      company: 'Al-Dar Darak',
      domain: 'aldardarak.com',
      startDate: 'Dec 2008',
      endDate: 'Nov 2012',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `Co-founded and led Al-Dar Darak, an innovative real estate advisory and home-search service pioneering a customer-centric, consultative model in a market dominated by traditional brokers.

Built the business from concept to full operations: team hiring, product design, revenue model architecture, client acquisition, and partnership development.
Established a differentiated go-to-market model focused on representing the buyer rather than the inventory, generating revenue through advisory fees rather than listing commissions.`,
    },
    {
      id: 'ey-consultant',
      title: 'Consultant, Business Management Advisory Services',
      company: 'Ernst & Young (EY)',
      domain: 'ey.com',
      startDate: 'Mar 2006',
      endDate: 'Mar 2008',
      location: 'Riyadh, Saudi Arabia',
      type: 'employment',
      description: `Built my commercial and strategic foundation at EY, working across government and private sector organisations on strategy, process improvement, and organisational transformation.

Key engagements: Ministry of Municipal & Rural Affairs (MoMRA): IT Strategy & Planning · Ministry of Water and Electricity (MoWE): HR and Change Management · Public Investment Fund (PIF): Organisation Restructuring · Muttahed Holding Company: Business Process Improvement · Saline Water Conversion Corporation (SWCC): Business Case for ERP Implementation · Saudi Arabia General Investment Authority (SAGIA): Financial Transformation`,
    },
  ],

  education: [
    {
      id: 'kfupm-msc',
      school: 'King Fahd University of Petroleum & Minerals (KFUPM)',
      domain: 'kfupm.edu.sa',
      degree: 'Master of Science (M.Sc.)',
      field: 'Artificial Intelligence',
      startYear: 2020,
      endYear: 2021,
      description: `One of the few commercial executives in the GCC with a formal graduate credential in Artificial Intelligence. This M.Sc. is the academic foundation for my work deploying AI in commercial systems, from AI SDR and lead-generation automation at FlyAkeed to the data-driven revenue architecture that underpins my approach to go-to-market strategy and commercial decision-making.`,
    },
    {
      id: 'kfupm-bsc',
      school: 'King Fahd University of Petroleum & Minerals (KFUPM)',
      domain: 'kfupm.edu.sa',
      degree: 'Bachelor of Science (B.Sc.)',
      field: 'Management Information Systems (MIS)',
      startYear: 2000,
      endYear: 2006,
      description: `Management Information Systems gave me the systems-thinking foundation that underpins everything I do commercially: understanding how data, technology, and process interact to generate business outcomes. The bridge between MIS and AI is the through-line of my career.`,
    },
  ],

  certifications: [
    {
      name: 'Miller Heiman Sales Excellence: Strategic Selling',
      issuer: 'Miller Heiman Group',
      domain: 'millerheiman.com',
    },
    {
      name: 'Miller Heiman Sales Excellence: Conceptual Selling',
      issuer: 'Miller Heiman Group',
      domain: 'millerheiman.com',
    },
    {
      name: 'Miller Heiman Sales Excellence: Large Account Management Process (LAMP)',
      issuer: 'Miller Heiman Group',
      domain: 'millerheiman.com',
    },
  ],

  languages: [
    { name: 'Arabic', proficiency: 'Native or Bilingual Proficiency' },
    { name: 'English', proficiency: 'Full Professional Proficiency' },
  ],

  skills: {
    pinned: ['Revenue Architecture', 'Go-to-Market Strategy', 'Artificial Intelligence'],
    hard: [
      'Commercial Strategy', 'P&L Management', 'Revenue Operations (RevOps)', 'Business Development',
      'Pricing Strategy', 'Financial Modeling', 'Revenue Forecasting', 'Sales Enablement',
      'Customer Success', 'Product-Led Growth (PLG)', 'Enterprise Sales', 'Market Expansion',
      'Partnership Development', 'Competitive Analysis', 'Market Research', 'Commercial Excellence',
      'Sales Operations', 'Customer Acquisition', 'Revenue Model Design', 'Subscription Revenue',
      'Digital Transformation', 'Data Analytics', 'Data-Driven Decision Making', 'CRM',
      'Machine Learning', 'Strategic Planning', 'Organisational Design',
    ],
    industry: [
      'SaaS', 'E-Commerce', 'Travel Tech', 'FinTech', 'HealthTech', 'Marketplace Platforms',
      'GMV', 'GBV', 'Net Revenue Retention (NRR)', 'ARR / MRR', 'CAC / LTV', 'Merchant Acquisition',
      'Merchant Success', 'B2B', 'Saudi Vision 2030', 'GCC Markets', 'Management Consulting',
      'Digital Payments', 'Insurance Tech', 'E-Commerce Platforms',
    ],
    soft: [
      'Executive Leadership', 'Cross-Functional Alignment', 'Strategic Thinking', 'Team Building',
      'Stakeholder Management', 'Board Advisory', 'People Development', 'Change Management',
      'Negotiation', 'Communication',
    ],
    emerging: [
      'AI in Sales', 'AI SDR', 'Revenue Intelligence', 'Generative AI (Business Applications)',
      'Agentic AI', 'Digital Economy',
    ],
  },

  posts: [
    {
      id: 'revenue-architecture',
      body: `Most commercial problems are architecture problems.

I learned this the hard way at Zid.

When I joined as CCO, we had a fragmented commercial operation with no shared structure between Sales, Onboarding, Merchant Success, and Customer Operations. Teams were running in parallel, not in sequence. The result: slow merchant activation, high churn risk, and a ceiling on growth.

We didn't solve it by hiring more salespeople.
We solved it by redesigning the architecture.

Here is what Revenue Architecture actually means:

The right revenue model. Not just pricing, but the full logic of how value is created, captured, and retained.
The right data infrastructure. Every commercial decision needs a feedback loop. Without data, you're flying blind.
The right team design. Structure follows strategy. If your org chart doesn't match your go-to-market motion, you will fight yourself every quarter.
The right handoff sequencing. Sales, Onboarding, Success: these are not departments. They are stages in one continuous commercial system.

The outcome at Zid:
3B SAR in cumulative GMV
12,000+ merchants acquired
Time-to-subscribe cut from 13 days to 4 days
100+ person commercial organisation, built from zero

None of that came from working harder.
It came from designing the right system.

If you're scaling a commercial operation in the GCC and hitting invisible ceilings, I'd be willing to bet the ceiling is an architecture issue, not a talent issue.

What's the one part of your commercial architecture you'd rebuild if you could start over?`,
      reactions: 847,
      comments: 63,
    },
    {
      id: 'ai-sdr',
      body: `I deployed an AI SDR this year. Here is what I got wrong first, and what changed when we got it right.

At FlyAkeed, I made a common mistake early on.
We treated the AI SDR as a replacement for human outreach. More volume, lower cost. Simple math.

It didn't work.

The problem wasn't the AI. The problem was the architecture.
We fed it generic lead lists with no enrichment. No segmentation logic. No clear handoff protocol to human reps. The AI was sophisticated, but it was running on a broken commercial system.

When we rebuilt the architecture:
Enriched input first. AI SDR only works if the data feeding it is clean, segmented, and commercially meaningful.
Defined the handoff precisely. AI qualifies. Human closes. The boundary matters more than the AI itself.
Integrated into the revenue operating system. Every AI-generated lead enters the same pipeline, the same CRM logic, the same tracking. No parallel universe.

The result: pipeline velocity increased significantly. Cost of acquisition dropped. And our human reps spent their time on conversations that mattered, not prospecting.

The lesson I'd share with any CCO or CRO thinking about AI SDR:

AI in commercial functions is not a shortcut. It is a multiplier.
And multipliers only work when the underlying system is sound.

I have an M.Sc. in AI. But the most important lesson AI taught me is that technology doesn't fix broken processes. It amplifies them.

What is one AI tool you've deployed commercially that worked better than expected, or worse? I'm curious what others are seeing.`,
      reactions: 1204,
      comments: 91,
    },
    {
      id: 'building-teams',
      body: `I once had to build a 100-person commercial team from zero. No playbook. No existing structure. Just a mandate.

When I joined Zid as CCO, the commercial function did not exist in any meaningful form.
There was no Sales team. No Onboarding team. No Merchant Success function. No Customer Operations.

There was a product. There were merchants who wanted to use it. And there was a gap between the two that needed a system.

Three things I learned from building that system from scratch:

Hire for the motion, not the title. In a zero-to-one build, you need people who thrive in ambiguity. A brilliant VP from a scaled company can be the wrong hire at the wrong time. I learned to read for adaptability first, expertise second.
Design the handoffs before you fill the seats. I made the mistake of hiring Sales before Onboarding was defined. We acquired merchants faster than we could activate them. The commercial architecture has to precede the headcount.
Your culture is set in the first 10 hires. Everything after that is either compounding or correcting. I was fortunate to get the first 10 mostly right. The commercial team's character, data-driven, customer-obsessed, and commercially rigorous, came from those early decisions.

By the time I left Zid, the team had scaled to 100+ people and had acquired 12,000+ merchants, driven 3B SAR in cumulative GMV, and set a monthly GMV record of 300M SAR.

Not because of any one person.
Because the system worked.

If you're currently building a commercial team from scratch, what's the hardest part you didn't expect?`,
      reactions: 932,
      comments: 74,
    },
  ],

  featuredArticle: {
    title: 'Revenue Architecture: How I Built a 3B SAR GMV Commercial Engine from Scratch',
    description: 'Most commercial problems are architecture problems. Here is the blueprint I used at Zid, and why designing the engine matters more than running it.',
  },
}
