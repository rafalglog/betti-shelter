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

// Data for Adoption Status (ID will be auto-generated)
const adoptionStatusData = [
  { name: "Adopted" },
  { name: "Available" },
  { name: "Pending" },
  { name: "On Hold" },
  { name: "Medical Hold" },
  { name: "Behavioral Assessment/Hold" },
  { name: "Foster Care" },
  { name: "Foster-to-Adopt" },
  { name: "Not Yet Available" },
  { name: "Reclaimed" },
  { name: "Transferred" },
];

// Data for Pets, using names for species and adoption status
const petSeedData = [
  // dogs
  {
    name: "Frisco",
    age: 5,
    gender: Gender.FEMALE,
    speciesName: "Dog",
    breed: "Golden Retriever",
    weightKg: 30,
    heightCm: 60,
    city: "New York",
    state: "NY",
    description: "Friendly and playful",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 3,
    gender: Gender.MALE,
    speciesName: "Dog",
    breed: "American Eskimo Dog",
    weightKg: 10,
    heightCm: 5,
    city: "New York",
    state: "NY",
    description: "Independent and curious",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
    petImages: {
      create: [{ url: "/uploads/dog2.jpg" }, { url: "/uploads/dog2-1.webp" }],
    },
  },
  {
    name: "Fido",
    age: 5,
    gender: Gender.MALE,
    speciesName: "Dog",
    breed: "Airedale Terrier",
    weightKg: 20,
    heightCm: 15,
    city: "New York",
    state: "NY",
    description: "Friendly and playful",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 3,
    gender: Gender.FEMALE,
    speciesName: "Cat",
    breed: "Siamese cat",
    weightKg: 10,
    heightCm: 5,
    city: "New York",
    state: "NY",
    description: "Independent and curious",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 2,
    gender: Gender.FEMALE,
    speciesName: "Cat",
    breed: "British Shorthair",
    weightKg: 3,
    heightCm: 1,
    city: "New York",
    state: "NY",
    description: "Vocal and charming",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 2,
    gender: Gender.MALE,
    speciesName: "Bird",
    breed: "House finch",
    weightKg: 1,
    heightCm: 1,
    city: "New York",
    state: "NY",
    description: "Vocal and charming",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 1,
    gender: Gender.MALE,
    speciesName: "Bird",
    breed: "Northern cardinal",
    weightKg: 1,
    heightCm: 2,
    city: "New York",
    state: "NY",
    description: "Colorful and adventurous",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 1,
    gender: Gender.FEMALE,
    speciesName: "Rabbit",
    breed: "Netherland Dwarf rabbit",
    weightKg: 6,
    heightCm: 3,
    city: "New York",
    state: "NY",
    description: "Colorful and adventurous",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 1,
    gender: Gender.MALE,
    speciesName: "Reptile",
    breed: "Iguana",
    weightKg: 7,
    heightCm: 2,
    city: "New York",
    state: "NY",
    description: "Colorful and adventurous",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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
    age: 2,
    gender: Gender.MALE,
    speciesName: "Reptile",
    breed: "Green sea turtle",
    weightKg: 1,
    heightCm: 1,
    city: "New York",
    state: "NY",
    description: "Vocal and charming",
    listingStatus: PetListingStatus.PUBLISHED,
    adoptionStatusName: "Available",
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

async function seedAdoptionStatus() {
  console.log("Seeding adoption status ...");
  try {
    for (const status of adoptionStatusData) {
      await prisma.adoptionStatus.create({
        data: status, // status will be { name: "Adopted" }, ID is auto-generated
      });
    }
  } catch (error) {
    console.error("Error seeding adoption status:", error);
    throw error;
  }
  console.log("Seeded adoption status");
}

async function seedUsers() {
  console.log("Seeding users ...");
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "admin",
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

  // Fetch all adoption statuses and create a name-to-ID map
  const allAdoptionStatuses = await prisma.adoptionStatus.findMany({
    select: { id: true, name: true },
  });
  const adoptionStatusMap = Object.fromEntries(
    allAdoptionStatuses.map(status => [status.name, status.id])
  );

  for (const petInput of petSeedData) {
    try {
      // Destructure to separate names from the rest of the pet data
      const { speciesName, adoptionStatusName, ...restOfPetData } = petInput;

      const speciesId = speciesMap[speciesName];
      const adoptionStatusId = adoptionStatusMap[adoptionStatusName];

      // Basic validation: check if names were found in the maps
      if (!speciesId) {
        console.warn(`Species ID not found for name: "${speciesName}". Skipping pet: ${petInput.name}`);
        continue; // Skip this pet if species name is invalid
      }
      if (!adoptionStatusId) {
        console.warn(`Adoption Status ID not found for name: "${adoptionStatusName}". Skipping pet: ${petInput.name}`);
        continue; // Skip this pet if adoption status name is invalid
      }

      await prisma.pet.create({
        data: {
          ...restOfPetData, // Spread the rest of the pet data (name, age, breed, etc.)
          species: {
            connect: { id: speciesId }, // Connect using the looked-up ID
          },
          adoptionStatus: {
            connect: { id: adoptionStatusId }, // Connect using the looked-up ID
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
  console.log("Deleting existing data (PetImage, Pet first, then User, AdoptionStatus, Species)...");
  await prisma.petImage.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adoptionStatus.deleteMany();
  await prisma.species.deleteMany();
  console.log("Existing data deleted.");

  // Seed new data
  console.log("Start seeding new data...");
  await seedSpecies();
  await seedAdoptionStatus();
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
