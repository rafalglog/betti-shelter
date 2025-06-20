const bcrypt = require("bcrypt");
const { PrismaClient, Role, Gender, PetListingStatus } = require("@prisma/client");
const prisma = new PrismaClient();

// Data for Species (ID will be auto-generated)
const speciesData = [
  { name: "Dog" },
  { name: "Cat" },
  { name: "Bird" },
  { name: "Rabbit" },
  { name: "Reptile" },
  { name: "Other" },
];

// Helper function to generate random dates between 2022 and 2025
function getRandomDate() {
  const start = new Date(2022, 0, 1); // January 1, 2022
  const end = new Date(); // Current date
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Data for Pets, using names for species
const petSeedData = [
  // dogs
  {
    name: "Frisco",
    birthDate: getRandomDate(),
    gender: Gender.FEMALE,
    speciesName: "Dog",
    breed: "Golden Retriever",
    weightKg: 30,
    heightCm: 60,
    city: "New York",
    state: "NY",
    description: "Friendly and playful",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/dog1.jpg" },
        { url: "/uploads/dog1-1.webp" },
        { url: "/uploads/dog1-2.jpg" },
        { url: "/uploads/dog1-3.webp" },
      ],
    },
  },
  {
    name: "Flash",
    birthDate: getRandomDate(),
    gender: Gender.MALE,
    speciesName: "Dog",
    breed: "American Eskimo Dog",
    weightKg: 10,
    heightCm: 5,
    city: "New York",
    state: "NY",
    description: "Independent and curious",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [{ url: "/uploads/dog2.jpg" }, { url: "/uploads/dog2-1.webp" }],
    },
  },
  {
    name: "Fido",
    birthDate: getRandomDate(),
    gender: Gender.MALE,
    speciesName: "Dog",
    breed: "Airedale Terrier",
    weightKg: 20,
    heightCm: 15,
    city: "New York",
    state: "NY",
    description: "Friendly and playful",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/dog3.jpg" },
        { url: "/uploads/dog3-1.jpg" },
        { url: "/uploads/dog3-2.webp" },
      ],
    },
  },
  // cats
  {
    name: "Whiskers",
    birthDate: getRandomDate(),
    gender: Gender.FEMALE,
    speciesName: "Cat",
    breed: "Siamese cat",
    weightKg: 10,
    heightCm: 5,
    city: "New York",
    state: "NY",
    description: "Independent and curious",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/cat1.webp" },
        { url: "/uploads/cat1-1.jpg" },
        { url: "/uploads/cat1-2.jpg" },
      ],
    },
  },
  {
    name: "Misty",
    birthDate: getRandomDate(),
    gender: Gender.FEMALE,
    speciesName: "Cat",
    breed: "British Shorthair",
    weightKg: 3,
    heightCm: 1,
    city: "New York",
    state: "NY",
    description: "Vocal and charming",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/cat2.webp" },
        { url: "/uploads/cat2-1.jpg" },
        { url: "/uploads/cat2-2.jpg" },
      ],
    },
  },
  // birds
  {
    name: "Tweety",
    birthDate: getRandomDate(),
    gender: Gender.MALE,
    speciesName: "Bird",
    breed: "House finch",
    weightKg: 1,
    heightCm: 1,
    city: "New York",
    state: "NY",
    description: "Vocal and charming",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/bird1.webp" },
        { url: "/uploads/bird1-1.webp" },
        { url: "/uploads/bird1-2.webp" },
      ],
    },
  },
  {
    name: "Sunny",
    birthDate: getRandomDate(),
    gender: Gender.MALE,
    speciesName: "Bird",
    breed: "Northern cardinal",
    weightKg: 1,
    heightCm: 2,
    city: "New York",
    state: "NY",
    description: "Colorful and adventurous",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/bird2.webp" },
        { url: "/uploads/bird2-1.webp" },
        { url: "/uploads/bird2-2.webp" },
      ],
    },
  },
  // rabbits
  {
    name: "Bella",
    birthDate: getRandomDate(),
    gender: Gender.FEMALE,
    speciesName: "Rabbit",
    breed: "Netherland Dwarf rabbit",
    weightKg: 6,
    heightCm: 3,
    city: "New York",
    state: "NY",
    description: "Colorful and adventurous",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/rabbit1.webp" },
        { url: "/uploads/rabbit1-1.jpg" },
        { url: "/uploads/rabbit1-2.webp" },
      ],
    },
  },
  // reptiles
  {
    name: "Godzilla",
    birthDate: getRandomDate(),
    gender: Gender.MALE,
    speciesName: "Reptile",
    breed: "Iguana",
    weightKg: 7,
    heightCm: 2,
    city: "New York",
    state: "NY",
    description: "Colorful and adventurous",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/reptile2.webp" },
        { url: "/uploads/reptile2-1.jpg" },
        { url: "/uploads/reptile2-2.jpg" },
      ],
    },
  },
  {
    name: "Donatello",
    birthDate: getRandomDate(),
    gender: Gender.MALE,
    speciesName: "Reptile",
    breed: "Green sea turtle",
    weightKg: 1,
    heightCm: 1,
    city: "New York",
    state: "NY",
    description: "Vocal and charming",
    listingStatus: PetListingStatus.PUBLISHED,
    petImages: {
      create: [
        { url: "/uploads/reptile1.webp" },
        { url: "/uploads/reptile1-1.webp" },
        { url: "/uploads/reptile1-2.jpg" },
      ],
    },
  },
];

async function seedSpecies() {
  console.log("Seeding species ...");
  try {
    for (const species of speciesData) {
      await prisma.species.create({
        data: species, // species will be { name: "Dog" }, ID is auto-generated
      });
    }
  } catch (error) {
    console.error("Error seeding species:", error);
    throw error;
  }
  console.log("Seeded species");
}

async function seedUsers() {
  console.log("Seeding users ...");
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "ADMIN",
        password: hashedPassword,
        email: "admin@example.com",
        role: Role.ADMIN,
      },
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
  console.log("Seeded users");
}

async function seedPets() {
  console.log("Seeding pets ...");

  // Fetch all species and create a name-to-ID map
  const allSpecies = await prisma.species.findMany({
    select: { id: true, name: true },
  });
  const speciesMap = Object.fromEntries(
    allSpecies.map(s => [s.name, s.id])
  );

  for (const petInput of petSeedData) {
    try {
      // Destructure to separate names from the rest of the pet data
      const { speciesName, ...restOfPetData } = petInput;

      const speciesId = speciesMap[speciesName];

      // Basic validation: check if names were found in the maps
      if (!speciesId) {
        console.warn(`Species ID not found for name: "${speciesName}". Skipping pet: ${petInput.name}`);
        continue; // Skip this pet if species name is invalid
      }
      await prisma.pet.create({
        data: {
          ...restOfPetData, // Spread the rest of the pet data (name, age, breed, etc.)
          species: {
            connect: { id: speciesId }, // Connect using the looked-up ID
          },
          petImages: petInput.petImages,
        },
      });
    } catch (error) {
      console.error(`Error seeding pet "${petInput.name}":`, error);
      throw error; 
    }
  }
  console.log("Seeded pets");
}

async function main() {
  console.log("Starting database seeding process...");

  // Clear existing data in a specific order to avoid foreign key constraint errors
  console.log("Deleting existing data (PetImage, Pet first, then User, Species)...");
  await prisma.petImage.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.species.deleteMany();
  console.log("Existing data deleted.");

  // Seed new data
  console.log("Start seeding new data...");
  await seedSpecies();
  await seedUsers();
  await seedPets();
  console.log("Seeding finished successfully.");
}

main()
  .then(async () => {
    console.log("Disconnecting Prisma Client...");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("An error occurred during the seeding process:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
