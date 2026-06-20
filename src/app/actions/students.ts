"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { dollarsToCents } from "@/lib/money";

export type ProfileState = { error?: string; success?: boolean };

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100),
  school: z.string().trim().min(2, "Please enter your school.").max(120),
  fieldOfStudy: z.string().trim().min(2, "Please enter your field of study.").max(120),
  yearOfStudy: z.string().trim().min(1, "Please enter your year of study.").max(40),
  city: z.string().trim().min(1, "Please enter your city.").max(80),
  country: z.string().trim().min(1).max(80).default("Uzbekistan"),
  story: z.string().trim().min(30, "Please share at least a couple of sentences.").max(4000),
  goalDollars: z.coerce
    .number()
    .min(100, "Goal must be at least $100.")
    .max(100000, "Goal must be $100,000 or less."),
  imageUrl: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .url()
        .refine(
          (u) => /^https?:\/\//i.test(u),
          "Image URL must start with http:// or https://.",
        ),
    ])
    .optional(),
});

export async function upsertStudentProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await requireUser();
  if (user.role !== "STUDENT") {
    return { error: "Only student accounts can create a student profile." };
  }

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    school: formData.get("school"),
    fieldOfStudy: formData.get("fieldOfStudy"),
    yearOfStudy: formData.get("yearOfStudy"),
    city: formData.get("city"),
    country: formData.get("country") || "Uzbekistan",
    story: formData.get("story"),
    goalDollars: formData.get("goalDollars"),
    imageUrl: formData.get("imageUrl") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const data = parsed.data;
  const goalAmountCents = dollarsToCents(data.goalDollars);
  const imageUrl = data.imageUrl ? data.imageUrl : null;

  const existing = await prisma.studentProfile.findUnique({ where: { userId: user.id } });

  if (existing) {
    await prisma.studentProfile.update({
      where: { userId: user.id },
      data: {
        fullName: data.fullName,
        school: data.school,
        fieldOfStudy: data.fieldOfStudy,
        yearOfStudy: data.yearOfStudy,
        city: data.city,
        country: data.country,
        story: data.story,
        goalAmountCents,
        imageUrl,
      },
    });
  } else {
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        school: data.school,
        fieldOfStudy: data.fieldOfStudy,
        yearOfStudy: data.yearOfStudy,
        city: data.city,
        country: data.country,
        story: data.story,
        goalAmountCents,
        imageUrl,
        status: "PENDING_REVIEW",
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/students");
  return { success: true };
}
