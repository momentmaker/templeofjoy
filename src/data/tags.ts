export const categories = ['Practice', 'Creative', 'Service'] as const;

export type Category = (typeof categories)[number];

export const tagsByCategory: Record<Category, string[]> = {
  Practice: [
    'meditation-teaching',
    'yoga',
    'kriya-instruction',
    'ayurveda',
    'energy-healing',
    'intuitive-mediumship',
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
