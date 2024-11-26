import dotenv from 'dotenv';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

function parseEvents(day, time) {
  if (!day || !time) return [];
  const days = day.split(',').map(d => d.trim());
  const times = time.split(',').map(t => t.trim());
  return days.map((d, i) => ({
    day_of_week: d,
    start_time: times[i] || times[0]
  }));
}

async function importClubs() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Read the new clubs data
    const data = JSON.parse(await fs.readFile('new-clubs.json', 'utf8'));

    // Process each city
    for (const [citySlug, cityData] of Object.entries(data)) {
      // Check if city exists
      let { rows: [city] } = await client.query(
        'SELECT id FROM cities WHERE slug = $1',
        [citySlug]
      );

      // Create city if it doesn't exist
      if (!city) {
        console.log(`Creating new city: ${citySlug}`);
        const cityId = uuidv4();
        await client.query(`
          INSERT INTO cities (id, slug, name)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [cityId, citySlug, citySlug.charAt(0).toUpperCase() + citySlug.slice(1)]);
        
        city = { id: cityId };
      }

      // Import clubs for this city
      for (const club of cityData.clubs) {
        console.log(`Importing ${club.name}...`);

        // Check if club already exists
        const { rows: existing } = await client.query(
          'SELECT id FROM clubs WHERE slug = $1',
          [club.id]
        );

        if (existing.length > 0) {
          console.log(`Club ${club.id} already exists, skipping...`);
          continue;
        }

        // Insert club
        const clubId = uuidv4();
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
          city.id
        ]);

        // Create events
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

        console.log(`Imported ${club.name} successfully`);
      }
    }

    await client.query('COMMIT');
    console.log('Import completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Import failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

importClubs()
  .then(() => {
    console.log('Import completed, exiting...');
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  }); 