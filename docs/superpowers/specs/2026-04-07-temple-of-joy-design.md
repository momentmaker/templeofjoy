# Temple of Joy -- Design Spec

A community directory for devotees of Paramhansa Yogananda across all lineages, celebrating how they serve the world through their gifts.

**Tagline:** Joy expressed through service

**Domain:** templeofjoy.org

## Philosophy

"Temple" is the body -- the vessel through which we serve. "Joy" is the essence we share when we offer our gifts to others. Temple of Joy is a living directory of Yogananda's devotees who are doing exactly that.

The directory is lineage-neutral: Ananda, SRF, Kriya Yoga International, independent practitioners -- all are welcome. The tone is warm, personal, and story-forward. This is not a marketplace. It is a celebration of joy expressed through service.

## Tech Stack

- **Framework:** Astro (static site generator with content collections)
- **Hosting:** GitHub Pages
- **Form handling:** Formspree (free tier, 50 submissions/month)
- **Automation:** GitHub Actions (Formspree webhook triggers PR creation)
- **Newsletter:** Listmonk (existing instance at ../listmonk)
- **Repository:** Public on GitHub

## Site Structure

### Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Hero with tagline, featured/recent listings, CTAs to browse and submit |
| Directory | `/directory/` | Browse, filter, search all listings |
| Profile | `/directory/{slug}/` | Individual devotee listing |
| Submit | `/submit/` | Submission form with warm introduction |
| About | `/about/` | Meaning of Temple of Joy, origin story, who maintains it |

### Navigation

Simple top nav: Home, Directory, Submit, About. Sticky header. Newsletter subscribe in footer.

## Listing Profile

### Required Fields

| Field | Type | Notes |
|-------|------|-------|
| Display name | Text | However they want to be known (full name, first name, spiritual name) |
| Location: Country | Dropdown | Standardized, filterable |
| Location: City | Text | Display + text search |
| Location: State/Region | Text | Display + text search |
| Connection to the teachings | Textarea | "How did you come to Yogananda's teachings?" -- serves as both story and light verification |
| Offerings | Multi-select | Categories (Practice, Creative, Service) + tags within each |
| Description | Textarea | A few sentences about what they offer and how it serves others |
| Contact method | Select | How they prefer to be reached: website, email, or social media |
| Contact value | URL/Email | The actual link or email address for their chosen contact method |

### Optional Fields

| Field | Type | Notes |
|-------|------|-------|
| Photo | URL / emailed | Downloaded into repo during PR review. Default shown if absent (lotus, spiritual eye, or initials) |
| Community/lineage | Text | Ananda, SRF, Kriya Yoga International, independent, etc. |
| Website URL | URL | Primary website |
| Additional links | URLs (up to 4) | Social media, portfolio, shop, music |
| Available for | Multi-select | In-person, virtual, travel, collaboration |
| Open to mentorship | Boolean | Willing to connect with newer seekers |
| Guiding quote | Textarea | A Yogananda quote that inspires their work |
| Joy in Action | Textarea | A short moment/story of joy through their service |
| Other tags | Text | Suggest tags not in the predefined list |

### Offering Categories and Tags

**Practice:** meditation teaching, yoga, Kriya instruction, Ayurveda, energy healing, counseling, spiritual direction

**Creative:** music/kirtan, visual art, writing/poetry, photography, film, crafts/handmade goods

**Service:** professional skills, community organizing, seva projects, mentorship, event hosting

Tags are predefined with an "Other" free text option. New tags are added to the official list organically as patterns emerge during submission review.

## Directory Page

- **Default view:** Grid of cards showing photo (or default), display name, location, top tags
- **Filters:** Category toggles (Practice, Creative, Service), country dropdown, tag filter
- **Search:** Free text matching against name, description, city, tags
- **Clicking a card** opens the full profile page

## Submission Flow

### What the devotee experiences

1. Visits `/submit/` -- warm intro: "Share your gifts with the community"
2. Fills out the form -- friendly labels, helpful placeholders
3. Submits -- thank you message: "We've received your submission and will review it shortly"

### What happens behind the scenes

1. Form data submitted to Formspree (free tier)
2. Formspree webhook triggers a GitHub Action
3. GitHub Action creates a markdown file with listing data and opens a PR
4. Maintainer reviews the PR:
   - Checks content for fit
   - Adjusts tags if needed
   - Downloads photo into repo if URL provided
   - Normalizes "Other" tags (add to official list if warranted)
5. Merge -- GitHub Pages rebuilds, listing goes live

### Updates to existing listings

Same form with an "I'm updating an existing listing" toggle. The form includes a hidden slug field (auto-generated from display name on first submission, e.g., `sarah-k`). For updates, the devotee enters their display name; the GitHub Action matches against existing file slugs to find and modify the correct file. If no match is found, the Action flags it for manual review. Opens an update PR rather than a new listing PR.

## Visual Design

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#073763` | Headings, primary text, buttons |
| Cream | `#FFFBEE` | Page backgrounds |
| Warm Stone | `#F8F6F1` | Section backgrounds, cards |
| Sage | `#7D8B6E` | Secondary text, accents |
| Warm Gold | `#C8B88A` | Subtle highlights, borders |
| Swami Ochre | `#C4762B` | Tagline, spiritual accents |

### Typography

- **Headings:** Serif (Georgia or similar) -- elegant, spiritual, readable
- **Body:** Sans-serif (Inter or Open Sans) -- clean, modern, accessible

### Design Elements

- Rounded corners (12-20px) -- warm, not corporate
- Generous whitespace -- breathing room
- Soft card shadows -- subtle depth
- Warm photography when available; lotus/spiritual eye/initials defaults for missing photos
- Mobile-first, responsive

### Design Reference

Inspired by ananda.org's warmth (cream, gold, navy) but softened with earthy neutrals and sage. Gold reserved for subtle accents. Swami ochre used sparingly for spiritual emphasis (tagline, quotes). Lineage-neutral -- welcoming to all Yogananda traditions.

## Newsletter Integration

- **Service:** Listmonk (existing instance)
- **Subscribe form:** In site footer, calls listmonk API directly (requires listmonk instance to be publicly accessible with CORS configured for templeofjoy.org)
- **Content:** Weekly digest -- new listings, community news, curated highlights
- **Member highlights:** Interview Q&A format featuring individual devotees (future content type)

## Homepage Features

- Hero section with tagline ("Joy expressed through service" in swami ochre)
- Featured/recent listings as cards
- Yogananda quotes from devotee profiles (randomly selected at build time, refreshed on each deploy)
- "Joy in Action" micro-stories from devotee profiles (randomly selected at build time)
- CTA buttons: "Browse Directory" and "Share Your Gifts"
- Newsletter subscribe section

## Content Storage

Listings stored as markdown files with YAML frontmatter in the Astro content collection:

```
src/content/devotees/
  sarah-k.md
  ravi-meditation.md
  ...
```

Each file contains structured frontmatter (all fields) and a markdown body (connection story, description, joy in action story).

## Scope

### v1 (this spec)

- Home, Directory, Profile, Submit, About pages
- Listing profiles with all required and optional fields
- Formspree + GitHub Actions submission pipeline
- Category/country/tag filtering and search
- Listmonk newsletter subscribe form in footer
- Responsive, mobile-first design
- GitHub Pages deployment

### v2+ (documented in docs/FUTURE_IDEAS.md)

Seeds of Joy board, Seva Exchange, Path Timeline, QR codes for retreats, curated newsletter content, Community Constellation visualization, Annual report, Meditation Mode, Map view, Collaboration board, Mentorship matching, Multilingual support.

## Verification Model

Submissions are curated, not gatekept. The "Connection to the teachings" field serves as natural self-identification. Every submission is reviewed before merging. The review should feel like a welcome, not a checkpoint. If something doesn't fit, it's a gentle conversation.

## Non-Goals

- No pricing on listings (not a marketplace)
- No credentials/certifications (not a résumé site)
- No reviews/ratings (not a commerce platform)
- No user accounts or login system
- No CMS admin panel -- content managed via GitHub
