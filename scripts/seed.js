import pool from '../src/lib/db/client.js';
import vancouver from '../src/lib/data/vancouver.json' assert { type: 'json' };
import toronto from '../src/lib/data/toronto.json' assert { type: 'json' };
import kitchenerWaterloo from '../src/lib/data/kitchener-waterloo.json' assert { type: 'json' };

async function seed() {
  try {
    // Clear existing data
    await pool.query('DELETE FROM clubs');
    await pool.query('DELETE FROM cities');
    
    const cities = [
      { data: vancouver, slug: 'vancouver' },
      { data: toronto, slug: 'toronto' },
      { data: kitchenerWaterloo, slug: 'kitchener-waterloo' }
    ];

    for (const { data, slug } of cities) {
      // Insert city
      const { rows: [city] } = await pool.query(
        'INSERT INTO cities (slug, name, description) VALUES ($1, $2, $3) RETURNING id',
        [slug, data.city, data.description]
      );

      // Insert run clubs
      for (const club of data.clubs) {
        await pool.query(`
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
          city.id
        ]);
      }
      
      console.log(`Seeded city: ${data.city}`);
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seed(); 