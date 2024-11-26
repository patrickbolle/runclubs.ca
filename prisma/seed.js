import { PrismaClient } from '@prisma/client';
import vancouver from '../src/lib/data/vancouver.json' assert { type: 'json' };
import toronto from '../src/lib/data/toronto.json' assert { type: 'json' };
import kitchenerWaterloo from '../src/lib/data/kitchener-waterloo.json' assert { type: 'json' };

const prisma = new PrismaClient();

async function main() {
  // First clear existing data
  await prisma.runClub.deleteMany();
  await prisma.city.deleteMany();

  const cities = [
    {
      data: vancouver,
      slug: 'vancouver',
    },
    {
      data: toronto,
      slug: 'toronto',
    },
    {
      data: kitchenerWaterloo,
      slug: 'kitchener-waterloo',
    },
  ];

  for (const { data, slug } of cities) {
    const city = await prisma.city.create({
      data: {
        slug,
        name: data.city,
        description: data.description,
        clubs: {
          create: data.clubs.map(club => ({
            slug: club.id,
            name: club.name,
            day: club.day,
            time: club.time,
            location: club.location || '',
            description: club.description,
            instagram: club.socialMedia.instagram,
            facebook: club.socialMedia.facebook,
          })),
        },
      },
    });
    
    console.log(`Created city: ${city.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 