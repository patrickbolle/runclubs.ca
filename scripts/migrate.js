import { db } from '../src/lib/server/db.js';
import { v4 as uuidv4 } from 'uuid';

async function migrate() {
  try {
    // Create temporary tables with new schema
    await db.query(`
      CREATE TABLE cities_new (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE clubs_new (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        day TEXT,
        time TEXT,
        location TEXT,
        description TEXT,
        instagram TEXT,
        facebook TEXT,
        "cityId" UUID REFERENCES cities_new(id),
        status VARCHAR(50) DEFAULT 'approved',
        submitter_email VARCHAR(255),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        reviewed_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migrate cities data
    const { rows: cities } = await db.query('SELECT * FROM cities');
    for (const city of cities) {
      await db.query(`
        INSERT INTO cities_new (id, slug, name, description)
        VALUES ($1, $2, $3, $4)
      `, [uuidv4(), city.slug, city.name, city.description]);
    }

    // Migrate clubs data
    const { rows: clubs } = await db.query(`
      SELECT c.*, cities.slug as city_slug 
      FROM clubs c 
      JOIN cities ON c."cityId" = cities.id
    `);

    for (const club of clubs) {
      // Get new city ID
      const { rows: [{ id: newCityId }] } = await db.query(
        'SELECT id FROM cities_new WHERE slug = $1',
        [club.city_slug]
      );

      await db.query(`
        INSERT INTO clubs_new (
          id, slug, name, day, time, location, description,
          instagram, facebook, "cityId", status,
          submitter_email, submitted_at, reviewed_at, reviewed_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        uuidv4(),
        club.slug,
        club.name,
        club.day,
        club.time,
        club.location,
        club.description,
        club.instagram,
        club.facebook,
        newCityId,
        club.status || 'approved',
        club.submitter_email,
        club.submitted_at || 'NOW()',
        club.reviewed_at,
        club.reviewed_by
      ]);
    }

    // Swap tables
    await db.query(`
      DROP TABLE clubs;
      DROP TABLE cities;
      ALTER TABLE cities_new RENAME TO cities;
      ALTER TABLE clubs_new RENAME TO clubs;
      CREATE INDEX idx_clubs_city ON clubs("cityId");
      CREATE INDEX idx_clubs_status ON clubs(status);
    `);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    // Rollback if needed
    await db.query(`
      DROP TABLE IF EXISTS clubs_new;
      DROP TABLE IF EXISTS cities_new;
    `);
  }
}

migrate().catch(console.error); 