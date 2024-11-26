import dotenv from 'dotenv';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

function parseEvents(day, time) {
  if (!day || !time) return [];
  
  const days = day.split(',').map(d => d.trim());
  const times = time.split(',').map(t => t.trim());
  
  if (times.length === 1 && days.length > 1) {
    return days.map(d => ({
      day_of_week: d,
      start_time: times[0]
    }));
  }

  return days.map((d, i) => ({
    day_of_week: d,
    start_time: times[i] || times[0]
  }));
}

async function migrateToEvents() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // First, create a temporary table to store the UUID mappings for cities
    await client.query(`
      CREATE TABLE city_id_mapping (
        old_id TEXT PRIMARY KEY,
        new_id UUID DEFAULT gen_random_uuid()
      );
    `);

    // Create mapping for existing cities
    await client.query(`
      INSERT INTO city_id_mapping (old_id)
      SELECT id FROM cities;
    `);

    // Create new cities table with UUID
    await client.query(`
      CREATE TABLE cities_new (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Migrate cities data
    await client.query(`
      INSERT INTO cities_new (id, slug, name, description)
      SELECT m.new_id, c.slug, c.name, c.description
      FROM cities c
      JOIN city_id_mapping m ON c.id = m.old_id;
    `);

    // Create club_id_mapping
    await client.query(`
      CREATE TABLE club_id_mapping (
        old_id TEXT PRIMARY KEY,
        new_id UUID DEFAULT gen_random_uuid()
      );
    `);

    // Create mapping for existing clubs
    await client.query(`
      INSERT INTO club_id_mapping (old_id)
      SELECT id FROM clubs;
    `);

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

    // Migrate clubs data using both mappings
    await client.query(`
      INSERT INTO clubs_new (
        id, slug, name, location, description,
        instagram, facebook, "cityId", status
      )
      SELECT 
        cm.new_id, c.slug, c.name, c.location, c.description,
        c.instagram, c.facebook, citym.new_id, 'approved'
      FROM clubs c
      JOIN club_id_mapping cm ON c.id = cm.old_id
      JOIN city_id_mapping citym ON c."cityId" = citym.old_id;
    `);

    // Create club_events table
    await client.query(`
      CREATE TABLE club_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        club_id UUID REFERENCES clubs_new(id) ON DELETE CASCADE,
        day_of_week TEXT NOT NULL,
        start_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get all existing clubs with their new IDs
    const { rows: clubs } = await client.query(`
      SELECT c.*, cm.new_id
      FROM clubs c
      JOIN club_id_mapping cm ON c.id = cm.old_id
      WHERE c.day IS NOT NULL OR c.time IS NOT NULL
    `);

    console.log(`Found ${clubs.length} clubs to migrate`);

    // Migrate each club's events
    for (const club of clubs) {
      const events = parseEvents(club.day, club.time);
      
      for (const event of events) {
        await client.query(`
          INSERT INTO club_events (
            id, club_id, day_of_week, start_time
          ) VALUES ($1, $2, $3, $4)
        `, [
          uuidv4(),
          club.new_id,
          event.day_of_week,
          event.start_time
        ]);
      }

      console.log(`Migrated events for club ${club.id} -> ${club.new_id}`);
    }

    // Swap tables
    await client.query(`
      DROP TABLE clubs;
      DROP TABLE cities;
      ALTER TABLE clubs_new RENAME TO clubs;
      ALTER TABLE cities_new RENAME TO cities;
      CREATE INDEX idx_clubs_city ON clubs("cityId");
      CREATE INDEX idx_clubs_status ON clubs(status);
      CREATE INDEX idx_club_events_club ON club_events(club_id);
    `);

    // Clean up mapping tables
    await client.query('DROP TABLE club_id_mapping');
    await client.query('DROP TABLE city_id_mapping');

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

// Run the migration
migrateToEvents()
  .then(() => {
    console.log('Migration completed, exiting...');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 