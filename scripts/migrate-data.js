import dotenv from 'dotenv';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Backup existing data
    console.log('Backing up existing data...');
    const { rows: existingCities } = await client.query('SELECT * FROM cities');
    const { rows: existingClubs } = await client.query('SELECT * FROM clubs');
    const { rows: existingEvents } = await client.query('SELECT * FROM club_events');
    
    console.log(`Found ${existingCities.length} cities, ${existingClubs.length} clubs, and ${existingEvents.length} events`);

    // Drop existing tables
    await client.query(`
      DROP TABLE IF EXISTS club_events CASCADE;
      DROP TABLE IF EXISTS clubs CASCADE;
      DROP TABLE IF EXISTS cities CASCADE;
    `);

    // Create new tables with proper naming
    await client.query(`
      CREATE TABLE cities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE clubs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        location TEXT,
        description TEXT,
        instagram TEXT,
        facebook TEXT,
        city_id UUID REFERENCES cities(id),
        status VARCHAR(50) DEFAULT 'approved',
        submitter_email VARCHAR(255),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        reviewed_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE club_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
        day_of_week TEXT NOT NULL,
        start_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create mapping for IDs
    const cityMapping = {};
    const clubMapping = {};

    // Restore cities
    console.log('Restoring cities...');
    for (const city of existingCities) {
      const newId = uuidv4();
      cityMapping[city.id] = newId;

      await client.query(`
        INSERT INTO cities (id, slug, name, description, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        newId,
        city.slug,
        city.name,
        city.description,
        city.created_at || new Date(),
        city.updated_at || new Date()
      ]);
    }

    // Restore clubs
    console.log('Restoring clubs...');
    for (const club of existingClubs) {
      const newId = uuidv4();
      clubMapping[club.id] = newId;

      await client.query(`
        INSERT INTO clubs (
          id, slug, name, location, description,
          instagram, facebook, city_id, status,
          submitter_email, submitted_at, reviewed_at, reviewed_by,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        newId,
        club.slug,
        club.name,
        club.location,
        club.description,
        club.instagram,
        club.facebook,
        cityMapping[club.cityid], // Map to new city UUID
        club.status || 'approved',
        club.submitter_email,
        club.submitted_at || new Date(),
        club.reviewed_at,
        club.reviewed_by,
        club.created_at || new Date(),
        club.updated_at || new Date()
      ]);

      // Create events from day/time fields if they exist
      if (club.day && club.time) {
        const days = club.day.split(',').map(d => d.trim());
        const times = club.time.split(',').map(t => t.trim());
        
        days.forEach((day, index) => {
          const time = times[index] || times[0];
          client.query(`
            INSERT INTO club_events (club_id, day_of_week, start_time)
            VALUES ($1, $2, $3)
          `, [newId, day, time]);
        });
      }
    }

    // Restore existing events
    console.log('Restoring events...');
    for (const event of existingEvents) {
      await client.query(`
        INSERT INTO club_events (
          id, club_id, day_of_week, start_time,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        uuidv4(),
        clubMapping[event.club_id], // Map to new club UUID
        event.day_of_week,
        event.start_time,
        event.created_at || new Date(),
        event.updated_at || new Date()
      ]);
    }

    // Create indexes
    await client.query(`
      CREATE INDEX idx_clubs_city ON clubs(city_id);
      CREATE INDEX idx_clubs_status ON clubs(status);
      CREATE INDEX idx_club_events_club ON club_events(club_id);
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

migrateData()
  .then(() => {
    console.log('Migration completed, exiting...');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 