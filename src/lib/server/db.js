import pg from 'pg';
import { DATABASE_URL, NODE_ENV } from '$env/static/private';

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Database interface for the runclubs application
 */
export const db = {
  /**
   * Get all cities
   */
  async getCities() {
    try {
      const { rows } = await pool.query('SELECT slug, LOWER(name) as name FROM cities ORDER BY name');
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
      // Get city data
      const city = await pool.query(
        'SELECT * FROM cities WHERE slug = $1',
        [citySlug]
      ).then(result => result.rows[0]);

      if (!city) return null;

      // Get run clubs for city
      const { rows: clubs } = await pool.query(
        'SELECT * FROM clubs WHERE "cityId" = $1',
        [city.id]
      );

      return {
        slug: city.slug,
        name: city.name,
        description: city.description,
        clubs: clubs.map(club => ({
          id: club.slug,
          name: club.name,
          day: club.day,
          time: club.time,
          location: club.location,
          description: club.description,
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
      const { rows } = await pool.query(`
        SELECT clubs.* 
        FROM clubs 
        JOIN cities ON clubs."cityId" = cities.id 
        WHERE cities.slug = $1 AND clubs.slug = $2
      `, [citySlug, clubSlug]);

      const club = rows[0];
      if (!club) return null;

      return {
        id: club.slug,
        name: club.name,
        day: club.day,
        time: club.time,
        location: club.location,
        description: club.description,
        socialMedia: {
          instagram: club.instagram,
          facebook: club.facebook
        }
      };
    } catch (error) {
      console.error('Error fetching run club:', error);
      return null;
    }
  }
}; 