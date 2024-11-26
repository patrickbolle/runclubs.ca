import vancouver from '../data/vancouver.json' assert { type: 'json' };
import toronto from '../data/toronto.json' assert { type: 'json' };
import kitchenerWaterloo from '../data/kitchener-waterloo.json' assert { type: 'json' };
import { v4 as uuidv4 } from 'uuid';
import pg from 'pg';
import { DATABASE_URL, NODE_ENV } from '$env/static/private';

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const cities = [
  { data: vancouver, slug: 'vancouver' },
  { data: toronto, slug: 'toronto' },
  { data: kitchenerWaterloo, slug: 'kitchener-waterloo' }
];

function parseEvents(day, time) {
  if (!day || !time) return [];
  const days = day.split(',').map(d => d.trim());
  const times = time.split(',').map(t => t.trim());
  return days.map((d, i) => ({
    day_of_week: d,
    start_time: times[i] || times[0]
  }));
}

export async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('TRUNCATE TABLE club_events CASCADE');
    await client.query('TRUNCATE TABLE clubs CASCADE');
    await client.query('TRUNCATE TABLE cities CASCADE');

    // Insert cities
    for (const { data, slug } of cities) {
      const cityId = uuidv4();
      console.log(`Creating city ${data.city} with ID ${cityId}`);
      
      await client.query(`
        INSERT INTO cities (id, slug, name, description)
        VALUES ($1, $2, $3, $4)
      `, [cityId, slug, data.city, data.description]);

      // Insert clubs for this city
      for (const club of data.clubs) {
        const clubId = uuidv4();
        console.log(`Creating club ${club.name} with ID ${clubId}`);

        await client.query(`
          INSERT INTO clubs (
            id, slug, name, location, description,
            instagram, facebook, city_id, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved')
        `, [
          clubId,
          club.id,
          club.name,
          club.location || '',
          club.description,
          club.socialMedia?.instagram || '',
          club.socialMedia?.facebook || '',
          cityId
        ]);

        // Create events for this club
        if (club.day && club.time) {
          const events = parseEvents(club.day, club.time);
          for (const event of events) {
            await client.query(`
              INSERT INTO club_events (
                id, club_id, day_of_week, start_time
              ) VALUES ($1, $2, $3, $4)
            `, [
              uuidv4(),
              clubId,
              event.day_of_week,
              event.start_time
            ]);
          }
        }
      }
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
} 