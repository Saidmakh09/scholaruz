import "server-only";
import { prisma } from "./db";
import type { StudentStatus } from "@prisma/client";

export type StudentWithProgress = {
  id: string;
  fullName: string;
  school: string;
  fieldOfStudy: string;
  yearOfStudy: string;
  city: string;
  country: string;
  story: string;
  goalAmountCents: number;
  status: StudentStatus;
  imageUrl: string | null;
  raisedCents: number;
  donorCount: number;
};

// Students that donors are allowed to see and fund.
const PUBLIC_STATUSES: StudentStatus[] = ["APPROVED", "FUNDED"];

function computeProgress(s: {
  contributions: { amountCents: number; status: string; donorUserId: string }[];
}) {
  const succeeded = s.contributions.filter((c) => c.status === "SUCCEEDED");
  const raisedCents = succeeded.reduce((acc, c) => acc + c.amountCents, 0);
  const donorCount = new Set(succeeded.map((c) => c.donorUserId)).size;
  return { raisedCents, donorCount };
}

export async function getPublicStudents(): Promise<StudentWithProgress[]> {
  const students = await prisma.studentProfile.findMany({
    where: { status: { in: PUBLIC_STATUSES } },
    include: {
      contributions: { select: { amountCents: true, status: true, donorUserId: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return students
    .map((s) => {
      const { raisedCents, donorCount } = computeProgress(s);
      return {
        id: s.id,
        fullName: s.fullName,
        school: s.school,
        fieldOfStudy: s.fieldOfStudy,
        yearOfStudy: s.yearOfStudy,
        city: s.city,
        country: s.country,
        story: s.story,
        goalAmountCents: s.goalAmountCents,
        status: s.status,
        imageUrl: s.imageUrl,
        raisedCents,
        donorCount,
      };
    })
    // Show the least-funded students first so donors see the greatest need.
    .sort((a, b) => a.raisedCents / a.goalAmountCents - b.raisedCents / b.goalAmountCents);
}

export async function getStudentById(id: string): Promise<StudentWithProgress | null> {
  const s = await prisma.studentProfile.findUnique({
    where: { id },
    include: {
      contributions: { select: { amountCents: true, status: true, donorUserId: true } },
    },
  });
  if (!s) return null;
  const { raisedCents, donorCount } = computeProgress(s);
  return {
    id: s.id,
    fullName: s.fullName,
    school: s.school,
    fieldOfStudy: s.fieldOfStudy,
    yearOfStudy: s.yearOfStudy,
    city: s.city,
    country: s.country,
    story: s.story,
    goalAmountCents: s.goalAmountCents,
    status: s.status,
    imageUrl: s.imageUrl,
    raisedCents,
    donorCount,
  };
}
