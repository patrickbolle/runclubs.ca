import dotenv from 'dotenv';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import vancouver from '../src/lib/data/vancouver.json' assert { type: 'json' };
import toronto from '../src/lib/data/toronto.json' assert { type: 'json' };
import kitchenerWaterloo from '../src/lib/data/kitchener-waterloo.json' assert { type: 'json' };

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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

async function reseedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('TRUNCATE TABLE club_events CASCADE');
    await client.query('TRUNCATE TABLE clubs CASCADE');
    await client.query('TRUNCATE TABLE cities CASCADE');

    for (const { data, slug } of cities) {
      // Insert city with UUID
      const cityId = uuidv4();
      await client.query(
        'INSERT INTO cities (id, slug, name, description) VALUES ($1, $2, $3, $4)',
        [cityId, slug, data.city, data.description]
      );

      // Insert clubs with UUIDs
      for (const club of data.clubs) {
        const clubId = uuidv4();
        await client.query(`
          INSERT INTO clubs (
            id, slug, name, location, description,
            instagram, facebook, "cityId", status
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

        // Insert events
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
      
      console.log(`Seeded city: ${data.city}`);
    }

    await client.query('COMMIT');
    console.log('Database reseeded successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error reseeding database:', error);
    throw error;
  } finally {
    client.release();
  }
}

reseedDatabase()
  .then(() => {
    console.log('Reseeding completed, exiting...');
    process.exit(0);
  })
  .catch(error => {
    console.error('Reseeding failed:', error);
    process.exit(1);
  }); 