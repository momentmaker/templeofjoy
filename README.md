# Temple of Joy

**Joy expressed through service**

A community directory for devotees of Paramhansa Yogananda across all lineages -- celebrating how they serve the world through practice, creativity, and heartfelt service.

[templeofjoy.org](https://templeofjoy.org)

## What is this?

Temple of Joy is a living directory where devotees can share their gifts with the community. Whether you teach meditation, create devotional art, offer healing, or serve in any other way -- your offering belongs here.

The name carries a meaning: *temple* is the body, the vessel through which we serve. *Joy* is the essence we share when we offer ourselves fully to others.

## How it works

1. A devotee fills out the [submission form](https://templeofjoy.org/submit/)
2. The form triggers a pull request with their listing
3. A maintainer reviews and merges
4. The site rebuilds and the listing goes live

## Tech stack

- **Site:** [Astro](https://astro.build) static site on GitHub Pages
- **Submissions:** Cloudflare Worker at `submit.templeofjoy.org`
- **Automation:** GitHub Actions creates PRs from submissions
- **Newsletter:** [Listmonk](https://listmonk.app) via CF Worker proxy

## Development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

## Adding a listing manually

Create a markdown file in `src/content/devotees/`:

```markdown
---
displayName: "Your Name"
country: "Country"
city: "City"
stateRegion: "State"
categories: ["Practice", "Creative", "Service"]
tags: ["meditation-teaching", "music-kirtan"]
description: "What you offer."
contactMethod: "email"
contactValue: "you@example.com"
dateAdded: 2026-04-07
---

Your connection to the teachings goes here as the markdown body.
```

## License

MIT
