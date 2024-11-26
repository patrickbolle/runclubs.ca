import pg from 'pg';
import { DATABASE_URL, NODE_ENV } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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

/**
 * Database interface for the runclubs application
 */
export const db = {
  /**
   * Get all cities
   */
  async getCities() {
    try {
      const { rows } = await pool.query(`
        SELECT id, slug, LOWER(name) as name
        FROM cities 
        ORDER BY name
      `);
      return rows;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  /**
   * Get a single city and its run clubs
   */
  async getCity(citySlug) {
    try {
      console.log('Getting city with slug:', citySlug);
      
      const { rows: [city] } = await pool.query(
        'SELECT * FROM cities WHERE slug = $1',
        [citySlug]
      );

      console.log('Found city:', city);

      if (!city) return null;

      const { rows: clubs } = await pool.query(`
        SELECT 
          c.*,
          json_agg(
            CASE WHEN ce.id IS NOT NULL THEN
              json_build_object(
                'day_of_week', ce.day_of_week,
                'start_time', ce.start_time
              )
            ELSE NULL
            END
          ) as events
        FROM clubs c
        LEFT JOIN club_events ce ON ce.club_id = c.id
        WHERE c.city_id = $1 AND c.status = 'approved'
        GROUP BY c.id
        ORDER BY c.name
      `, [city.id]);

      console.log('Found clubs:', clubs);

      return {
        slug: city.slug,
        name: city.name,
        description: city.description,
        clubs: clubs.map(club => ({
          id: club.slug,
          name: club.name,
          location: club.location,
          description: club.description,
          events: club.events.filter(e => e !== null),
          socialMedia: {
            instagram: club.instagram,
            facebook: club.facebook
          }
        }))
      };
    } catch (error) {
      console.error('Error fetching city:', error);
      return null;
    }
  },

  /**
   * Get a single run club
   */
  async getRunClub(citySlug, clubSlug) {
    try {
      const { rows: [club] } = await pool.query(`
        SELECT 
          c.*,
          json_agg(
            json_build_object(
              'day_of_week', ce.day_of_week,
              'start_time', ce.start_time
            )
          ) as events
        FROM clubs c
        JOIN cities ON c.city_id = cities.id 
        LEFT JOIN club_events ce ON ce.club_id = c.id
        WHERE cities.slug = $1 AND c.slug = $2
        AND c.status = 'approved'
        GROUP BY c.id, cities.id
      `, [citySlug, clubSlug]);

      if (!club) return null;

      return {
        id: club.slug,
        name: club.name,
        location: club.location,
        description: club.description,
        events: club.events.filter(e => e !== null),
        socialMedia: {
          instagram: club.instagram,
          facebook: club.facebook
        }
      };
    } catch (error) {
      console.error('Error fetching run club:', error);
      return null;
    }
  },

  /**
   * Create a pending club submission
   */
  async createPendingClub(submission) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert club
      const { rows: [club] } = await client.query(`
        INSERT INTO clubs (
          name, city_id, location, description,
          instagram, facebook, submitter_email, status,
          slug
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, 'pending',
          LOWER(REGEXP_REPLACE(REGEXP_REPLACE($1, '[^a-zA-Z0-9]+', '-'), '^-+|-+$', ''))
        )
        RETURNING id, slug, name, city_id
      `, [
        submission.name,
        submission.city_id,
        submission.location,
        submission.description,
        submission.instagram || '',
        submission.facebook || '',
        submission.submitterEmail
      ]);

      // Insert events
      const events = parseEvents(submission.day, submission.time);
      for (const event of events) {
        await client.query(`
          INSERT INTO club_events (
            id, club_id, day_of_week, start_time
          ) VALUES ($1, $2, $3, $4)
        `, [
          uuidv4(),
          club.id,
          event.day_of_week,
          event.start_time
        ]);
      }

      await client.query('COMMIT');
      return club;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Get pending club submissions
   */
  async getPendingClubs() {
    try {
      const { rows } = await pool.query(`
        SELECT 
          c.*,
          cities.name as city_name,
          cities.slug as city_slug,
          json_agg(
            CASE WHEN ce.id IS NOT NULL THEN
              json_build_object(
                'day_of_week', ce.day_of_week,
                'start_time', ce.start_time
              )
            ELSE NULL
            END
          ) as events
        FROM clubs c
        JOIN cities ON c.city_id = cities.id
        LEFT JOIN club_events ce ON ce.club_id = c.id
        WHERE c.status = 'pending'
        GROUP BY c.id, cities.id, cities.name, cities.slug
        ORDER BY c.submitted_at DESC
      `);
      return rows.map(row => ({
        ...row,
        events: row.events.filter(e => e !== null)
      }));
    } catch (error) {
      console.error('Error fetching pending clubs:', error);
      return [];
    }
  },

  /**
   * Approve a pending club
   */
  async approveClub(clubId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get club details before updating
      const { rows: [club] } = await client.query(`
        SELECT c.*, cities.slug as city_slug
        FROM clubs c
        JOIN cities ON c.city_id = cities.id
        WHERE c.id = $1
      `, [clubId]);

      if (!club) {
        throw new Error('Club not found');
      }

      // Update club status
      await client.query(`
        UPDATE clubs 
        SET status = 'approved', 
            reviewed_at = CURRENT_TIMESTAMP,
            reviewed_by = 'admin'
        WHERE id = $1
      `, [clubId]);

      await client.query('COMMIT');
      return club;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Reject a pending club
   */
  async rejectClub(clubId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get club details before updating
      const { rows: [club] } = await client.query(`
        SELECT * FROM clubs WHERE id = $1
      `, [clubId]);

      if (!club) {
        throw new Error('Club not found');
      }

      // Update club status
      await client.query(`
        UPDATE clubs 
        SET status = 'rejected',
            reviewed_at = CURRENT_TIMESTAMP,
            reviewed_by = 'admin'
        WHERE id = $1
      `, [clubId]);

      await client.query('COMMIT');
      return club;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}; 