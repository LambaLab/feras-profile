# Design: Humain-Targeted Profile Page (`/humain`)

**Date:** 2026-03-12
**Status:** Approved
**Purpose:** Executive role positioning for Feras H. Al-Bader targeting Humain (Saudi PIF AI company) — specifically the Travel & Entertainment sectors they are building AI solutions for.

---

## 1. Technical Architecture

### Routing
- Add `react-router-dom` package
- `main.tsx` wraps app in `<BrowserRouter>` with two `<Route>` entries:
  - `/` → `<App profile={profile} />` (existing general profile, unchanged)
  - `/humain` → `<App profile={profileHumain} />` (new targeted data)
- `vercel.json` SPA rewrite already handles both routes correctly

### Code changes
| File | Change |
|---|---|
| `src/App.tsx` | Accept `profile` as prop instead of importing directly |
| `src/main.tsx` | Add `BrowserRouter` + `Routes` wrapping both paths |
| `src/data/profileDataHumain.ts` | New file — spread-overrides `profile` with targeted content |
| `package.json` | Add `react-router-dom` dependency |

No new components. No new routes file. No structural changes to existing pages.

---

## 2. Content Changes (`profileDataHumain.ts`)

### Headline
```
AI-Powered Commercial Leader | Travel Tech · Entertainment & Retail | 3B SAR GMV · 12K+ Merchants | Vision 2030 GCC
```

### About (restructured into 5 beats)
1. **Hook** — Saudi Arabia is building the world's third-largest AI market (Humain's mission). The companies that win won't just have the best models — they'll have the commercial architecture to deploy them at scale across Travel, Entertainment, and Retail.
2. **His intersection** — M.Sc. in AI + 18 years as CCO/CRO/COO. He is one of the few executives in GCC who holds both the technical depth and the commercial track record to bridge AI strategy with revenue execution.
3. **Travel proof point** — FlyAkeed: Saudi Arabia's leading corporate travel platform. Currently deploying AI SDR, AI-driven lead generation, and intelligent spend management — transforming how corporations manage business travel at scale.
4. **Entertainment/Retail proof point** — Zid: powered 12,000+ merchants including entertainment and retail operators, drove 3B SAR GMV. Tihama Group: one of Saudi Arabia's largest media and entertainment conglomerates.
5. **Close/signal** — "The intersection of AI infrastructure and commercial sector transformation is exactly where I've spent my career. It's also where Humain is building."

### Experience — re-emphasis (order unchanged, intro lines rewritten)

**FlyAkeed CCRO**
- Intro: *"FlyAkeed is Saudi Arabia's leading AI-powered corporate travel management platform — transforming how organisations across the Kingdom plan, book, and optimise business travel through intelligent automation."*
- Lead bullet shifted to: AI deployment (AI SDR, AI-driven lead generation, pipeline automation) ahead of org restructuring

**Zid CCO**
- Intro: *"Zid is Saudi Arabia's leading e-commerce enablement platform — powering thousands of merchants across retail, entertainment, F&B, and consumer services to build and scale their digital commerce operations."*
- Lead bullet emphasises entertainment/retail merchant acquisition and GMV scale

**Tihama Group SVP**
- Intro updated to surface Tihama as one of Saudi Arabia's largest media, entertainment, and publishing conglomerates
- Explicitly mention entertainment sector context

All other experiences: unchanged.

### Skills — pinned (top 3)
```
AI-Powered Growth  ·  Travel Tech  ·  Entertainment & Retail GTM
```
(was: Revenue Architecture, Enterprise Sales, Product-Led Growth)

Hard skills section reordered to front-load: AI, Travel Tech, Revenue Architecture, Enterprise Sales, SaaS.

### Posts (Activity section) — 2 of 3 rewritten

**Post 1 — Travel AI:**
> "Corporate travel is a data problem disguised as a logistics problem.
> Most companies can't answer basic questions: Where is our travel spend going? Which policies are being bypassed? What is our actual cost per trip vs. what we approved?
> At FlyAkeed, we're deploying AI to change that — real-time spend visibility, intelligent booking nudges, and automated compliance. The result: organisations regaining control of one of their largest unmanaged cost lines.
> Travel tech isn't a nice-to-have. In 2025, it's a commercial advantage."

**Post 2 — Entertainment/Retail sector AI:**
> "Saudi Arabia's entertainment sector went from near-zero to one of the most active consumer markets in the region in under a decade.
> The next wave isn't about opening more venues or events. It's about knowing your customer before they walk in the door.
> AI-powered demand forecasting. Personalised offers at scale. Real-time inventory and capacity management.
> The companies that deploy intelligent commercial systems now will own the category. The ones that don't will compete on price."

**Post 3 (featured article):** unchanged — kept as the general Revenue Architecture article.

---

## 3. What Does NOT Change

- Name, location, connections, photo, banner, email, LinkedIn URL
- All 12 experience entries (dates, titles, companies, domains, most bullet content)
- Education section (KFUPM degrees)
- Certifications (Miller Heiman)
- Languages
- Page layout, components, design system, colours

---

## 4. URL
- Live at: `https://feras-profile.vercel.app/humain`
- General page stays at: `https://feras-profile.vercel.app/`
