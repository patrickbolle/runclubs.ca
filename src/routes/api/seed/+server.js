import { seedDatabase } from '$lib/server/seed';

export async function POST({ platform }) {
  if (platform?.env) {
    await seedDatabase(platform.env);
    return new Response('Database seeded successfully');
  }
  return new Response('No database connection available', { status: 500 });
} 