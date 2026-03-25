/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const cars = [
    {
      slug: "hyundai-i10",
      name: "Hyundai i10",
      category: "Standard",
      seats: 5,
      bags: "1 Large bag",
      transmission: "Manual",
      fuel: "Petrol",
      mileage: "Unlimited mileage",
      pricePerDay: 300,
      city: "Casablanca",
      featured: true,
      active: true,
      imageUrl: ""
    },
    {
      slug: "dacia-duster",
      name: "Dacia Duster",
      category: "SUV",
      seats: 5,
      bags: "2 Large bags",
      transmission: "Manual",
      fuel: "Diesel",
      mileage: "Unlimited mileage",
      pricePerDay: 450,
      city: "Marrakech",
      featured: true,
      active: true,
      imageUrl: ""
    }
  ];

  for (const c of cars) {
    await prisma.car.upsert({
      where: { slug: c.slug },
      update: c,
      create: c
    });
  }

  console.log("Seeded cars:", cars.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
