import { UserRole } from "../src/generated/prisma/enums";
import { prisma } from "../src/lib/db";

async function seedUsers() {
  const users = [
    {
      name: "Alice Author",
      email: "alice@example.com",
      role: UserRole.AUTHOR,
    },
    {
      name: "Bob Reviewer",
      email: "bob@example.com",
      role: UserRole.REVIEWER,
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      role: UserRole.ADMIN,
    },
    {
      name: "Viewer User",
      email: "viewer@example.com",
      role: UserRole.VIEWER,
    },
  ];

  for (const user of users) {
    const result = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        role: user.role,
      },
      create: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    console.log(`  → ${result.role}: ${result.email}`);
  }
}

async function main() {
  console.log("starting database seed...");

  console.log("\nseeding users...");
  await seedUsers();

  console.log("\nDatabase seeded successfully.");
}

main()
  .catch((error) => {
    console.error("seeding failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
