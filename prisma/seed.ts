import {
  PrismaClient,
  type ContributionStatus,
  type DisbursementStatus,
  type StudentStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo!2026";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("Seeding ScholarUz...");

  // Clean slate (safe on a fresh database).
  await prisma.disbursement.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // Admin
  const admin = await prisma.user.create({
    data: { email: "admin@scholaruz.org", name: "ScholarUz Admin", role: "ADMIN", passwordHash },
  });

  // Donors
  const donorDefs = [
    { key: "aziz", email: "donor@scholaruz.org", name: "Aziz Karimov" },
    { key: "sevara", email: "sevara@example.com", name: "Sevara Foundation" },
    { key: "timur", email: "timur@example.com", name: "Timur Aliyev" },
    { key: "gulnora", email: "gulnora@example.com", name: "Gulnora Rahimova" },
    { key: "bobur", email: "bobur@example.com", name: "Bobur Tech Fund" },
    { key: "canet", email: "canet@example.com", name: "Central Asian Alumni Network" },
    { key: "rustam", email: "rustam@example.com", name: "Rustam Mirzaev" },
    { key: "nodira", email: "nodira@example.com", name: "Nodira Charitable Fund" },
    { key: "silkroad", email: "silkroad@example.com", name: "Silk Road Foundation" },
  ];
  const donors: Record<string, { id: string }> = {};
  for (const d of donorDefs) {
    donors[d.key] = await prisma.user.create({
      data: { email: d.email, name: d.name, role: "DONOR", passwordHash },
    });
  }

  // Students (each has a user account and a profile)
  const studentDefs: {
    key: string;
    email: string;
    fullName: string;
    school: string;
    fieldOfStudy: string;
    yearOfStudy: string;
    city: string;
    country: string;
    goalCents: number;
    status: StudentStatus;
    story: string;
  }[] = [
    {
      key: "madina",
      email: "student@scholaruz.org",
      fullName: "Madina Yusupova",
      school: "National University of Uzbekistan",
      fieldOfStudy: "Computer Science",
      yearOfStudy: "2nd year",
      city: "Tashkent",
      country: "Uzbekistan",
      goalCents: 400000,
      status: "APPROVED",
      story:
        "I am a second year Computer Science student passionate about building software that helps my community. I am the first in my family to attend university. A scholarship would let me cover tuition and buy a laptop so I can keep learning to code and contribute to open source projects.",
    },
    {
      key: "bekzod",
      email: "bekzod@example.com",
      fullName: "Bekzod Rashidov",
      school: "Tashkent State Technical University",
      fieldOfStudy: "Electrical Engineering",
      yearOfStudy: "3rd year",
      city: "Tashkent",
      country: "Uzbekistan",
      goalCents: 350000,
      status: "APPROVED",
      story:
        "I study electrical engineering and work part time to support my younger siblings. Funding would help me pay for lab fees and final year project components so I can graduate on time and start working as an engineer.",
    },
    {
      key: "nilufar",
      email: "nilufar@example.com",
      fullName: "Nilufar Abdullayeva",
      school: "Samarkand State University",
      fieldOfStudy: "Medicine (Premedical)",
      yearOfStudy: "1st year",
      city: "Samarkand",
      country: "Uzbekistan",
      goalCents: 500000,
      status: "APPROVED",
      story:
        "My dream is to become a doctor and serve rural communities that lack access to healthcare. Medical studies are long and expensive, and your support would cover my first year tuition and textbooks.",
    },
    {
      key: "jasur",
      email: "jasur@example.com",
      fullName: "Jasur Toshmatov",
      school: "Westminster International University in Tashkent",
      fieldOfStudy: "Economics",
      yearOfStudy: "2nd year",
      city: "Tashkent",
      country: "Uzbekistan",
      goalCents: 600000,
      status: "APPROVED",
      story:
        "I study economics with a focus on development. I want to build financial tools for small businesses in Uzbekistan. A scholarship would ease the burden of international program tuition on my family.",
    },
    {
      key: "dilnoza",
      email: "dilnoza@example.com",
      fullName: "Dilnoza Saidova",
      school: "Bukhara State University",
      fieldOfStudy: "English Philology",
      yearOfStudy: "4th year",
      city: "Bukhara",
      country: "Uzbekistan",
      goalCents: 250000,
      status: "FUNDED",
      story:
        "I am in my final year studying English Philology and I tutor children in my neighborhood for free. This funding helped me finish my degree and pursue a teaching certification. Thank you to everyone who contributed.",
    },
    {
      key: "sardor",
      email: "sardor@example.com",
      fullName: "Sardor Islomov",
      school: "Tashkent University of Information Technologies",
      fieldOfStudy: "Software Engineering",
      yearOfStudy: "1st year",
      city: "Tashkent",
      country: "Uzbekistan",
      goalCents: 450000,
      status: "APPROVED",
      story:
        "I taught myself to program on a borrowed phone and earned a place in a software engineering program. I would be the first software engineer in my town. Support would help me afford housing near campus and a reliable computer.",
    },
    {
      key: "kamola",
      email: "kamola@example.com",
      fullName: "Kamola Yulduzeva",
      school: "Fergana State University",
      fieldOfStudy: "Mathematics",
      yearOfStudy: "2nd year",
      city: "Fergana",
      country: "Uzbekistan",
      goalCents: 300000,
      status: "APPROVED",
      story:
        "Mathematics is my passion and I want to become a researcher and teacher. I compete in national math olympiads. A scholarship would let me attend a summer research program and cover my tuition.",
    },
    {
      key: "aigerim",
      email: "aigerim@example.com",
      fullName: "Aigerim Nurlanova",
      school: "Columbia University",
      fieldOfStudy: "Computer Science",
      yearOfStudy: "Sophomore",
      city: "New York",
      country: "United States",
      goalCents: 700000,
      status: "APPROVED",
      story:
        "I grew up in Kazakhstan and earned a place at Columbia University in New York. Financial aid covers part of my costs, but not everything. As a Central Asian student far from home, support from this community would help me stay enrolled and one day give back to students like me.",
    },
    {
      key: "farrukh",
      email: "farrukh@example.com",
      fullName: "Farrukh Rahmonov",
      school: "New York University",
      fieldOfStudy: "Data Science",
      yearOfStudy: "Junior",
      city: "New York",
      country: "United States",
      goalCents: 750000,
      status: "APPROVED",
      story:
        "I am a Tajik student studying data science in New York. I work two campus jobs to cover my living costs. A scholarship would let me focus on my studies and a research project on clean water access in Central Asia.",
    },
    {
      key: "gulbahor",
      email: "gulbahor@example.com",
      fullName: "Gulbahor Toirova",
      school: "University of Pennsylvania",
      fieldOfStudy: "Biology",
      yearOfStudy: "2nd year",
      city: "Philadelphia",
      country: "United States",
      goalCents: 650000,
      status: "APPROVED",
      story:
        "I am an Uzbek student on the premedical track in Philadelphia. I want to become a physician and bring better care home to Uzbekistan. Your support would help me cover the gap between my aid and the real cost of attending.",
    },
    {
      key: "azamat",
      email: "azamat@example.com",
      fullName: "Azamat Bekov",
      school: "American University of Central Asia",
      fieldOfStudy: "Political Science",
      yearOfStudy: "3rd year",
      city: "Bishkek",
      country: "Kyrgyzstan",
      goalCents: 350000,
      status: "APPROVED",
      story:
        "I study political science in Bishkek and lead a student group that runs free civics classes for teenagers. A scholarship would help me finish my degree and keep our program running.",
    },
    {
      key: "dilshod",
      email: "dilshod@example.com",
      fullName: "Dilshod Karimov",
      school: "Tashkent Institute of Irrigation and Agricultural Mechanization Engineers",
      fieldOfStudy: "Agricultural Engineering",
      yearOfStudy: "3rd year",
      city: "Tashkent",
      country: "Uzbekistan",
      goalCents: 300000,
      status: "APPROVED",
      story:
        "I study agricultural engineering and want to help farmers in the Aral Sea region use water more wisely. Funding would cover my tuition and the cost of my final field research.",
    },
    {
      key: "aziza",
      email: "aziza@example.com",
      fullName: "Aziza Yusupova",
      school: "Inha University in Tashkent",
      fieldOfStudy: "Computer Engineering",
      yearOfStudy: "4th year",
      city: "Tashkent",
      country: "Uzbekistan",
      goalCents: 400000,
      status: "FUNDED",
      story:
        "I am a final year computer engineering student. With the help of donors I reached my goal and will graduate this year. I am building a free study app for high school students across Central Asia.",
    },
    {
      key: "otabek",
      email: "otabek@example.com",
      fullName: "Otabek Nazarov",
      school: "Urgench State University",
      fieldOfStudy: "Civil Engineering",
      yearOfStudy: "3rd year",
      city: "Urgench",
      country: "Uzbekistan",
      goalCents: 380000,
      status: "PENDING_REVIEW",
      story:
        "I study civil engineering and want to help rebuild infrastructure in the Aral Sea region. I just submitted my application and am excited to share my story with donors.",
    },
  ];

  const students: Record<string, { id: string }> = {};
  for (const s of studentDefs) {
    const user = await prisma.user.create({
      data: { email: s.email, name: s.fullName, role: "STUDENT", passwordHash },
    });
    students[s.key] = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        fullName: s.fullName,
        school: s.school,
        fieldOfStudy: s.fieldOfStudy,
        yearOfStudy: s.yearOfStudy,
        city: s.city,
        country: s.country,
        story: s.story,
        goalAmountCents: s.goalCents,
        status: s.status,
      },
    });
  }

  // Contributions
  const contributionDefs: {
    donor: string;
    student: string;
    cents: number;
    status: ContributionStatus;
    daysAgo: number;
    message?: string;
  }[] = [
    { donor: "aziz", student: "madina", cents: 120000, status: "SUCCEEDED", daysAgo: 42, message: "Keep coding, you have got this." },
    { donor: "timur", student: "madina", cents: 60000, status: "SUCCEEDED", daysAgo: 20 },
    { donor: "rustam", student: "madina", cents: 80000, status: "SUCCEEDED", daysAgo: 9 },
    { donor: "bobur", student: "madina", cents: 30000, status: "PENDING", daysAgo: 1 },

    { donor: "sevara", student: "bekzod", cents: 90000, status: "SUCCEEDED", daysAgo: 35 },
    { donor: "gulnora", student: "bekzod", cents: 70000, status: "SUCCEEDED", daysAgo: 12 },
    { donor: "canet", student: "bekzod", cents: 60000, status: "SUCCEEDED", daysAgo: 7 },

    { donor: "bobur", student: "nilufar", cents: 200000, status: "SUCCEEDED", daysAgo: 30, message: "Future doctors deserve support." },
    { donor: "aziz", student: "nilufar", cents: 70000, status: "SUCCEEDED", daysAgo: 8 },
    { donor: "nodira", student: "nilufar", cents: 100000, status: "SUCCEEDED", daysAgo: 4 },

    { donor: "sevara", student: "jasur", cents: 150000, status: "SUCCEEDED", daysAgo: 25 },
    { donor: "silkroad", student: "jasur", cents: 200000, status: "SUCCEEDED", daysAgo: 16 },
    { donor: "aziz", student: "jasur", cents: 50000, status: "SUCCEEDED", daysAgo: 6 },
    { donor: "aziz", student: "jasur", cents: 25000, status: "PENDING", daysAgo: 1 },

    { donor: "aziz", student: "dilnoza", cents: 150000, status: "SUCCEEDED", daysAgo: 70, message: "Congratulations on your final year." },
    { donor: "timur", student: "dilnoza", cents: 100000, status: "SUCCEEDED", daysAgo: 60 },

    { donor: "gulnora", student: "sardor", cents: 90000, status: "SUCCEEDED", daysAgo: 15 },
    { donor: "rustam", student: "sardor", cents: 120000, status: "SUCCEEDED", daysAgo: 5 },

    { donor: "bobur", student: "kamola", cents: 120000, status: "SUCCEEDED", daysAgo: 18 },
    { donor: "timur", student: "kamola", cents: 60000, status: "SUCCEEDED", daysAgo: 10 },
    { donor: "canet", student: "kamola", cents: 70000, status: "SUCCEEDED", daysAgo: 3 },

    { donor: "silkroad", student: "aigerim", cents: 250000, status: "SUCCEEDED", daysAgo: 28, message: "Proud to support a Central Asian student at Columbia." },
    { donor: "canet", student: "aigerim", cents: 150000, status: "SUCCEEDED", daysAgo: 14 },
    { donor: "aziz", student: "aigerim", cents: 120000, status: "SUCCEEDED", daysAgo: 6 },
    { donor: "rustam", student: "aigerim", cents: 80000, status: "SUCCEEDED", daysAgo: 2 },

    { donor: "silkroad", student: "farrukh", cents: 250000, status: "SUCCEEDED", daysAgo: 22 },
    { donor: "bobur", student: "farrukh", cents: 200000, status: "SUCCEEDED", daysAgo: 13 },
    { donor: "canet", student: "farrukh", cents: 100000, status: "SUCCEEDED", daysAgo: 5 },
    { donor: "timur", student: "farrukh", cents: 80000, status: "SUCCEEDED", daysAgo: 2 },

    { donor: "nodira", student: "gulbahor", cents: 200000, status: "SUCCEEDED", daysAgo: 19 },
    { donor: "sevara", student: "gulbahor", cents: 150000, status: "SUCCEEDED", daysAgo: 9 },
    { donor: "rustam", student: "gulbahor", cents: 100000, status: "SUCCEEDED", daysAgo: 3 },

    { donor: "nodira", student: "azamat", cents: 110000, status: "SUCCEEDED", daysAgo: 17 },
    { donor: "gulnora", student: "azamat", cents: 70000, status: "SUCCEEDED", daysAgo: 8 },

    { donor: "gulnora", student: "dilshod", cents: 80000, status: "SUCCEEDED", daysAgo: 11 },
    { donor: "aziz", student: "dilshod", cents: 60000, status: "SUCCEEDED", daysAgo: 4 },

    { donor: "silkroad", student: "aziza", cents: 200000, status: "SUCCEEDED", daysAgo: 50, message: "Congratulations on graduating." },
    { donor: "canet", student: "aziza", cents: 150000, status: "SUCCEEDED", daysAgo: 44 },
    { donor: "bobur", student: "aziza", cents: 50000, status: "SUCCEEDED", daysAgo: 40 },
  ];
  for (const c of contributionDefs) {
    await prisma.contribution.create({
      data: {
        donorUserId: donors[c.donor].id,
        studentId: students[c.student].id,
        amountCents: c.cents,
        status: c.status,
        message: c.message ?? null,
        createdAt: daysAgo(c.daysAgo),
        updatedAt: daysAgo(c.daysAgo),
      },
    });
  }

  // Disbursements (kept within each student's raised balance)
  const disbursementDefs: {
    student: string;
    cents: number;
    status: DisbursementStatus;
    reference: string;
    note: string;
    daysAgo: number;
  }[] = [
    { student: "dilnoza", cents: 250000, status: "CONFIRMED", reference: "BSU INV 2291", note: "Final year tuition", daysAgo: 45 },
    { student: "aziza", cents: 300000, status: "CONFIRMED", reference: "INHA INV 5510", note: "Final year tuition", daysAgo: 38 },
    { student: "nilufar", cents: 200000, status: "SENT", reference: "SAMU INV 1043", note: "First year tuition", daysAgo: 6 },
    { student: "madina", cents: 100000, status: "CONFIRMED", reference: "NUU INV 7781", note: "Tuition installment", daysAgo: 14 },
    { student: "aigerim", cents: 250000, status: "CONFIRMED", reference: "CU INV 4402", note: "Term tuition support", daysAgo: 10 },
    { student: "farrukh", cents: 300000, status: "SENT", reference: "NYU INV 8830", note: "Term tuition support", daysAgo: 4 },
  ];
  for (const d of disbursementDefs) {
    await prisma.disbursement.create({
      data: {
        studentId: students[d.student].id,
        amountCents: d.cents,
        status: d.status,
        reference: d.reference,
        note: d.note,
        createdByUserId: admin.id,
        scheduledAt: daysAgo(d.daysAgo + 1),
        sentAt: d.status === "SENT" || d.status === "CONFIRMED" ? daysAgo(d.daysAgo) : null,
        confirmedAt: d.status === "CONFIRMED" ? daysAgo(d.daysAgo - 1) : null,
        createdAt: daysAgo(d.daysAgo + 1),
      },
    });
  }

  const counts = {
    users: await prisma.user.count(),
    students: await prisma.studentProfile.count(),
    contributions: await prisma.contribution.count(),
    disbursements: await prisma.disbursement.count(),
  };
  console.log("Seed complete:", counts);
  console.log(`Demo logins (password: ${DEMO_PASSWORD}):`);
  console.log("  admin@scholaruz.org, donor@scholaruz.org, student@scholaruz.org");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
