import dotenv from 'dotenv';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixIds() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Drop existing indexes if they exist
    await client.query(`
      DROP INDEX IF EXISTS idx_clubs_city;
      DROP INDEX IF EXISTS idx_clubs_status;
      DROP INDEX IF EXISTS idx_club_events_club;
    `);

    // Create new cities table with UUID
    await client.query(`
      CREATE TABLE cities_new (
        id UUID PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get existing cities and create UUID mapping
    const { rows: cities } = await client.query('SELECT * FROM cities');
    const cityMapping = {};

    // Migrate cities with new UUIDs
    for (const city of cities) {
      const newId = uuidv4();
      cityMapping[city.id] = newId;

      await client.query(`
        INSERT INTO cities_new (id, slug, name, description, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        newId,
        city.slug,
        city.name,
        city.description,
        city.createdat || new Date(),
        city.updatedat || new Date()
      ]);
    }

    // Create new clubs table
    await client.query(`
      CREATE TABLE clubs_new (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
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

    // Migrate clubs data with new city UUIDs
    const { rows: clubs } = await client.query('SELECT * FROM clubs');
    for (const club of clubs) {
      const newId = uuidv4();
      await client.query(`
        INSERT INTO clubs_new (
          id, slug, name, location, description,
          instagram, facebook, "cityId", status,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        newId,
        club.slug,
        club.name,
        club.location,
        club.description,
        club.instagram,
        club.facebook,
        cityMapping[club.cityid], // Use mapped UUID
        club.status || 'approved',
        club.createdat || new Date(),
        club.updatedat || new Date()
      ]);
    }

    // Create club_events table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS club_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        club_id UUID REFERENCES clubs_new(id) ON DELETE CASCADE,
        day_of_week TEXT NOT NULL,
        start_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Drop old tables and rename new ones
    await client.query(`
      DROP TABLE IF EXISTS clubs CASCADE;
      DROP TABLE IF EXISTS cities CASCADE;
      ALTER TABLE cities_new RENAME TO cities;
      ALTER TABLE clubs_new RENAME TO clubs;
    `);

    // Create new indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_clubs_city ON clubs("cityId");
      CREATE INDEX IF NOT EXISTS idx_clubs_status ON clubs(status);
      CREATE INDEX IF NOT EXISTS idx_club_events_club ON club_events(club_id);
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

fixIds()
  .then(() => {
    console.log('ID fix completed, exiting...');
    process.exit(0);
  })
  .catch(error => {
    console.error('ID fix failed:', error);
    process.exit(1);
  }); 