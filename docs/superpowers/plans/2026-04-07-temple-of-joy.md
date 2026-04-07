# Temple of Joy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static community directory for Yogananda devotees at templeofjoy.org with form-based submissions and newsletter integration.

**Architecture:** Astro static site with content collections for listings (markdown + YAML frontmatter). Formspree handles form submission. GitHub Actions deploy to GitHub Pages and provide semi-automated listing creation via `workflow_dispatch`. Listmonk handles newsletter subscriptions.

**Tech Stack:** Astro 5, GitHub Pages, Formspree, GitHub Actions, Listmonk

**Spec:** `docs/superpowers/specs/2026-04-07-temple-of-joy-design.md`

---

## File Structure

```
templeofjoy/
├── .github/
│   └── workflows/
│       ├── deploy.yml                    # GitHub Pages deployment on push to main
│       └── create-listing.yml            # workflow_dispatch: paste JSON → PR
├── .gitignore
├── astro.config.mjs                      # Astro config: static output, site URL
├── package.json
├── tsconfig.json
├── public/
│   ├── CNAME                             # Custom domain: templeofjoy.org
│   └── default-avatar.svg               # Default profile image (lotus motif)
├── src/
│   ├── content/
│   │   └── config.ts                     # Content collection schema (Zod)
│   ├── content/
│   │   └── devotees/                     # Listing markdown files
│   │       ├── ananda-devi.md            # Example listing
│   │       └── ravi-kumar.md             # Example listing
│   ├── data/
│   │   ├── countries.ts                  # Country list for dropdown + filtering
│   │   └── tags.ts                       # Predefined offering tags by category
│   ├── layouts/
│   │   └── BaseLayout.astro              # HTML shell, head, nav, footer
│   ├── components/
│   │   ├── Header.astro                  # Sticky nav: Home, Directory, Submit, About
│   │   ├── Footer.astro                  # Footer with newsletter subscribe form
│   │   ├── ListingCard.astro             # Card for directory grid
│   │   ├── FilterBar.astro               # Category toggles, country dropdown, tag filter
│   │   ├── SearchBar.astro               # Free text search input
│   │   └── NewsletterForm.astro          # Listmonk subscribe form
│   ├── pages/
│   │   ├── index.astro                   # Home: hero, featured, quotes, CTAs
│   │   ├── about.astro                   # About: philosophy, origin story
│   │   ├── submit.astro                  # Submit: Formspree form
│   │   └── directory/
│   │       ├── index.astro               # Directory: browse, filter, search
│   │       └── [...slug].astro           # Profile: individual devotee page
│   └── styles/
│       └── global.css                    # Design system: tokens, typography, base styles
└── docs/
    ├── FUTURE_IDEAS.md
    └── superpowers/
        ├── specs/
        │   └── 2026-04-07-temple-of-joy-design.md
        └── plans/
            └── 2026-04-07-temple-of-joy.md  # This file
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `public/CNAME`
- Modify: `.gitignore`

- [ ] **Step 1: Initialize Astro project**

```bash
cd /Users/rubberduck/GitHub/momentmaker/templeofjoy
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

Select defaults if prompted. This creates `package.json`, `astro.config.mjs`, `tsconfig.json`, and the `src/` directory.

- [ ] **Step 2: Configure Astro for GitHub Pages**

Replace `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://templeofjoy.org',
  output: 'static',
});
```

- [ ] **Step 3: Create CNAME for custom domain**

Create `public/CNAME`:

```
templeofjoy.org
```

- [ ] **Step 4: Update .gitignore**

Replace `.gitignore` with:

```
node_modules/
dist/
.astro/
.superpowers/
.DS_Store
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds, `dist/` directory created.

- [ ] **Step 6: Commit**

```bash
git init
git add package.json astro.config.mjs tsconfig.json public/CNAME .gitignore src/
git commit -m "feat: scaffold Astro project for Temple of Joy"
```

---

## Task 2: Design System

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global CSS with design tokens**

Create `src/styles/global.css`:

```css
:root {
  --color-navy: #073763;
  --color-cream: #FFFBEE;
  --color-stone: #F8F6F1;
  --color-sage: #7D8B6E;
  --color-gold: #C8B88A;
  --color-ochre: #C4762B;
  --color-white: #FFFFFF;

  --font-heading: Georgia, 'Times New Roman', serif;
  --font-body: Inter, 'Open Sans', system-ui, sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  --shadow-card: 0 2px 8px rgba(7, 55, 99, 0.06);
  --shadow-card-hover: 0 4px 16px rgba(7, 55, 99, 0.1);

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  --max-width: 1200px;
  --header-height: 72px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-body);
  color: var(--color-navy);
  background: var(--color-cream);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  line-height: 1.3;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }

a {
  color: var(--color-navy);
  text-decoration-color: var(--color-gold);
  text-underline-offset: 3px;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-ochre);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: var(--color-navy);
  color: var(--color-cream);
}

.btn-primary:hover {
  background: #0a4a80;
  color: var(--color-cream);
}

.btn-outline {
  background: transparent;
  color: var(--color-navy);
  border: 1.5px solid var(--color-navy);
}

.btn-outline:hover {
  background: var(--color-navy);
  color: var(--color-cream);
}

.tag {
  display: inline-block;
  padding: 2px var(--space-sm);
  background: var(--color-stone);
  color: var(--color-sage);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.section {
  padding: var(--space-3xl) 0;
}

.section-alt {
  background: var(--color-stone);
}

@media (max-width: 768px) {
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }

  .container {
    padding: 0 var(--space-md);
  }
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add design system with color tokens and typography"
```

---

## Task 3: Base Layout + Header + Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro` (replace default)

- [ ] **Step 1: Create Header component**

Create `src/components/Header.astro`:

```astro
---
const currentPath = Astro.url.pathname;

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/directory/', label: 'Directory' },
  { href: '/submit/', label: 'Submit' },
  { href: '/about/', label: 'About' },
];
---

<header class="header">
  <div class="container header-inner">
    <a href="/" class="header-logo">
      <span class="header-title">Temple of Joy</span>
    </a>

    <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span class="hamburger"></span>
    </button>

    <nav class="header-nav" aria-label="Main navigation">
      <ul class="nav-list">
        {navLinks.map(({ href, label }) => (
          <li>
            <a
              href={href}
              class:list={['nav-link', { active: currentPath === href }]}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-cream);
    border-bottom: 1px solid var(--color-gold);
    height: var(--header-height);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .header-logo {
    text-decoration: none;
  }

  .header-title {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    color: var(--color-navy);
  }

  .nav-list {
    display: flex;
    list-style: none;
    gap: var(--space-lg);
  }

  .nav-link {
    text-decoration: none;
    font-size: 0.95rem;
    color: var(--color-navy);
    padding: var(--space-xs) 0;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s;
  }

  .nav-link:hover,
  .nav-link.active {
    border-bottom-color: var(--color-ochre);
    color: var(--color-navy);
  }

  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
  }

  .hamburger,
  .hamburger::before,
  .hamburger::after {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-navy);
    transition: transform 0.3s;
  }

  .hamburger {
    position: relative;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
  }

  .hamburger::before { top: -7px; }
  .hamburger::after { top: 7px; }

  @media (max-width: 768px) {
    .mobile-menu-toggle {
      display: block;
    }

    .header-nav {
      display: none;
      position: absolute;
      top: var(--header-height);
      left: 0;
      right: 0;
      background: var(--color-cream);
      border-bottom: 1px solid var(--color-gold);
      padding: var(--space-lg);
    }

    .header-nav.open {
      display: block;
    }

    .nav-list {
      flex-direction: column;
      gap: var(--space-md);
    }
  }
</style>

<script>
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.header-nav');

  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('open');
  });
</script>
```

- [ ] **Step 2: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <span class="footer-title">Temple of Joy</span>
      <p class="footer-tagline">Joy expressed through service</p>
    </div>

    <div class="footer-links">
      <a href="/directory/">Directory</a>
      <a href="/submit/">Submit a Listing</a>
      <a href="/about/">About</a>
    </div>

    <div class="footer-newsletter" id="newsletter-section">
      <p class="footer-newsletter-label">Stay connected</p>
      <p class="footer-newsletter-desc">Receive updates on new listings and community stories.</p>
    </div>

    <div class="footer-bottom">
      <p>&copy; {currentYear} Temple of Joy. Made with devotion.</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-navy);
    color: var(--color-cream);
    padding: var(--space-3xl) 0 var(--space-lg);
    margin-top: auto;
  }

  .footer-inner {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-2xl);
  }

  .footer-title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
  }

  .footer-tagline {
    color: var(--color-ochre);
    font-style: italic;
    font-family: var(--font-heading);
    margin-top: var(--space-xs);
    font-size: 0.9rem;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .footer-links a {
    color: var(--color-cream);
    text-decoration: none;
    font-size: 0.9rem;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .footer-links a:hover {
    opacity: 1;
    color: var(--color-cream);
  }

  .footer-newsletter-label {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    margin-bottom: var(--space-xs);
  }

  .footer-newsletter-desc {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .footer-bottom {
    grid-column: 1 / -1;
    border-top: 1px solid rgba(255, 251, 238, 0.15);
    padding-top: var(--space-lg);
    text-align: center;
    font-size: 0.8rem;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .footer-inner {
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }
  }
</style>
```

- [ ] **Step 3: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'A community directory for devotees of Paramhansa Yogananda. Joy expressed through service.' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://rsms.me/" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    <title>{title} | Temple of Joy</title>
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Replace default index page**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Home">
  <div class="container section">
    <h1>Temple of Joy</h1>
    <p>Coming soon.</p>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Verify dev server**

```bash
npm run dev
```

Visit `http://localhost:4321`. Expected: Page loads with header, "Coming soon" content, footer. Nav links visible. Mobile hamburger menu works at narrow widths.

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ src/components/Header.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add base layout with header and footer"
```

---

## Task 4: Content Collection + Sample Listings

**Files:**
- Create: `src/content/config.ts`
- Create: `src/data/countries.ts`
- Create: `src/data/tags.ts`
- Create: `src/content/devotees/ananda-devi.md`
- Create: `src/content/devotees/ravi-kumar.md`
- Create: `src/content/devotees/maria-luz.md`

- [ ] **Step 1: Create tag definitions**

Create `src/data/tags.ts`:

```ts
export const categories = ['Practice', 'Creative', 'Service'] as const;

export type Category = (typeof categories)[number];

export const tagsByCategory: Record<Category, string[]> = {
  Practice: [
    'meditation-teaching',
    'yoga',
    'kriya-instruction',
    'ayurveda',
    'energy-healing',
    'counseling',
    'spiritual-direction',
  ],
  Creative: [
    'music-kirtan',
    'visual-art',
    'writing-poetry',
    'photography',
    'film',
    'crafts-handmade',
  ],
  Service: [
    'professional-skills',
    'community-organizing',
    'seva-projects',
    'mentorship',
    'event-hosting',
  ],
};

export const allTags = Object.values(tagsByCategory).flat();

export function formatTag(tag: string): string {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

- [ ] **Step 2: Create country list**

Create `src/data/countries.ts`:

```ts
export const countries = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada',
  'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
  'Guatemala', 'Hungary', 'India', 'Indonesia', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Kenya', 'Malaysia', 'Mexico', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Romania', 'Russia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Vietnam', 'Other',
] as const;
```

- [ ] **Step 3: Create content collection schema**

Create `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const devotees = defineCollection({
  type: 'content',
  schema: z.object({
    displayName: z.string(),
    country: z.string(),
    city: z.string().optional().default(''),
    stateRegion: z.string().optional().default(''),
    categories: z.array(z.enum(['Practice', 'Creative', 'Service'])),
    tags: z.array(z.string()),
    description: z.string(),
    contactMethod: z.enum(['website', 'email', 'social']),
    contactValue: z.string(),
    photo: z.string().optional(),
    communityLineage: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    additionalLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        })
      )
      .optional()
      .default([]),
    availableFor: z
      .array(z.enum(['in-person', 'virtual', 'travel', 'collaboration']))
      .optional()
      .default([]),
    openToMentorship: z.boolean().optional().default(false),
    guidingQuote: z.string().optional(),
    joyInAction: z.string().optional(),
    dateAdded: z.coerce.date(),
  }),
});

export const collections = { devotees };
```

- [ ] **Step 4: Create sample listing -- Ananda Devi**

Create `src/content/devotees/ananda-devi.md`:

```markdown
---
displayName: "Ananda Devi"
country: "United States"
city: "Nevada City"
stateRegion: "California"
categories: ["Practice", "Creative"]
tags: ["meditation-teaching", "music-kirtan"]
description: "I offer meditation classes rooted in Yogananda's teachings and lead weekly kirtan gatherings open to all."
contactMethod: "website"
contactValue: "https://example.com/ananda-devi"
communityLineage: "Ananda"
availableFor: ["in-person", "virtual"]
openToMentorship: true
guidingQuote: "Be as simple as you can be; you will be astonished to see how uncomplicated and happy your life can become."
joyInAction: "A student came to her first meditation class in tears after losing her job. Six months later, she told me that the daily practice we built together helped her find not just peace, but a new career she loved."
dateAdded: 2026-04-07
---

I discovered Yogananda's Autobiography of a Yogi during a solo retreat in Big Sur in 2010. The book cracked something open in me. I began practicing with the Ananda community in Nevada City shortly after, and received Kriya initiation in 2012.

My offerings grew naturally from my practice. I started teaching meditation to friends, and it expanded into weekly classes. The kirtan gatherings came later -- music was always my first language, and devotional singing became the way I could share the joy I was finding on the path.
```

- [ ] **Step 5: Create sample listing -- Ravi Kumar**

Create `src/content/devotees/ravi-kumar.md`:

```markdown
---
displayName: "Ravi Kumar"
country: "India"
city: "Ranchi"
stateRegion: "Jharkhand"
categories: ["Practice", "Service"]
tags: ["yoga", "kriya-instruction", "seva-projects"]
description: "Teaching traditional yoga and Kriya techniques in the birthplace of Yogananda. Running a free yoga program for underserved communities."
contactMethod: "email"
contactValue: "ravi@example.com"
communityLineage: "YSS (Yogoda Satsanga Society)"
websiteUrl: "https://example.com/ravi-yoga"
availableFor: ["in-person"]
openToMentorship: true
guidingQuote: "The season of failure is the best time for sowing the seeds of success."
dateAdded: 2026-04-07
---

I grew up in Ranchi, just kilometers from where Yoganandaji established the Yogoda Satsanga Society. The teachings were part of my life before I could even understand them. My grandmother practiced Kriya and would tell me stories of the Masters.

I began formal practice at 16 and started teaching at 25. What moves me most is bringing yoga to people who cannot afford studio classes. Every Sunday morning, I teach a free session in the local park. Last monsoon season, 40 people showed up in the rain.
```

- [ ] **Step 6: Create sample listing -- Maria Luz**

Create `src/content/devotees/maria-luz.md`:

```markdown
---
displayName: "Maria Luz"
country: "Italy"
city: "Assisi"
stateRegion: "Umbria"
categories: ["Creative"]
tags: ["visual-art", "writing-poetry"]
description: "Devotional paintings and poetry inspired by the intersection of Yogananda's teachings and the Franciscan tradition of Assisi."
contactMethod: "social"
contactValue: "https://instagram.com/marialuz_art"
communityLineage: "Ananda"
additionalLinks:
  - label: "Art Portfolio"
    url: "https://example.com/marialuz-portfolio"
availableFor: ["virtual", "collaboration"]
guidingQuote: "The power of unfulfilled desires is the root of all man's slavery."
joyInAction: "A woman in grief commissioned a painting of light breaking through clouds. When she received it, she wrote to tell me it was the first time she had felt hope in months. That painting now hangs in a hospice where it comforts others."
dateAdded: 2026-04-07
---

I found Yogananda through the Ananda community in Assisi. Living here, surrounded by the spirit of St. Francis, I felt an immediate resonance between his path of divine love and Yogananda's teachings on cosmic consciousness.

My art is my sadhana. Each painting begins with meditation, and the images that come are gifts from that stillness. I paint what I see in the inner eye -- light, devotion, the landscapes of the soul.
```

- [ ] **Step 7: Create default avatar SVG**

Create `public/default-avatar.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="100" fill="#F8F6F1"/>
  <g transform="translate(100, 85)">
    <ellipse cx="0" cy="20" rx="28" ry="36" fill="#C8B88A" opacity="0.3"/>
    <ellipse cx="0" cy="8" rx="22" ry="30" fill="#C8B88A" opacity="0.4"/>
    <ellipse cx="0" cy="-2" rx="16" ry="24" fill="#C8B88A" opacity="0.5"/>
    <ellipse cx="0" cy="-10" rx="10" ry="18" fill="#C8B88A" opacity="0.6"/>
    <ellipse cx="0" cy="-16" rx="5" ry="12" fill="#C8B88A" opacity="0.8"/>
    <circle cx="0" cy="-24" r="3" fill="#C4762B"/>
  </g>
</svg>
```

This is a minimal lotus/spiritual eye motif in the project colors.

- [ ] **Step 8: Verify build with content collection**

```bash
npm run build
```

Expected: Build succeeds. Astro validates all three devotee files against the schema. If schema validation fails, fix the frontmatter.

- [ ] **Step 9: Commit**

```bash
git add src/content/ src/data/ public/default-avatar.svg
git commit -m "feat: add content collection schema and sample listings"
```

---

## Task 5: Directory Page + Listing Cards

**Files:**
- Create: `src/components/ListingCard.astro`
- Create: `src/pages/directory/index.astro`

- [ ] **Step 1: Create ListingCard component**

Create `src/components/ListingCard.astro`:

```astro
---
import { formatTag } from '../data/tags';

interface Props {
  slug: string;
  displayName: string;
  country: string;
  city?: string;
  stateRegion?: string;
  categories: string[];
  tags: string[];
  description: string;
  photo?: string;
}

const { slug, displayName, country, city, stateRegion, categories, tags, description, photo } = Astro.props;

const locationParts = [city, stateRegion, country].filter(Boolean);
const locationString = locationParts.join(', ');
const displayTags = tags.slice(0, 3);
const searchableText = [displayName, description, city, stateRegion, country, ...tags].join(' ').toLowerCase();
---

<a
  href={`/directory/${slug}/`}
  class="listing-card"
  data-categories={categories.join(',')}
  data-tags={tags.join(',')}
  data-country={country}
  data-searchable={searchableText}
>
  <div class="card-photo">
    {photo ? (
      <img src={photo} alt={displayName} loading="lazy" />
    ) : (
      <img src="/default-avatar.svg" alt="" class="default-avatar" />
    )}
  </div>

  <div class="card-body">
    <h3 class="card-name">{displayName}</h3>
    <p class="card-location">{locationString}</p>
    <p class="card-description">{description}</p>
    <div class="card-tags">
      {displayTags.map((tag) => (
        <span class="tag">{formatTag(tag)}</span>
      ))}
    </div>
  </div>
</a>

<style>
  .listing-card {
    display: flex;
    flex-direction: column;
    background: var(--color-white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    text-decoration: none;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .listing-card:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }

  .card-photo {
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--color-stone);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-photo .default-avatar {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }

  .card-body {
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    flex: 1;
  }

  .card-name {
    font-size: 1.15rem;
    color: var(--color-navy);
  }

  .card-location {
    font-size: 0.85rem;
    color: var(--color-sage);
  }

  .card-description {
    font-size: 0.9rem;
    color: var(--color-navy);
    opacity: 0.8;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
  }
</style>
```

- [ ] **Step 2: Create directory page**

Create `src/pages/directory/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ListingCard from '../../components/ListingCard.astro';
import { getCollection } from 'astro:content';

const devotees = await getCollection('devotees');
const sorted = devotees.sort((a, b) =>
  b.data.dateAdded.getTime() - a.data.dateAdded.getTime()
);
---

<BaseLayout title="Directory" description="Browse the community directory of Yogananda's devotees and their offerings.">
  <div class="section">
    <div class="container">
      <div class="directory-header">
        <h1>Directory</h1>
        <p class="directory-subtitle">Discover devotees and their offerings</p>
      </div>

      <div class="directory-grid" id="directory-grid">
        {sorted.map((devotee) => (
          <ListingCard
            slug={devotee.slug}
            displayName={devotee.data.displayName}
            country={devotee.data.country}
            city={devotee.data.city}
            stateRegion={devotee.data.stateRegion}
            categories={devotee.data.categories}
            tags={devotee.data.tags}
            description={devotee.data.description}
            photo={devotee.data.photo}
          />
        ))}
      </div>

      <div class="no-results" id="no-results" style="display: none;">
        <p>No listings match your filters. Try broadening your search.</p>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .directory-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
  }

  .directory-subtitle {
    color: var(--color-sage);
    font-size: 1.1rem;
    margin-top: var(--space-sm);
  }

  .directory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-lg);
  }

  .no-results {
    text-align: center;
    padding: var(--space-3xl);
    color: var(--color-sage);
  }
</style>
```

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Visit `http://localhost:4321/directory/`. Expected: Three sample listing cards displayed in a grid with names, locations, descriptions, and tags.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds. `dist/directory/index.html` exists.

- [ ] **Step 5: Commit**

```bash
git add src/components/ListingCard.astro src/pages/directory/
git commit -m "feat: add directory page with listing cards"
```

---

## Task 6: Profile Pages

**Files:**
- Create: `src/pages/directory/[...slug].astro`

- [ ] **Step 1: Create dynamic profile page**

Create `src/pages/directory/[...slug].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';
import { formatTag } from '../../data/tags';

export async function getStaticPaths() {
  const devotees = await getCollection('devotees');
  return devotees.map((devotee) => ({
    params: { slug: devotee.slug },
    props: { devotee },
  }));
}

const { devotee } = Astro.props;
const { data } = devotee;
const { Content } = await render(devotee);

const locationParts = [data.city, data.stateRegion, data.country].filter(Boolean);
const locationString = locationParts.join(', ');

function contactLabel(method: string): string {
  if (method === 'website') return 'Visit Website';
  if (method === 'email') return 'Send Email';
  return 'Connect';
}

function contactHref(method: string, value: string): string {
  if (method === 'email') return `mailto:${value}`;
  return value;
}
---

<BaseLayout
  title={data.displayName}
  description={`${data.displayName} — ${data.description}`}
>
  <div class="section">
    <div class="container profile">
      <div class="profile-header">
        <div class="profile-photo">
          {data.photo ? (
            <img src={data.photo} alt={data.displayName} />
          ) : (
            <img src="/default-avatar.svg" alt="" class="default-avatar" />
          )}
        </div>

        <div class="profile-info">
          <h1>{data.displayName}</h1>
          <p class="profile-location">{locationString}</p>
          {data.communityLineage && (
            <p class="profile-lineage">{data.communityLineage}</p>
          )}

          <div class="profile-tags">
            {data.categories.map((cat) => (
              <span class="tag category-tag">{cat}</span>
            ))}
            {data.tags.map((tag) => (
              <span class="tag">{formatTag(tag)}</span>
            ))}
          </div>

          {data.availableFor.length > 0 && (
            <p class="profile-available">
              Available for: {data.availableFor.join(', ')}
            </p>
          )}

          {data.openToMentorship && (
            <p class="profile-mentorship">Open to mentorship</p>
          )}
        </div>
      </div>

      {data.guidingQuote && (
        <blockquote class="profile-quote">
          <p>"{data.guidingQuote}"</p>
          <cite>— Paramhansa Yogananda</cite>
        </blockquote>
      )}

      <div class="profile-section">
        <h2>About</h2>
        <p>{data.description}</p>
      </div>

      <div class="profile-section">
        <h2>My Path</h2>
        <div class="profile-story">
          <Content />
        </div>
      </div>

      {data.joyInAction && (
        <div class="profile-section joy-section">
          <h2>Joy in Action</h2>
          <p>{data.joyInAction}</p>
        </div>
      )}

      <div class="profile-contact">
        <a
          href={contactHref(data.contactMethod, data.contactValue)}
          class="btn btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {contactLabel(data.contactMethod)}
        </a>

        {data.websiteUrl && data.contactMethod !== 'website' && (
          <a
            href={data.websiteUrl}
            class="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
          </a>
        )}

        {data.additionalLinks.map((link) => (
          <a
            href={link.url}
            class="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div class="profile-back">
        <a href="/directory/">&larr; Back to Directory</a>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .profile {
    max-width: 800px;
  }

  .profile-header {
    display: flex;
    gap: var(--space-xl);
    align-items: flex-start;
    margin-bottom: var(--space-2xl);
  }

  .profile-photo {
    width: 180px;
    height: 180px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-stone);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-photo .default-avatar {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .profile-location {
    color: var(--color-sage);
    font-size: 1.05rem;
  }

  .profile-lineage {
    color: var(--color-sage);
    font-size: 0.9rem;
    font-style: italic;
  }

  .profile-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-xs);
  }

  .category-tag {
    background: var(--color-navy);
    color: var(--color-cream);
  }

  .profile-available,
  .profile-mentorship {
    font-size: 0.85rem;
    color: var(--color-sage);
  }

  .profile-mentorship {
    color: var(--color-ochre);
    font-weight: 500;
  }

  .profile-quote {
    background: var(--color-stone);
    border-left: 3px solid var(--color-ochre);
    padding: var(--space-lg);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    margin-bottom: var(--space-2xl);
  }

  .profile-quote p {
    font-family: var(--font-heading);
    font-size: 1.15rem;
    font-style: italic;
    color: var(--color-navy);
  }

  .profile-quote cite {
    display: block;
    margin-top: var(--space-sm);
    font-size: 0.85rem;
    color: var(--color-sage);
    font-style: normal;
  }

  .profile-section {
    margin-bottom: var(--space-2xl);
  }

  .profile-section h2 {
    font-size: 1.3rem;
    margin-bottom: var(--space-md);
    color: var(--color-navy);
  }

  .profile-story {
    line-height: 1.8;
  }

  .joy-section {
    background: var(--color-stone);
    padding: var(--space-lg);
    border-radius: var(--radius-md);
  }

  .profile-contact {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    margin-bottom: var(--space-2xl);
    padding-top: var(--space-xl);
    border-top: 1px solid var(--color-gold);
  }

  .profile-back {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .profile-photo {
      width: 140px;
      height: 140px;
    }

    .profile-tags {
      justify-content: center;
    }
  }
</style>
```

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Visit `http://localhost:4321/directory/ananda-devi/`. Expected: Full profile page with photo placeholder, name, location, tags, quote, story, joy in action, and contact button. Check all three profiles.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds. `dist/directory/ananda-devi/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add src/pages/directory/\[...slug\].astro
git commit -m "feat: add individual profile pages"
```

---

## Task 7: Directory Filtering + Search

**Files:**
- Create: `src/components/FilterBar.astro`
- Create: `src/components/SearchBar.astro`
- Modify: `src/pages/directory/index.astro`

- [ ] **Step 1: Create SearchBar component**

Create `src/components/SearchBar.astro`:

```astro
<div class="search-bar">
  <input
    type="text"
    id="directory-search"
    placeholder="Search by name, offering, or location..."
    class="search-input"
    autocomplete="off"
  />
</div>

<style>
  .search-bar {
    margin-bottom: var(--space-lg);
  }

  .search-input {
    width: 100%;
    padding: var(--space-md) var(--space-lg);
    border: 1.5px solid var(--color-gold);
    border-radius: var(--radius-lg);
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--color-navy);
    background: var(--color-white);
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input::placeholder {
    color: var(--color-sage);
    opacity: 0.7;
  }

  .search-input:focus {
    border-color: var(--color-navy);
  }
</style>
```

- [ ] **Step 2: Create FilterBar component**

Create `src/components/FilterBar.astro`:

```astro
---
import { getCollection } from 'astro:content';
import { formatTag, tagsByCategory } from '../data/tags';

const devotees = await getCollection('devotees');
const usedCountries = [...new Set(devotees.map((d) => d.data.country))].sort();
const usedTags = [...new Set(devotees.flatMap((d) => d.data.tags))].sort();
---

<div class="filter-bar">
  <div class="filter-group">
    <label class="filter-label">Category</label>
    <div class="filter-toggles" id="category-filters">
      <button class="filter-toggle active" data-category="all">All</button>
      <button class="filter-toggle" data-category="Practice">Practice</button>
      <button class="filter-toggle" data-category="Creative">Creative</button>
      <button class="filter-toggle" data-category="Service">Service</button>
    </div>
  </div>

  <div class="filter-group">
    <label class="filter-label" for="country-filter">Country</label>
    <select id="country-filter" class="filter-select">
      <option value="">All Countries</option>
      {usedCountries.map((country) => (
        <option value={country}>{country}</option>
      ))}
    </select>
  </div>

  <div class="filter-group">
    <label class="filter-label" for="tag-filter">Offering</label>
    <select id="tag-filter" class="filter-select">
      <option value="">All Offerings</option>
      {usedTags.map((tag) => (
        <option value={tag}>{formatTag(tag)}</option>
      ))}
    </select>
  </div>
</div>

<style>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    align-items: flex-end;
    margin-bottom: var(--space-xl);
    padding: var(--space-lg);
    background: var(--color-stone);
    border-radius: var(--radius-md);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .filter-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-sage);
  }

  .filter-toggles {
    display: flex;
    gap: var(--space-xs);
  }

  .filter-toggle {
    padding: var(--space-xs) var(--space-md);
    border: 1.5px solid var(--color-gold);
    border-radius: var(--radius-lg);
    background: var(--color-white);
    color: var(--color-navy);
    font-family: var(--font-body);
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .filter-toggle.active {
    background: var(--color-navy);
    color: var(--color-cream);
    border-color: var(--color-navy);
  }

  .filter-select {
    padding: var(--space-sm) var(--space-md);
    border: 1.5px solid var(--color-gold);
    border-radius: var(--radius-md);
    background: var(--color-white);
    color: var(--color-navy);
    font-family: var(--font-body);
    font-size: 0.9rem;
    min-width: 180px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .filter-bar {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-toggles {
      flex-wrap: wrap;
    }

    .filter-select {
      width: 100%;
    }
  }
</style>
```

- [ ] **Step 3: Add filters and search to directory page**

Replace `src/pages/directory/index.astro` with:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import ListingCard from '../../components/ListingCard.astro';
import SearchBar from '../../components/SearchBar.astro';
import FilterBar from '../../components/FilterBar.astro';
import { getCollection } from 'astro:content';

const devotees = await getCollection('devotees');
const sorted = devotees.sort((a, b) =>
  b.data.dateAdded.getTime() - a.data.dateAdded.getTime()
);
---

<BaseLayout title="Directory" description="Browse the community directory of Yogananda's devotees and their offerings.">
  <div class="section">
    <div class="container">
      <div class="directory-header">
        <h1>Directory</h1>
        <p class="directory-subtitle">Discover devotees and their offerings</p>
      </div>

      <SearchBar />
      <FilterBar />

      <div class="directory-grid" id="directory-grid">
        {sorted.map((devotee) => (
          <ListingCard
            slug={devotee.slug}
            displayName={devotee.data.displayName}
            country={devotee.data.country}
            city={devotee.data.city}
            stateRegion={devotee.data.stateRegion}
            categories={devotee.data.categories}
            tags={devotee.data.tags}
            description={devotee.data.description}
            photo={devotee.data.photo}
          />
        ))}
      </div>

      <div class="no-results" id="no-results" style="display: none;">
        <p>No listings match your filters. Try broadening your search.</p>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .directory-header {
    text-align: center;
    margin-bottom: var(--space-2xl);
  }

  .directory-subtitle {
    color: var(--color-sage);
    font-size: 1.1rem;
    margin-top: var(--space-sm);
  }

  .directory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-lg);
  }

  .no-results {
    text-align: center;
    padding: var(--space-3xl);
    color: var(--color-sage);
  }
</style>

<script>
  function initFilters() {
    const grid = document.getElementById('directory-grid');
    const noResults = document.getElementById('no-results');
    const searchInput = document.getElementById('directory-search') as HTMLInputElement;
    const countrySelect = document.getElementById('country-filter') as HTMLSelectElement;
    const tagSelect = document.getElementById('tag-filter') as HTMLSelectElement;
    const categoryBtns = document.querySelectorAll('[data-category]');

    if (!grid || !searchInput || !countrySelect || !tagSelect) return;

    let activeCategory = 'all';

    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = (btn as HTMLElement).dataset.category || 'all';
        applyFilters();
      });
    });

    searchInput.addEventListener('input', applyFilters);
    countrySelect.addEventListener('change', applyFilters);
    tagSelect.addEventListener('change', applyFilters);

    function applyFilters() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const selectedCountry = countrySelect.value;
      const selectedTag = tagSelect.value;
      const cards = grid.querySelectorAll<HTMLElement>('.listing-card');
      let visibleCount = 0;

      cards.forEach((card) => {
        const categories = card.dataset.categories || '';
        const tags = card.dataset.tags || '';
        const country = card.dataset.country || '';
        const searchable = card.dataset.searchable || '';

        const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
        const matchesCountry = !selectedCountry || country === selectedCountry;
        const matchesTag = !selectedTag || tags.includes(selectedTag);
        const matchesSearch = !searchTerm || searchable.includes(searchTerm);

        const visible = matchesCategory && matchesCountry && matchesTag && matchesSearch;
        card.style.display = visible ? '' : 'none';
        if (visible) visibleCount++;
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? '' : 'none';
      }
    }
  }

  initFilters();
</script>
```

- [ ] **Step 4: Verify dev server**

```bash
npm run dev
```

Visit `http://localhost:4321/directory/`. Test:
- Category toggles show/hide cards correctly
- Country dropdown filters
- Tag dropdown filters
- Search input filters by text
- "No results" message appears when nothing matches
- Filters combine (e.g., category + country)

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/SearchBar.astro src/components/FilterBar.astro src/pages/directory/index.astro
git commit -m "feat: add directory filtering and search"
```

---

## Task 8: Home Page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build complete home page**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ListingCard from '../components/ListingCard.astro';
import { getCollection } from 'astro:content';

const devotees = await getCollection('devotees');
const recent = devotees
  .sort((a, b) => b.data.dateAdded.getTime() - a.data.dateAdded.getTime())
  .slice(0, 6);

const withQuotes = devotees.filter((d) => d.data.guidingQuote);
const featuredQuote = withQuotes.length > 0
  ? withQuotes[Math.floor(Math.random() * withQuotes.length)]
  : null;

const withStories = devotees.filter((d) => d.data.joyInAction);
const featuredStory = withStories.length > 0
  ? withStories[Math.floor(Math.random() * withStories.length)]
  : null;
---

<BaseLayout title="Home">
  <section class="hero">
    <div class="container hero-inner">
      <h1 class="hero-title">Temple of Joy</h1>
      <p class="hero-tagline">Joy expressed through service</p>
      <p class="hero-description">
        A community directory for devotees of Paramhansa Yogananda.
        Discover how fellow seekers share their gifts with the world.
      </p>
      <div class="hero-actions">
        <a href="/directory/" class="btn btn-primary">Browse Directory</a>
        <a href="/submit/" class="btn btn-outline">Share Your Gifts</a>
      </div>
    </div>
  </section>

  {featuredQuote && (
    <section class="section quote-section">
      <div class="container">
        <blockquote class="home-quote">
          <p>"{featuredQuote.data.guidingQuote}"</p>
          <cite>
            — Paramhansa Yogananda, shared by
            <a href={`/directory/${featuredQuote.slug}/`}>{featuredQuote.data.displayName}</a>
          </cite>
        </blockquote>
      </div>
    </section>
  )}

  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">Recent Listings</h2>
      <div class="home-grid">
        {recent.map((devotee) => (
          <ListingCard
            slug={devotee.slug}
            displayName={devotee.data.displayName}
            country={devotee.data.country}
            city={devotee.data.city}
            stateRegion={devotee.data.stateRegion}
            categories={devotee.data.categories}
            tags={devotee.data.tags}
            description={devotee.data.description}
            photo={devotee.data.photo}
          />
        ))}
      </div>
      <div class="section-cta">
        <a href="/directory/" class="btn btn-outline">View All Listings</a>
      </div>
    </div>
  </section>

  {featuredStory && (
    <section class="section">
      <div class="container">
        <h2 class="section-title">Joy in Action</h2>
        <div class="home-story">
          <p class="story-text">"{featuredStory.data.joyInAction}"</p>
          <p class="story-attribution">
            — <a href={`/directory/${featuredStory.slug}/`}>{featuredStory.data.displayName}</a>,
            {featuredStory.data.city && `${featuredStory.data.city}, `}{featuredStory.data.country}
          </p>
        </div>
      </div>
    </section>
  )}

  <section class="section section-alt">
    <div class="container cta-section">
      <h2>Share Your Gifts</h2>
      <p>Are you a devotee of Yogananda with offerings to share? Join the directory.</p>
      <a href="/submit/" class="btn btn-primary">Submit Your Listing</a>
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    background: linear-gradient(135deg, var(--color-cream) 0%, var(--color-stone) 100%);
    padding: var(--space-3xl) 0;
    text-align: center;
  }

  .hero-inner {
    max-width: 700px;
  }

  .hero-title {
    font-size: 3rem;
    color: var(--color-navy);
    margin-bottom: var(--space-sm);
  }

  .hero-tagline {
    font-family: var(--font-heading);
    font-style: italic;
    font-size: 1.3rem;
    color: var(--color-ochre);
    margin-bottom: var(--space-lg);
  }

  .hero-description {
    font-size: 1.1rem;
    color: var(--color-navy);
    opacity: 0.8;
    margin-bottom: var(--space-xl);
    line-height: 1.7;
  }

  .hero-actions {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    flex-wrap: wrap;
  }

  .quote-section {
    text-align: center;
    padding: var(--space-2xl) 0;
  }

  .home-quote {
    max-width: 700px;
    margin: 0 auto;
  }

  .home-quote p {
    font-family: var(--font-heading);
    font-size: 1.4rem;
    font-style: italic;
    color: var(--color-navy);
    line-height: 1.6;
  }

  .home-quote cite {
    display: block;
    margin-top: var(--space-md);
    font-size: 0.9rem;
    color: var(--color-sage);
    font-style: normal;
  }

  .home-quote cite a {
    color: var(--color-ochre);
  }

  .section-title {
    text-align: center;
    margin-bottom: var(--space-xl);
  }

  .home-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-lg);
  }

  .section-cta {
    text-align: center;
    margin-top: var(--space-xl);
  }

  .home-story {
    max-width: 700px;
    margin: 0 auto;
    background: var(--color-stone);
    padding: var(--space-xl);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--color-ochre);
  }

  .story-text {
    font-size: 1.05rem;
    font-style: italic;
    line-height: 1.8;
    color: var(--color-navy);
  }

  .story-attribution {
    margin-top: var(--space-md);
    font-size: 0.9rem;
    color: var(--color-sage);
  }

  .story-attribution a {
    color: var(--color-ochre);
  }

  .cta-section {
    text-align: center;
    max-width: 500px;
  }

  .cta-section p {
    margin: var(--space-md) 0 var(--space-lg);
    color: var(--color-sage);
  }

  @media (max-width: 768px) {
    .hero-title { font-size: 2rem; }
    .hero-tagline { font-size: 1.1rem; }
    .home-quote p { font-size: 1.15rem; }
  }
</style>
```

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Visit `http://localhost:4321/`. Expected: Hero with tagline in ochre, quote block, recent listings grid, joy in action story, CTA section.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page with hero, quotes, and stories"
```

---

## Task 9: Submit Page

**Files:**
- Create: `src/pages/submit.astro`

Note: Requires a Formspree account. Create a form at https://formspree.io and replace `YOUR_FORMSPREE_FORM_ID` with the actual form ID.

- [ ] **Step 1: Create submit page with Formspree form**

Create `src/pages/submit.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { countries } from '../data/countries';
import { tagsByCategory, formatTag } from '../data/tags';

const formspreeId = 'YOUR_FORMSPREE_FORM_ID';
---

<BaseLayout title="Submit" description="Share your gifts with the Temple of Joy community. Submit your listing to the directory.">
  <div class="section">
    <div class="container submit-page">
      <div class="submit-intro">
        <h1>Share Your Gifts</h1>
        <p>
          Temple of Joy celebrates how devotees of Yogananda serve the world.
          Whether you teach, create, heal, or serve — your offering belongs here.
        </p>
        <p class="submit-note">
          All submissions are reviewed before publishing. We'll be in touch if we have questions.
        </p>
      </div>

      <form
        id="submit-form"
        action={`https://formspree.io/f/${formspreeId}`}
        method="POST"
        class="submit-form"
      >
        <div class="form-section">
          <h2>About You</h2>

          <div class="form-field">
            <label for="displayName">Display Name <span class="required">*</span></label>
            <input type="text" id="displayName" name="displayName" required
              placeholder="How you'd like to be known (full name, first name, spiritual name)" />
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="country">Country <span class="required">*</span></label>
              <select id="country" name="country" required>
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div class="form-field">
              <label for="city">City</label>
              <input type="text" id="city" name="city" placeholder="Your city" />
            </div>

            <div class="form-field">
              <label for="stateRegion">State / Region</label>
              <input type="text" id="stateRegion" name="stateRegion" placeholder="State or region" />
            </div>
          </div>

          <div class="form-field">
            <label for="communityLineage">Community / Lineage</label>
            <input type="text" id="communityLineage" name="communityLineage"
              placeholder="e.g., Ananda, SRF, YSS, independent" />
          </div>

          <div class="form-field">
            <label for="photoUrl">Photo URL (optional)</label>
            <input type="url" id="photoUrl" name="photoUrl"
              placeholder="Link to your photo, or email it to us" />
            <p class="field-hint">You can also email a photo to us after submitting.</p>
          </div>
        </div>

        <div class="form-section">
          <h2>Your Path</h2>

          <div class="form-field">
            <label for="connectionToTeachings">How did you come to Yogananda's teachings? <span class="required">*</span></label>
            <textarea id="connectionToTeachings" name="connectionToTeachings" rows="5" required
              placeholder="Share your story -- how you found the path, what drew you in, where you practice..."></textarea>
          </div>

          <div class="form-field">
            <label for="guidingQuote">A Yogananda quote that guides your work</label>
            <textarea id="guidingQuote" name="guidingQuote" rows="2"
              placeholder="A favorite quote from the Master that inspires what you do"></textarea>
          </div>
        </div>

        <div class="form-section">
          <h2>Your Offerings</h2>

          <div class="form-field">
            <label>Categories <span class="required">*</span></label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" name="categories" value="Practice" /> Practice
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="categories" value="Creative" /> Creative
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="categories" value="Service" /> Service
              </label>
            </div>
          </div>

          {Object.entries(tagsByCategory).map(([category, tags]) => (
            <div class="form-field tag-group" data-for-category={category}>
              <label>{category} Tags</label>
              <div class="checkbox-group">
                {tags.map((tag) => (
                  <label class="checkbox-label">
                    <input type="checkbox" name="tags" value={tag} /> {formatTag(tag)}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div class="form-field">
            <label for="otherTags">Other tags (if not listed above)</label>
            <input type="text" id="otherTags" name="otherTags"
              placeholder="Separate with commas" />
          </div>

          <div class="form-field">
            <label for="description">Describe your offerings <span class="required">*</span></label>
            <textarea id="description" name="description" rows="4" required
              placeholder="A few sentences about what you offer and how it serves others"></textarea>
          </div>

          <div class="form-field">
            <label for="joyInAction">Joy in Action (optional)</label>
            <textarea id="joyInAction" name="joyInAction" rows="4"
              placeholder="Share a moment when your work brought someone joy -- a specific story that captures what you do"></textarea>
          </div>

          <div class="form-field">
            <label>Available for</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" name="availableFor" value="in-person" /> In-person
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="availableFor" value="virtual" /> Virtual
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="availableFor" value="travel" /> Travel
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="availableFor" value="collaboration" /> Collaboration
              </label>
            </div>
          </div>

          <div class="form-field">
            <label class="checkbox-label single-check">
              <input type="checkbox" name="openToMentorship" value="true" />
              I'm open to mentoring newer seekers
            </label>
          </div>
        </div>

        <div class="form-section">
          <h2>Contact</h2>

          <div class="form-field">
            <label for="contactMethod">Preferred contact method <span class="required">*</span></label>
            <select id="contactMethod" name="contactMethod" required>
              <option value="">Select</option>
              <option value="website">Website</option>
              <option value="email">Email</option>
              <option value="social">Social Media</option>
            </select>
          </div>

          <div class="form-field">
            <label for="contactValue">Contact link or email <span class="required">*</span></label>
            <input type="text" id="contactValue" name="contactValue" required
              placeholder="URL or email address" />
          </div>

          <div class="form-field">
            <label for="websiteUrl">Website (if different from above)</label>
            <input type="url" id="websiteUrl" name="websiteUrl" placeholder="https://" />
          </div>

          <div class="form-field">
            <label>Additional Links (up to 4)</label>
            <div class="link-inputs">
              <div class="link-row">
                <input type="text" name="linkLabel1" placeholder="Label (e.g., Instagram)" />
                <input type="url" name="linkUrl1" placeholder="https://" />
              </div>
              <div class="link-row">
                <input type="text" name="linkLabel2" placeholder="Label" />
                <input type="url" name="linkUrl2" placeholder="https://" />
              </div>
              <div class="link-row">
                <input type="text" name="linkLabel3" placeholder="Label" />
                <input type="url" name="linkUrl3" placeholder="https://" />
              </div>
              <div class="link-row">
                <input type="text" name="linkLabel4" placeholder="Label" />
                <input type="url" name="linkUrl4" placeholder="https://" />
              </div>
            </div>
          </div>
        </div>

        <div class="form-field">
          <label class="checkbox-label single-check">
            <input type="checkbox" name="isUpdate" value="true" />
            I'm updating an existing listing
          </label>
        </div>

        <button type="submit" class="btn btn-primary submit-btn">Submit Your Listing</button>
      </form>

      <div id="thank-you" class="thank-you" style="display: none;">
        <h2>Thank you!</h2>
        <p>We've received your submission and will review it shortly. Welcome to the Temple of Joy.</p>
        <a href="/" class="btn btn-outline">Return Home</a>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .submit-page {
    max-width: 700px;
  }

  .submit-intro {
    margin-bottom: var(--space-2xl);
  }

  .submit-intro h1 {
    margin-bottom: var(--space-md);
  }

  .submit-note {
    font-size: 0.9rem;
    color: var(--color-sage);
    font-style: italic;
    margin-top: var(--space-sm);
  }

  .form-section {
    margin-bottom: var(--space-2xl);
    padding-bottom: var(--space-xl);
    border-bottom: 1px solid var(--color-gold);
  }

  .form-section h2 {
    font-size: 1.3rem;
    margin-bottom: var(--space-lg);
    color: var(--color-navy);
  }

  .form-field {
    margin-bottom: var(--space-lg);
  }

  .form-field > label {
    display: block;
    margin-bottom: var(--space-xs);
    font-weight: 500;
    font-size: 0.95rem;
  }

  .required {
    color: var(--color-ochre);
  }

  .field-hint {
    font-size: 0.8rem;
    color: var(--color-sage);
    margin-top: var(--space-xs);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--space-md);
  }

  input[type="text"],
  input[type="url"],
  input[type="email"],
  select,
  textarea {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: 1.5px solid var(--color-gold);
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--color-navy);
    background: var(--color-white);
    transition: border-color 0.2s;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-navy);
  }

  textarea {
    resize: vertical;
  }

  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm) var(--space-lg);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 0.9rem;
    cursor: pointer;
  }

  .single-check {
    font-size: 0.95rem;
  }

  .link-inputs {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .link-row {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--space-sm);
  }

  .submit-btn {
    width: 100%;
    padding: var(--space-md);
    font-size: 1.1rem;
    margin-top: var(--space-lg);
  }

  .thank-you {
    text-align: center;
    padding: var(--space-3xl) 0;
  }

  .thank-you h2 {
    margin-bottom: var(--space-md);
    color: var(--color-ochre);
  }

  .thank-you p {
    margin-bottom: var(--space-xl);
    color: var(--color-sage);
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .link-row {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  const form = document.getElementById('submit-form') as HTMLFormElement;
  const thankYou = document.getElementById('thank-you');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.style.display = 'none';
        if (thankYou) thankYou.style.display = '';
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    }
  });

  const categoryCheckboxes = document.querySelectorAll<HTMLInputElement>('input[name="categories"]');
  const tagGroups = document.querySelectorAll<HTMLElement>('.tag-group');

  function updateTagVisibility() {
    const checked = Array.from(categoryCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    tagGroups.forEach((group) => {
      const category = group.dataset.forCategory || '';
      group.style.display = checked.includes(category) ? '' : 'none';
    });
  }

  categoryCheckboxes.forEach((cb) => cb.addEventListener('change', updateTagVisibility));
  updateTagVisibility();
</script>
```

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Visit `http://localhost:4321/submit/`. Test:
- All form fields render correctly
- Category checkboxes show/hide relevant tag groups
- Required fields prevent submission when empty
- Form layout is responsive on mobile

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/submit.astro
git commit -m "feat: add submission form with Formspree integration"
```

---

## Task 10: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="The meaning behind Temple of Joy and how this community directory came to be.">
  <div class="section">
    <div class="container about-page">
      <h1>About Temple of Joy</h1>

      <div class="about-section">
        <h2>The Meaning</h2>
        <p>
          In spiritual tradition, the <em>temple</em> is the body — the vessel through
          which we serve. <em>Joy</em> is the essence we share when we offer our gifts
          to others. Temple of Joy is a living directory of Yogananda's devotees who
          are doing exactly that.
        </p>
      </div>

      <div class="about-section">
        <h2>Why This Exists</h2>
        <p>
          Devotees of Paramhansa Yogananda are everywhere — teaching meditation in
          California, painting devotional art in Italy, running free yoga programs in
          India, writing poetry in Brazil. But finding each other isn't easy. We rely
          on word of mouth, social media groups, and chance encounters at retreats.
        </p>
        <p>
          Temple of Joy bridges that gap. It's a place where devotees across all
          lineages — Ananda, SRF, YSS, Kriya Yoga International, and independent
          practitioners — can share what they do and be found by those who need
          their gifts.
        </p>
      </div>

      <div class="about-section">
        <h2>How It Started</h2>
        <p>
          The idea was born on a drive home from a spiritual retreat. A friend said,
          "Wouldn't it be amazing if there was a place where devotees could list what
          they offer?" That simple question became this directory.
        </p>
      </div>

      <div class="about-section">
        <h2>What This Is Not</h2>
        <p>
          Temple of Joy is not a marketplace. There are no prices, ratings, or reviews.
          It's a celebration of how devotees express joy through service — a community
          resource, not a commercial platform.
        </p>
      </div>

      <div class="about-section">
        <h2>Join Us</h2>
        <p>
          If you're a devotee of Yogananda with gifts to share, we'd love to include
          you. <a href="/submit/">Submit your listing</a> and become part of this
          growing community.
        </p>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .about-page {
    max-width: 700px;
  }

  .about-page h1 {
    margin-bottom: var(--space-2xl);
  }

  .about-section {
    margin-bottom: var(--space-2xl);
  }

  .about-section h2 {
    font-size: 1.3rem;
    margin-bottom: var(--space-md);
    color: var(--color-navy);
  }

  .about-section p {
    line-height: 1.8;
    margin-bottom: var(--space-md);
  }

  .about-section em {
    color: var(--color-ochre);
    font-style: italic;
  }

  .about-section a {
    color: var(--color-ochre);
    font-weight: 500;
  }
</style>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
```

---

## Task 11: Newsletter Subscribe Form

**Files:**
- Create: `src/components/NewsletterForm.astro`
- Modify: `src/components/Footer.astro`

Note: Replace `LISTMONK_API_URL` with the actual listmonk instance URL and `LISTMONK_LIST_UUID` with the public list UUID.

- [ ] **Step 1: Create NewsletterForm component**

Create `src/components/NewsletterForm.astro`:

```astro
---
const listmonkUrl = 'LISTMONK_API_URL';
const listUuid = 'LISTMONK_LIST_UUID';
---

<form id="newsletter-form" class="newsletter-form" data-url={listmonkUrl} data-list={listUuid}>
  <div class="newsletter-input-group">
    <input
      type="email"
      name="email"
      placeholder="Your email address"
      required
      class="newsletter-input"
    />
    <button type="submit" class="newsletter-btn">Subscribe</button>
  </div>
  <p id="newsletter-status" class="newsletter-status"></p>
</form>

<style>
  .newsletter-form {
    margin-top: var(--space-md);
  }

  .newsletter-input-group {
    display: flex;
    gap: var(--space-sm);
  }

  .newsletter-input {
    flex: 1;
    padding: var(--space-sm) var(--space-md);
    border: 1.5px solid rgba(255, 251, 238, 0.3);
    border-radius: var(--radius-md);
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-cream);
    font-family: var(--font-body);
    font-size: 0.9rem;
  }

  .newsletter-input::placeholder {
    color: rgba(255, 251, 238, 0.5);
  }

  .newsletter-input:focus {
    outline: none;
    border-color: var(--color-ochre);
  }

  .newsletter-btn {
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-ochre);
    color: var(--color-cream);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .newsletter-btn:hover {
    background: #a8612a;
  }

  .newsletter-status {
    font-size: 0.8rem;
    margin-top: var(--space-xs);
    min-height: 1.2em;
  }

  @media (max-width: 768px) {
    .newsletter-input-group {
      flex-direction: column;
    }
  }
</style>

<script>
  const form = document.getElementById('newsletter-form') as HTMLFormElement;
  const status = document.getElementById('newsletter-status');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = new FormData(form).get('email') as string;
    const url = form.dataset.url;
    const listUuid = form.dataset.list;

    if (!url || !listUuid || !status) return;

    try {
      const res = await fetch(`${url}/api/public/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          list_uuids: [listUuid],
        }),
      });

      if (res.ok) {
        status.textContent = 'Thank you! Check your email to confirm.';
        status.style.color = '#C4762B';
        form.reset();
      } else {
        status.textContent = 'Something went wrong. Please try again.';
        status.style.color = '#cc5555';
      }
    } catch {
      status.textContent = 'Could not connect. Please try again later.';
      status.style.color = '#cc5555';
    }
  });
</script>
```

- [ ] **Step 2: Add NewsletterForm to Footer**

In `src/components/Footer.astro`, replace the newsletter placeholder block:

Find this block:
```astro
    <div class="footer-newsletter" id="newsletter-section">
      <p class="footer-newsletter-label">Stay connected</p>
      <p class="footer-newsletter-desc">Receive updates on new listings and community stories.</p>
    </div>
```

Replace with:
```astro
    <div class="footer-newsletter" id="newsletter-section">
      <p class="footer-newsletter-label">Stay connected</p>
      <p class="footer-newsletter-desc">Receive updates on new listings and community stories.</p>
      <NewsletterForm />
    </div>
```

Also add the import at the top of the frontmatter:
```astro
---
import NewsletterForm from './NewsletterForm.astro';
const currentYear = new Date().getFullYear();
---
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Newsletter form visible in footer on all pages.

- [ ] **Step 4: Commit**

```bash
git add src/components/NewsletterForm.astro src/components/Footer.astro
git commit -m "feat: add newsletter subscribe form with listmonk integration"
```

---

## Task 12: GitHub Pages Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deployment workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify build locally**

```bash
npm run build
```

Expected: Build succeeds. Deployment will activate once pushed to GitHub and Pages is enabled in repo settings.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Pages deployment workflow"
```

---

## Task 13: Listing Creation Workflow

**Files:**
- Create: `.github/workflows/create-listing.yml`

This workflow lets the maintainer paste Formspree submission JSON and auto-create a PR with the new listing file. Triggered manually via `workflow_dispatch`.

- [ ] **Step 1: Create listing creation workflow**

Create `.github/workflows/create-listing.yml`:

```yaml
name: Create Listing from Submission

on:
  workflow_dispatch:
    inputs:
      submission_json:
        description: 'Paste the Formspree submission JSON'
        required: true
        type: string

permissions:
  contents: write
  pull-requests: write

jobs:
  create-listing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Parse submission and create listing file
        id: create
        uses: actions/github-script@v7
        with:
          script: |
            const data = JSON.parse(process.env.SUBMISSION_JSON);

            const slug = data.displayName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');

            const categories = Array.isArray(data.categories)
              ? data.categories
              : [data.categories].filter(Boolean);

            const tags = Array.isArray(data.tags)
              ? data.tags
              : [data.tags].filter(Boolean);

            const availableFor = Array.isArray(data.availableFor)
              ? data.availableFor
              : [data.availableFor].filter(Boolean);

            const links = [];
            for (let i = 1; i <= 4; i++) {
              const label = data[`linkLabel${i}`];
              const url = data[`linkUrl${i}`];
              if (label && url) links.push({ label, url });
            }

            const today = new Date().toISOString().split('T')[0];

            let frontmatter = `---\n`;
            frontmatter += `displayName: "${data.displayName}"\n`;
            frontmatter += `country: "${data.country}"\n`;
            if (data.city) frontmatter += `city: "${data.city}"\n`;
            if (data.stateRegion) frontmatter += `stateRegion: "${data.stateRegion}"\n`;
            frontmatter += `categories: [${categories.map(c => `"${c}"`).join(', ')}]\n`;
            frontmatter += `tags: [${tags.map(t => `"${t}"`).join(', ')}]\n`;
            frontmatter += `description: "${data.description.replace(/"/g, '\\"')}"\n`;
            frontmatter += `contactMethod: "${data.contactMethod}"\n`;
            frontmatter += `contactValue: "${data.contactValue}"\n`;
            if (data.photoUrl) frontmatter += `photo: "${data.photoUrl}"\n`;
            if (data.communityLineage) frontmatter += `communityLineage: "${data.communityLineage}"\n`;
            if (data.websiteUrl) frontmatter += `websiteUrl: "${data.websiteUrl}"\n`;
            if (links.length > 0) {
              frontmatter += `additionalLinks:\n`;
              links.forEach(l => {
                frontmatter += `  - label: "${l.label}"\n`;
                frontmatter += `    url: "${l.url}"\n`;
              });
            }
            if (availableFor.length > 0) {
              frontmatter += `availableFor: [${availableFor.map(a => `"${a}"`).join(', ')}]\n`;
            }
            if (data.openToMentorship === 'true') frontmatter += `openToMentorship: true\n`;
            if (data.guidingQuote) frontmatter += `guidingQuote: "${data.guidingQuote.replace(/"/g, '\\"')}"\n`;
            if (data.joyInAction) frontmatter += `joyInAction: "${data.joyInAction.replace(/"/g, '\\"')}"\n`;
            frontmatter += `dateAdded: ${today}\n`;
            frontmatter += `---\n\n`;

            const body = data.connectionToTeachings || '';
            const content = frontmatter + body + '\n';

            const filePath = `src/content/devotees/${slug}.md`;
            const branchName = `listing/${slug}`;
            const isUpdate = data.isUpdate === 'true';

            core.setOutput('slug', slug);
            core.setOutput('file_path', filePath);
            core.setOutput('branch_name', branchName);
            core.setOutput('content', content);
            core.setOutput('display_name', data.displayName);
            core.setOutput('is_update', isUpdate.toString());
        env:
          SUBMISSION_JSON: ${{ inputs.submission_json }}

      - name: Write listing file
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const path = require('path');
            const filePath = '${{ steps.create.outputs.file_path }}';
            const dir = path.dirname(filePath);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(filePath, process.env.LISTING_CONTENT);
        env:
          LISTING_CONTENT: ${{ steps.create.outputs.content }}

      - name: Create branch, commit, and push
        run: |
          git config user.name "Temple of Joy Bot"
          git config user.email "bot@templeofjoy.org"
          git checkout -b "${{ steps.create.outputs.branch_name }}"
          git add "${{ steps.create.outputs.file_path }}"
          git commit -m "feat: add listing for ${{ steps.create.outputs.display_name }}"
          git push origin "${{ steps.create.outputs.branch_name }}"

      - name: Create pull request
        uses: actions/github-script@v7
        with:
          script: |
            const isUpdate = '${{ steps.create.outputs.is_update }}' === 'true';
            const prefix = isUpdate ? 'Update' : 'New';

            await github.rest.pulls.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `${prefix} listing: ${{ steps.create.outputs.display_name }}`,
              body: `## ${prefix} Listing Submission\n\n**Name:** ${{ steps.create.outputs.display_name }}\n**File:** \`${{ steps.create.outputs.file_path }}\`\n\nReview the listing content and merge when ready. The site will auto-deploy.`,
              head: '${{ steps.create.outputs.branch_name }}',
              base: 'main',
            });
```

- [ ] **Step 2: Verify YAML syntax**

```bash
npx yaml-lint .github/workflows/create-listing.yml || python3 -c "import yaml; yaml.safe_load(open('.github/workflows/create-listing.yml'))"
```

Expected: No syntax errors.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/create-listing.yml
git commit -m "feat: add listing creation workflow via workflow_dispatch"
```

---

## Post-Implementation Checklist

After all tasks are complete:

- [ ] Run `npm run build` -- full build succeeds
- [ ] Run `npm run dev` and manually verify all pages:
  - Home: hero, tagline in ochre, quote, stories, recent listings, CTAs
  - Directory: cards render, filters work, search works, "no results" shows
  - Profile: all fields display, quote block, joy in action, contact links
  - Submit: all fields render, category-tag show/hide works, responsive
  - About: content renders, links work
  - Footer: newsletter form visible on all pages
  - Navigation: all links work, mobile hamburger works
- [ ] Replace `YOUR_FORMSPREE_FORM_ID` in `src/pages/submit.astro` with actual Formspree form ID
- [ ] Replace `LISTMONK_API_URL` and `LISTMONK_LIST_UUID` in `src/components/NewsletterForm.astro`
- [ ] Push to GitHub, enable GitHub Pages in repo settings (Source: GitHub Actions)
- [ ] Configure custom domain (templeofjoy.org) in GitHub Pages settings
- [ ] Test the deployed site
