# Feras H. Al-Bader — LinkedIn Profile Page

A pixel-perfect LinkedIn-style personal profile page for Feras H. Al-Bader, built with React + TypeScript + Tailwind CSS and deployed on Vercel.

## Live URLs
- **General profile:** https://feras-profile.vercel.app/
- **Humain-targeted variant:** https://feras-profile.vercel.app/humain
- **GitHub repo:** https://github.com/LambaLab/feras-profile

## Tech Stack
- **Vite 5** + **React 19** + **TypeScript 5**
- **Tailwind CSS 3** (v3 explicitly — do NOT upgrade to v4, it breaks the config)
- **react-router-dom v7** (BrowserRouter, two routes: `/` and `/humain`)
- **Vitest** + React Testing Library (62 tests, all passing)
- **Vercel** (auto-deploys on every push to `main`)

## Running Locally
```bash
# Node is managed via nvm — always use explicit paths:
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run dev
# Tests:
~/.nvm/versions/node/v25.7.0/bin/node ./node_modules/.bin/vitest run
# Build:
~/.nvm/versions/node/v25.7.0/bin/node ~/.nvm/versions/node/v25.7.0/bin/npm run build
```

## Architecture

### Routing
- `/` → `<App profile={profile} />` — general LinkedIn-style profile
- `/humain` → `<App profile={profileHumain} />` — Humain-targeted variant (Travel & Entertainment)
- `vercel.json` has SPA rewrite rules so both routes work on reload

### Data Layer (single source of truth)
- `src/data/profileData.ts` — main profile data (all 12 experience entries, skills, posts, etc.)
- `src/data/profileDataHumain.ts` — Humain variant: spreads `profile` and overrides headline, about, FlyAkeed/Zid/Tihama descriptions, pinned skills, 2 posts

### Component Structure
```
src/components/
  header/       ProfileCard, ActionButtons, SectionNav
  about/        AboutSection
  experience/   ExperienceSection, ExperienceCard (with bullet parsing), RoleBadge
  skills/       SkillsSection, PinnedSkills, SkillPill
  education/    EducationSection, CertificationList, LanguageList
  activity/     ActivitySection, PostCard
  shared/       SectionWrapper, ShowMoreText, CompanyLogo
```

### Design Tokens (Tailwind)
LinkedIn colors defined in `tailwind.config.ts`:
- `li-blue` = #0A66C2 (primary)
- `li-blue-dark` = #004182
- `li-blue-light` = #EBF3FB
- `li-bg` = #F3F2EE (page background)
- `li-border` = #E0DFDC
- `shadow-li-card` = LinkedIn card shadow

### Key Patterns
- **Experience descriptions**: parsed at render time — first `\n\n`-separated block = intro paragraph, subsequent lines = bullet list. Collapsed by default, expanded on "…see more".
- **Company logos**: Clearbit API (`https://logo.clearbit.com/{domain}`) with deterministic-color initials fallback on error.
- **Action buttons mobile**: `flex-1` Connect + small `···` circle (matching LinkedIn mobile). Desktop: Connect + Message + More pills in a row.
- **Profile photo stacking**: photo container needs `relative` class to stack above the `relative`-positioned banner (CSS painting order fix).

## Profile Content
- **Person**: Feras H. Al-Bader, Chief Commercial & Revenue Officer at FlyAkeed
- **Photo**: `public/profile-photo.jpg`
- **Banner**: `public/banner.jpg` (Saudi national emblem on textured background)
- **Email**: nasserff@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/nasserff/
- **12 experience entries**, **2 KFUPM degrees**, **3 Miller Heiman certs**, **2 languages**, **80+ skills**, **3 posts**, **1 featured article**

## Humain Variant (`/humain`)
Targets Feras for an executive role at Humain (Saudi PIF AI company) in Travel & Entertainment sectors:
- Headline leads with "AI-Powered Commercial Leader | Travel Tech · Entertainment & Retail"
- About opens with Saudi Arabia / world's third-largest AI market hook
- FlyAkeed: repositioned as "AI-powered corporate travel platform", AI SDR bullet first
- Zid: repositioned around retail, entertainment, F&B merchants
- Tihama: surfaced as media & entertainment conglomerate
- Pinned skills: AI-Powered Growth · Travel Tech · Entertainment & Retail GTM
- Posts 1 & 2: Travel AI and Entertainment AI thought leadership

## Files Reference
| File | Purpose |
|------|---------|
| `src/App.tsx` | Main layout, accepts `profile` prop, scroll tracking for SectionNav |
| `src/main.tsx` | BrowserRouter + two Routes |
| `src/data/profileData.ts` | All profile data + TypeScript interfaces |
| `src/data/profileDataHumain.ts` | Humain override data |
| `src/index.css` | Global styles: smooth scroll, mobile edge-to-edge cards |
| `tailwind.config.ts` | LinkedIn design tokens, custom shadow |
| `vite.config.ts` | Uses `defineConfig` from `vitest/config` (not `vite`) — required for test types |
| `tsconfig.app.json` | Excludes test files from build |
| `vercel.json` | SPA rewrite rules for Vite routing |
| `public/profile-photo.jpg` | Real profile photo |
| `public/banner.jpg` | Saudi emblem banner |

## Important Notes
- **Do NOT upgrade Tailwind to v4** — was intentionally pinned to v3
- **`vite.config.ts` imports from `vitest/config`** not `vite` — changing this breaks TypeScript types for tests
- **`npm`/`node` commands need explicit paths** — use `~/.nvm/versions/node/v25.7.0/bin/node` prefix
- **All 62 tests must pass** before pushing — run vitest before any commit
- **Vercel auto-deploys** on every push to `main` (~30s deploy time)

## Exported Assets
- `Feras-Al-Bader-Profile.docx` (in parent folder) — full profile content exported as Word doc for easy editing in Google Docs
- `generate-profile-doc.js` (in parent folder) — script that generated the docx
