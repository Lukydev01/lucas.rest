import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.entryTag.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();

  const anime = await prisma.category.create({
    data: { name: "Anime", slug: "anime" },
  });

  const films = await prisma.category.create({
    data: { name: "Films", slug: "films" },
  });

  const series = await prisma.category.create({
    data: { name: "Series", slug: "series" },
  });

  const books = await prisma.category.create({
    data: { name: "Books", slug: "books" },
  });

  const psychological = await prisma.tag.create({
    data: { name: "Psychological", slug: "psychological" },
  });

  const darkFantasy = await prisma.tag.create({
    data: { name: "Dark Fantasy", slug: "dark-fantasy" },
  });

  const classic = await prisma.tag.create({
    data: { name: "Classic", slug: "classic" },
  });

  const philosophical = await prisma.tag.create({
    data: { name: "Philosophical", slug: "philosophical" },
  });

  const atmospheric = await prisma.tag.create({
    data: { name: "Atmospheric", slug: "atmospheric" },
  });

  const surreal = await prisma.tag.create({
    data: { name: "Surreal", slug: "surreal" },
  });

  const evangelion = await prisma.entry.create({
    data: {
      title: "Neon Genesis Evangelion",
      slug: "neon-genesis-evangelion",
      kind: "anime",
      description:
        "A landmark anime that mixes mecha, depression, identity, and apocalypse into something intensely personal.",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/2/2f/Neon_Genesis_Evangelion.jpg",
      personalNote:
        "One of the most psychologically intense and personally resonant works in the repository.",
      year: 1995,
      creator: "Hideaki Anno",
      categoryId: anime.id,
    },
  });

  const berserk = await prisma.entry.create({
    data: {
      title: "Berserk",
      slug: "berserk",
      kind: "anime",
      description:
        "A brutal dark fantasy story of fate, trauma, and struggle, with one of the strongest atmospheres in manga and anime culture.",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/4/45/Berserk_vol01.jpg",
      personalNote:
        "The atmosphere, tragedy, and raw emotional force make it unforgettable.",
      year: 1989,
      creator: "Kentaro Miura",
      categoryId: anime.id,
    },
  });

  const stalker = await prisma.entry.create({
    data: {
      title: "Stalker",
      slug: "stalker",
      kind: "movie",
      description:
        "A slow, meditative film about faith, desire, meaning, and the unknown.",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/d/db/Stalker-poster.jpg",
      personalNote:
        "A film that feels more like a spiritual space than a narrative.",
      year: 1979,
      creator: "Andrei Tarkovsky",
      categoryId: films.id,
    },
  });

  const twinPeaks = await prisma.entry.create({
    data: {
      title: "Twin Peaks",
      slug: "twin-peaks",
      kind: "series",
      description:
        "A surreal mystery series where small-town America collides with dreams, dread, and the uncanny.",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/8/89/TwinPeaks_opening.jpg",
      personalNote:
        "One of the clearest examples of atmosphere becoming identity.",
      year: 1990,
      creator: "David Lynch & Mark Frost",
      categoryId: series.id,
    },
  });

  const masterMargarita = await prisma.entry.create({
    data: {
      title: "The Master and Margarita",
      slug: "the-master-and-margarita",
      kind: "book",
      description:
        "A strange, satirical, philosophical novel where the Devil arrives in Moscow and chaos follows.",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/7b/MasterandMargarita.jpg",
      personalNote:
        "Brilliantly absurd, elegant, and philosophically playful.",
      year: 1967,
      creator: "Mikhail Bulgakov",
      categoryId: books.id,
    },
  });

  await prisma.mediaAsset.create({
    data: {
      entryId: stalker.id,
      type: "video",
      title: "Main Film",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      mimeType: "video/mp4",
    },
  });

  await prisma.mediaAsset.create({
    data: {
      entryId: masterMargarita.id,
      type: "pdf",
      title: "Book PDF",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      mimeType: "application/pdf",
    },
  });

  const twinPeaksSeason1 = await prisma.season.create({
    data: {
      entryId: twinPeaks.id,
      number: 1,
      title: "Season 1",
    },
  });
  
  await prisma.episode.createMany({
    data: [
      {
        seasonId: twinPeaksSeason1.id,
        number: 1,
        title: "Pilot",
        description: "The beginning of the mystery.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        seasonId: twinPeaksSeason1.id,
        number: 2,
        title: "Episode 2",
        description: "The mystery deepens.",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
      },
    ],
  });

  const evaSeason1 = await prisma.season.create({
    data: {
      entryId: evangelion.id,
      number: 1,
      title: "Season 1",
    },
  });
  
  await prisma.episode.createMany({
    data: [
      {
        seasonId: evaSeason1.id,
        number: 1,
        title: "Angel Attack",
        description: "Shinji arrives and is thrown into chaos.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        seasonId: evaSeason1.id,
        number: 2,
        title: "The Beast",
        description: "The Eva goes berserk.",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
      },
    ],
  });

  await prisma.entryTag.createMany({
    data: [
      { entryId: evangelion.id, tagId: psychological.id },
      { entryId: evangelion.id, tagId: philosophical.id },

      { entryId: berserk.id, tagId: darkFantasy.id },
      { entryId: berserk.id, tagId: atmospheric.id },

      { entryId: stalker.id, tagId: philosophical.id },
      { entryId: stalker.id, tagId: atmospheric.id },
      { entryId: stalker.id, tagId: classic.id },

      { entryId: twinPeaks.id, tagId: surreal.id },
      { entryId: twinPeaks.id, tagId: atmospheric.id },

      { entryId: masterMargarita.id, tagId: classic.id },
      { entryId: masterMargarita.id, tagId: philosophical.id },
    ],
  });

  console.log("Seed concluído com sucesso.");
}

main()
  .catch(async (e) => {
    console.error("Erro no seed:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  })
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  });