# Humain-Targeted Profile Page (`/humain`) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/humain` route serving a Travel & Entertainment-targeted version of the profile, positioning Feras for an executive role at Humain (Saudi PIF AI company), while keeping the existing `/` page unchanged.

**Architecture:** Add `react-router-dom`; refactor `App.tsx` to accept `profile` as a prop; `main.tsx` mounts a `<BrowserRouter>` with two routes pointing to the same `App` with different data objects. All content lives in a new `src/data/profileDataHumain.ts` file that spreads the base profile and overrides targeted fields.

**Tech Stack:** React 18, TypeScript 5, react-router-dom v6, Vite 5, Tailwind CSS 3, Vitest

---

## Task 1: Install react-router-dom

**Files:**
- Modify: `package.json` (via npm install)

**Step 1: Install the package**

```bash
cd "/Users/nagi/Downloads/Lamba Lab/Feras/feras-profile"
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm install react-router-dom
```

Expected: package installs, `package.json` shows `"react-router-dom"` in dependencies.

**Step 2: Verify types are included**

`react-router-dom` v6 ships its own TypeScript types — no `@types/` package needed. Confirm:

```bash
ls node_modules/react-router-dom/dist/*.d.ts | head -3
```

Expected: `.d.ts` files listed.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-router-dom for multi-route profile pages"
```

---

## Task 2: Refactor App.tsx to accept `profile` as a prop

**Files:**
- Modify: `src/App.tsx`

**Step 1: Update App.tsx**

Replace the current file content with:

```tsx
// src/App.tsx
import { useEffect, useState } from 'react'
import type { Profile } from './data/profileData'
import { ProfileCard } from './components/header/ProfileCard'
import { ActionButtons } from './components/header/ActionButtons'
import { SectionNav } from './components/header/SectionNav'
import { AboutSection } from './components/about/AboutSection'
import { ExperienceSection } from './components/experience/ExperienceSection'
import { SkillsSection } from './components/skills/SkillsSection'
import { EducationSection } from './components/education/EducationSection'
import { ActivitySection } from './components/activity/ActivitySection'

const NAV_SECTIONS = ['About', 'Experience', 'Skills', 'Education', 'Activity']

interface AppProps {
  profile: Profile
}

export default function App({ profile }: AppProps) {
  const [activeSection, setActiveSection] = useState('About')

  useEffect(() => {
    const handleScroll = () => {
      for (const section of [...NAV_SECTIONS].reverse()) {
        const el = document.getElementById(section.toLowerCase())
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80) {
            setActiveSection(section)
            return
          }
        }
      }
      setActiveSection(NAV_SECTIONS[0])
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-li-bg">
      <main className="max-w-3xl mx-auto py-4 sm:py-0 flex flex-col sm:gap-2 gap-0">
        <div className="bg-white sm:rounded-lg shadow-li-card overflow-hidden">
          <ProfileCard profile={profile} />
          <ActionButtons linkedinUrl={profile.linkedinUrl} email={profile.email} />
        </div>
        <SectionNav sections={NAV_SECTIONS} activeSection={activeSection} />
        <AboutSection text={profile.about} />
        <ExperienceSection experience={profile.experience} />
        <SkillsSection skills={profile.skills} />
        <EducationSection
          education={profile.education}
          certifications={profile.certifications}
          languages={profile.languages}
        />
        <ActivitySection
          posts={profile.posts}
          featuredArticle={profile.featuredArticle}
          profile={profile}
        />
        <div className="h-8" />
      </main>
    </div>
  )
}
```

**Step 2: Run tests — expect failures** (tests that render `<App />` without props will fail with a TypeScript error, which is expected — we fix tests in Task 3)

```bash
cd "/Users/nagi/Downloads/Lamba Lab/Feras/feras-profile"
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run 2>&1 | tail -20
```

Note: if tests still pass (jsdom may not typecheck), proceed. If they fail, proceed to Task 3 to fix them.

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: App accepts profile as prop for multi-route support"
```

---

## Task 3: Update main.tsx with BrowserRouter and two routes

**Files:**
- Modify: `src/main.tsx`

**Step 1: Update main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { profile } from './data/profileData'
import { profileHumain } from './data/profileDataHumain'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App profile={profile} />} />
        <Route path="/humain" element={<App profile={profileHumain} />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
```

Note: `profileDataHumain` doesn't exist yet — TypeScript will error. That's fine; it will be created in Task 4. The build will succeed after Task 4.

**Step 2: Commit**

```bash
git add src/main.tsx
git commit -m "feat: add BrowserRouter with / and /humain routes"
```

---

## Task 4: Create `src/data/profileDataHumain.ts` with all targeted content

**Files:**
- Create: `src/data/profileDataHumain.ts`

**Step 1: Create the file with full content**

```typescript
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
    profile.posts[2],
  ],
}
```

**Step 2: Run the build to verify TypeScript compiles cleanly**

```bash
cd "/Users/nagi/Downloads/Lamba Lab/Feras/feras-profile"
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build 2>&1 | tail -20
```

Expected: `✓ built in` with no TypeScript errors.

**Step 3: Run all tests**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run 2>&1 | tail -15
```

Expected: all tests pass (tests don't cover profileDataHumain directly, but all existing tests should still pass).

**Step 4: Commit**

```bash
git add src/data/profileDataHumain.ts
git commit -m "feat: add Humain-targeted profile data (Travel & Entertainment)"
```

---

## Task 5: Fix any tests that broke due to App.tsx prop change

**Files:**
- Modify: any test files that render `<App />` directly

**Step 1: Find tests that render App**

```bash
grep -r "render(<App" src/ --include="*.test.*"
grep -r "render(<App" src/ --include="*.test.*" -l
```

If no results: skip this task entirely.

**Step 2: Update any App render calls to pass profile prop**

If tests exist that do `render(<App />)`, update them to:

```tsx
import { profile } from '../../data/profileData'
import { MemoryRouter } from 'react-router-dom'

render(
  <MemoryRouter>
    <App profile={profile} />
  </MemoryRouter>
)
```

**Step 3: Run tests and confirm all pass**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run 2>&1 | tail -15
```

Expected: all tests pass.

**Step 4: Commit (only if changes were needed)**

```bash
git add src/
git commit -m "fix: update App tests to pass profile prop after refactor"
```

---

## Task 6: Smoke test both routes locally, then push

**Step 1: Start the dev server**

```bash
cd "/Users/nagi/Downloads/Lamba Lab/Feras/feras-profile"
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run dev
```

**Step 2: Verify both routes**

Open in browser:
- `http://localhost:5173/` — should show general profile: headline "Chief Commercial Officer | Revenue Architecture…"
- `http://localhost:5173/humain` — should show Humain profile: headline "AI-Powered Commercial Leader | Travel Tech…"

Check that:
- [ ] `/humain` headline reads "AI-Powered Commercial Leader | Travel Tech · Entertainment & Retail…"
- [ ] `/humain` About section leads with the Humain hook paragraph
- [ ] `/humain` FlyAkeed description leads with "AI-powered corporate travel management platform"
- [ ] `/humain` FlyAkeed first bullet is the AI SDR bullet
- [ ] `/humain` Zid description leads with "retail, entertainment, F&B, and consumer services"
- [ ] `/humain` Tihama description mentions "media, entertainment, publishing"
- [ ] `/humain` Pinned skills show: "AI-Powered Growth", "Travel Tech", "Entertainment & Retail GTM"
- [ ] `/humain` First post is the corporate travel AI post
- [ ] `/` is completely unchanged

**Step 3: Run final build**

```bash
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build 2>&1 | tail -10
```

Expected: clean build, no errors.

**Step 4: Push to GitHub (Vercel auto-deploys)**

```bash
git push
```

**Step 5: Verify live URLs after Vercel deploys (~30s)**

- `https://feras-profile.vercel.app/` — general page unchanged
- `https://feras-profile.vercel.app/humain` — Humain targeted page
