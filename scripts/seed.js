import { seedDatabase } from '../src/lib/server/seed.js';
import dotenv from 'dotenv';

dotenv.config();

seedDatabase()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  }); 