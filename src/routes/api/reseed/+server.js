import { seedDatabase } from '$lib/server/seed';
import { json } from '@sveltejs/kit';

export async function POST() {
  try {
    await seedDatabase();
    return json({ success: true });
  } catch (error) {
    console.error('Error seeding database:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
} 