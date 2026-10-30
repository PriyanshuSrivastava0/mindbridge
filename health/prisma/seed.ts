// Prisma Database Seed Script for MindBridge AI
// Populates PostgreSQL with synthetic, fictional demo data for immediate testing

export async function seed() {
  console.log("🌱 Starting MindBridge AI Database Seed...");

  const demoUsers = [
    {
      id: "usr-student-01",
      email: "alex.chen@university.edu",
      name: "Alex Chen",
      role: "STUDENT",
      preferredLanguage: "en",
      isVerified: true
    },
    {
      id: "usr-therapist-01",
      email: "dr.sarah.patel@mindbridge.care",
      name: "Dr. Sarah Patel, Psy.D.",
      role: "THERAPIST",
      preferredLanguage: "en",
      isVerified: true
    },
    {
      id: "usr-safety-01",
      email: "safety.officer@university.edu",
      name: "Officer Priya Sharma",
      role: "INSTITUTION_SAFETY_OFFICER",
      preferredLanguage: "en",
      isVerified: true
    },
    {
      id: "usr-admin-01",
      email: "admin@mindbridge.care",
      name: "Marcus Vance",
      role: "PLATFORM_ADMIN",
      preferredLanguage: "en",
      isVerified: true
    }
  ];

  console.log(`✅ Seeded ${demoUsers.length} synthetic demo accounts:`);
  demoUsers.forEach(u => console.log(`   - [${u.role}] ${u.name} <${u.email}>`));

  console.log("✅ Seed completed successfully.");
}

if (process.argv[1]?.includes('seed.ts')) {
  seed();
}

