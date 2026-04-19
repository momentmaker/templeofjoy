import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Published at https://templeofjoy.org/devotees.json
//
// Consumers (e.g. yogananda.app's `/d/<slug>` redirector) read this to map
// each devotee slug to their canonical Temple of Joy profile URL. Keep the
// shape minimal: anything beyond { slug, url } belongs in the Astro pages
// or in a richer feed under a separate path.

interface DevoteeLink {
  slug: string;
  url: string;
}

export const GET: APIRoute = async () => {
  const devotees = await getCollection("devotees");
  const data: DevoteeLink[] = devotees
    .map((d) => ({
      slug: d.id,
      url: `https://templeofjoy.org/community/${d.id}`,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
