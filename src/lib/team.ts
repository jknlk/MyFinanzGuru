export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  languages: string;
  photo?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "{{NAME}}",
    role: "{{ROLE}} — Founder & Managing Director",
    bio: "{{BIO — 2-3 sentences on background, licensing (§34f/§34h GewO), and philosophy.}}",
    languages: "German, English",
  },
  {
    name: "{{NAME}}",
    role: "{{ROLE}} — Senior Financial Consultant",
    bio: "{{BIO — 2-3 sentences on background and specialization.}}",
    languages: "German, English",
  },
  {
    name: "{{NAME}}",
    role: "{{ROLE}} — Real Estate & Financing Specialist",
    bio: "{{BIO — 2-3 sentences on background and specialization.}}",
    languages: "German, English",
  },
  {
    name: "{{NAME}}",
    role: "{{ROLE}} — Client Success",
    bio: "{{BIO — 2-3 sentences on background and specialization.}}",
    languages: "German, English",
  },
];
