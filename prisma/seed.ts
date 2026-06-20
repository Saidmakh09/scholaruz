import { PrismaClient, type ContributionStatus, type DisbursementStatus, type StudentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Demo!2026";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("Seeding ScholarUz…");

  // Clean slate (safe on a fresh database).
  await prisma.disbursement.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ── Admin ──────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@scholaruz.org",
      name: "ScholarUz Admin",
      role: "ADMIN",
      passwordHash,
    },
  });

  // ── Donors ─────────────────────────────────────────────────────────────
  const donorDefs = [
    { key: "aziz", email: "donor@scholaruz.org", name: "Aziz Karimov" },
    { key: "sevara", email: "sevara@example.com", name: "Sevara Foundation" },
    { key: "timur", email: "timur@example.com", name: "Timur Aliyev" },
    { key: "gulnora", email: "gulnora@example.com", name: "Gulnora Rahimova" },
    { key: "bobur", email: "bobur@example.com", name: "Bobur Tech Fund" },
  ];
  const donors: Record<string, { id: string }> = {};
  for (const d of donorDefs) {
    donors[d.key] = await prisma.user.create({
      data: { email: d.email, name: d.name, role: "DONOR", passwordHash },
    });
  }

  // ── Students (each has a user account + a profile) ──────────────────────
  const studentDefs: {
    key: string;
    email: string;
    fullName: string;
    school: string;
    fieldOfStudy: string;
    yearOfStudy: string;
    city: string;
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
      goalCents: 400000,
      status: "APPROVED",
      story:
        "I'm a second-year Computer Science student passionate about building software that helps my community. I'm the first in my family to attend university. A scholarship would let me cover tuition and buy a laptop so I can keep learning to code and contribute to open-source projects.",
    },
    {
      key: "bekzod",
      email: "bekzod@example.com",
      fullName: "Bekzod Rashidov",
      school: "Tashkent State Technical University",
      fieldOfStudy: "Electrical Engineering",
      yearOfStudy: "3rd year",
      city: "Tashkent",
      goalCents: 350000,
      status: "APPROVED",
      story:
        "I study electrical engineering and work part-time to support my younger siblings. Funding would help me pay for lab fees and final-year project components so I can graduate on time and start working as an engineer.",
    },
    {
      key: "nilufar",
      email: "nilufar@example.com",
      fullName: "Nilufar Abdullayeva",
      school: "Samarkand State University",
      fieldOfStudy: "Medicine (Pre-med)",
      yearOfStudy: "1st year",
      city: "Samarkand",
      goalCents: 500000,
      status: "APPROVED",
      story:
        "My dream is to become a doctor and serve rural communities that lack access to healthcare. Medical studies are long and expensive — your support would cover my first-year tuition and textbooks.",
    },
    {
      key: "jasur",
      email: "jasur@example.com",
      fullName: "Jasur Toshmatov",
      school: "Westminster International University in Tashkent",
      fieldOfStudy: "Economics",
      yearOfStudy: "2nd year",
      city: "Tashkent",
      goalCents: 600000,
      status: "APPROVED",
      story:
        "I'm studying economics with a focus on development. I want to help build financial tools for small businesses in Uzbekistan. A scholarship would ease the burden of international-program tuition on my family.",
    },
    {
      key: "dilnoza",
      email: "dilnoza@example.com",
      fullName: "Dilnoza Saidova",
      school: "Bukhara State University",
      fieldOfStudy: "English Philology",
      yearOfStudy: "4th year",
      city: "Bukhara",
      goalCents: 250000,
      status: "FUNDED",
      story:
        "I'm in my final year studying English Philology and I tutor children in my neighborhood for free. This funding helped me finish my degree and pursue a teaching certification. Thank you to everyone who contributed!",
    },
    {
      key: "sardor",
      email: "sardor@example.com",
      fullName: "Sardor Islomov",
      school: "Tashkent University of Information Technologies",
      fieldOfStudy: "Software Engineering",
      yearOfStudy: "1st year",
      city: "Tashkent",
      goalCents: 450000,
      status: "APPROVED",
      story:
        "I taught myself to program on a borrowed phone and got into a software engineering program. I'd be the first software engineer in my town. Support would help me afford housing near campus and a reliable computer.",
    },
    {
      key: "kamola",
      email: "kamola@example.com",
      fullName: "Kamola Yulduzeva",
      school: "Fergana State University",
      fieldOfStudy: "Mathematics",
      yearOfStudy: "2nd year",
      city: "Fergana",
      goalCents: 300000,
      status: "APPROVED",
      story:
        "Mathematics is my passion and I want to become a researcher and teacher. I compete in national math olympiads. A scholarship would let me attend a summer research program and cover my tuition.",
    },
    {
      key: "otabek",
      email: "otabek@example.com",
      fullName: "Otabek Nazarov",
      school: "Urgench State University",
      fieldOfStudy: "Civil Engineering",
      yearOfStudy: "3rd year",
      city: "Urgench",
      goalCents: 380000,
      status: "PENDING_REVIEW",
      story:
        "I'm studying civil engineering and want to help rebuild infrastructure in the Aral Sea region. I just submitted my application and am excited to share my story with potential donors.",
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
        country: "Uzbekistan",
        story: s.story,
        goalAmountCents: s.goalCents,
        status: s.status,
      },
    });
  }

  // ── Contributions ───────────────────────────────────────────────────────
  const contributionDefs: {
    donor: string;
    student: string;
    cents: number;
    status: ContributionStatus;
    daysAgo: number;
    message?: string;
  }[] = [
    { donor: "aziz", student: "madina", cents: 120000, status: "SUCCEEDED", daysAgo: 42, message: "Keep coding — you've got this!" },
    { donor: "timur", student: "madina", cents: 50000, status: "SUCCEEDED", daysAgo: 20 },
    { donor: "sevara", student: "bekzod", cents: 80000, status: "SUCCEEDED", daysAgo: 35 },
    { donor: "gulnora", student: "bekzod", cents: 70000, status: "SUCCEEDED", daysAgo: 12 },
    { donor: "bobur", student: "nilufar", cents: 200000, status: "SUCCEEDED", daysAgo: 30, message: "Future doctors deserve support." },
    { donor: "aziz", student: "nilufar", cents: 60000, status: "SUCCEEDED", daysAgo: 8 },
    { donor: "sevara", student: "jasur", cents: 100000, status: "SUCCEEDED", daysAgo: 25 },
    { donor: "aziz", student: "jasur", cents: 25000, status: "PENDING", daysAgo: 1 },
    { donor: "aziz", student: "dilnoza", cents: 150000, status: "SUCCEEDED", daysAgo: 70, message: "Congratulations on your final year!" },
    { donor: "timur", student: "dilnoza", cents: 100000, status: "SUCCEEDED", daysAgo: 60 },
    { donor: "gulnora", student: "sardor", cents: 90000, status: "SUCCEEDED", daysAgo: 15 },
    { donor: "bobur", student: "kamola", cents: 120000, status: "SUCCEEDED", daysAgo: 18 },
    { donor: "timur", student: "kamola", cents: 30000, status: "SUCCEEDED", daysAgo: 5 },
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

  // ── Disbursements (kept within each student's held balance) ─────────────
  const disbursementDefs: {
    student: string;
    cents: number;
    status: DisbursementStatus;
    reference: string;
    note: string;
    daysAgo: number;
  }[] = [
    { student: "dilnoza", cents: 250000, status: "CONFIRMED", reference: "BSU-INV-2291", note: "Final-year tuition", daysAgo: 45 },
    { student: "nilufar", cents: 200000, status: "SENT", reference: "SAMU-INV-1043", note: "First-year tuition", daysAgo: 6 },
    { student: "madina", cents: 100000, status: "CONFIRMED", reference: "NUU-INV-7781", note: "Tuition installment", daysAgo: 14 },
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
  console.log("  admin@scholaruz.org · donor@scholaruz.org · student@scholaruz.org");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
