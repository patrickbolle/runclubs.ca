import vancouver from '../data/vancouver.json' assert { type: 'json' };
import toronto from '../data/toronto.json' assert { type: 'json' };
import kitchenerWaterloo from '../data/kitchener-waterloo.json' assert { type: 'json' };
import { db } from './db';

const cities = [
  { data: vancouver, slug: 'vancouver' },
  { data: toronto, slug: 'toronto' },
  { data: kitchenerWaterloo, slug: 'kitchener-waterloo' }
];

export async function seedDatabase() {
  for (const { data, slug } of cities) {
    // Insert city
    const cityResult = await db.query(
      'INSERT INTO cities (slug, name, description) VALUES ($1, $2, $3) RETURNING id',
      [slug, data.city, data.description]
    );
    const cityId = cityResult.rows[0].id;

    // Insert run clubs
    for (const club of data.clubs) {
      await db.query(`
        INSERT INTO clubs (
          slug, name, day, time, location, description, 
          instagram, facebook, cityId
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        club.id,
        club.name,
        club.day,
        club.time,
        club.location || '',
        club.description,
        club.socialMedia.instagram,
        club.socialMedia.facebook,
        cityId
      ]);
    }
    
    console.log(`Seeded city: ${data.city}`);
  }
} 