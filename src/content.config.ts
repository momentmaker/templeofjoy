import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const devotees = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devotees' }),
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
