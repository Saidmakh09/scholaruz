import type { Metadata } from "next";
import { CoverImage } from "@/components/CoverImage";
import { uz } from "@/lib/images";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "A curated library of free learning platforms, application help, and scholarship search tools to help university students go further.",
};

type Resource = { name: string; href: string; blurb: string };

const groups: { title: string; intro: string; items: Resource[] }[] = [
  {
    title: "Learn for free",
    intro: "World class courses and lessons that cost nothing to start.",
    items: [
      {
        name: "Khan Academy",
        href: "https://www.khanacademy.org",
        blurb: "Free lessons in math, science, economics, and more, at your own pace.",
      },
      {
        name: "Coursera",
        href: "https://www.coursera.org",
        blurb: "Courses and certificates from top universities, many free to audit.",
      },
      {
        name: "edX",
        href: "https://www.edx.org",
        blurb: "University level courses online, founded by Harvard and MIT.",
      },
      {
        name: "MIT OpenCourseWare",
        href: "https://ocw.mit.edu",
        blurb: "Real MIT course materials, lecture notes, and exams, open to everyone.",
      },
      {
        name: "freeCodeCamp",
        href: "https://www.freecodecamp.org",
        blurb: "Learn to code for free through hands on projects and certifications.",
      },
      {
        name: "Grow with Google",
        href: "https://grow.google",
        blurb: "Free training and career certificates in high demand digital skills.",
      },
    ],
  },
  {
    title: "Apply and succeed",
    intro: "Guides to help you write, study, and present yourself well.",
    items: [
      {
        name: "Purdue Writing Lab",
        href: "https://owl.purdue.edu",
        blurb: "Trusted, free guides for essays, personal statements, and citations.",
      },
      {
        name: "Learning How to Learn",
        href: "https://www.coursera.org/learn/learning-how-to-learn",
        blurb: "A famous free course on how to study effectively and beat procrastination.",
      },
      {
        name: "EducationUSA",
        href: "https://educationusa.state.gov",
        blurb: "Official guidance on planning and applying to universities abroad.",
      },
    ],
  },
  {
    title: "Find more funding",
    intro: "Other scholarships and programs worth exploring.",
    items: [
      {
        name: "Coca-Cola Scholars Foundation",
        href: "https://www.coca-colascholarsfoundation.org",
        blurb: "A landmark scholarship program and an inspiration for ScholarUz.",
      },
      {
        name: "DAAD Scholarships",
        href: "https://www.daad.de/en/",
        blurb: "Scholarships and funding to study in Germany for international students.",
      },
      {
        name: "Chevening Scholarships",
        href: "https://www.chevening.org",
        blurb: "Fully funded study in the United Kingdom for future leaders.",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <CoverImage src={uz.chorsu.src} alt={uz.chorsu.alt} priority className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/65 to-brand-900/30" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-24 text-white sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold ring-1 ring-white/30">
              Resources
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Everything you need to go further
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/90">
              Funding is one part of the journey. Here is a handpicked library of free tools to
              help you learn, prepare a strong application, and discover even more support.
            </p>
          </div>
        </div>
      </section>

      {/* Groups */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        {groups.map((group) => (
          <section key={group.title} className="mb-14 last:mb-0">
            <h2 className="text-2xl font-bold text-ink">{group.title}</h2>
            <p className="mt-1 text-muted">{group.intro}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                >
                  <h3 className="font-semibold text-ink group-hover:text-brand-700">{r.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">{r.blurb}</p>
                  <span className="mt-4 text-sm font-semibold text-brand-700 group-hover:underline">
                    Visit site
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}

        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-muted">
          These links point to independent organizations. ScholarUz shares them to be helpful
          and does not control their content.
        </p>
      </div>
    </div>
  );
}
