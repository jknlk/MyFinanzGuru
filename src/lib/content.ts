import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");
const GUIDES_DIR = path.join(CONTENT_DIR, "guides");

const seminarSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  durationMin: z.number(),
  host: z.string(),
  registrationUrl: z.string(),
  isPast: z.boolean(),
});

export type Seminar = z.infer<typeof seminarSchema>;

const seminarsSchema = z.array(seminarSchema);

export function getSeminars(): Seminar[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "seminars.json"), "utf-8");
  const parsed = seminarsSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(`Invalid content/seminars.json: ${parsed.error.message}`);
  }
  return parsed.data;
}

const guideFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  excerpt: z.string(),
  date: z.string(),
  readTime: z.string(),
  cover: z.string().optional().default(""),
  pdf: z.string().optional().default(""),
});

export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;

export interface Guide extends GuideFrontmatter {
  content: string;
}

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".mdx"));

  const guides = files.map((file) => {
    const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    const parsed = guideFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(`Invalid frontmatter in content/guides/${file}: ${parsed.error.message}`);
    }
    return { ...parsed.data, content };
  });

  return guides.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getAllGuides().find((g) => g.slug === slug);
}

export function getGuideCategories(): string[] {
  const categories = new Set(getAllGuides().map((g) => g.category));
  return Array.from(categories);
}
