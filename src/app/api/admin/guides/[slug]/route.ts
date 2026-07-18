import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { z } from "zod";
import {
  deleteFile,
  getFile,
  GitHubConflictError,
  GitHubConfigError,
  putFile,
} from "@/lib/github";

const GUIDES_DIR = "content/guides";

const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().min(1),
  readTime: z.string().min(1),
  cover: z.string().optional().default(""),
  pdf: z.string().optional().default(""),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const file = await getFile(`${GUIDES_DIR}/${slug}.mdx`);
    if (!file) return NextResponse.json({ error: "Not found." }, { status: 404 });
    const { data, content } = matter(file.content);
    return NextResponse.json({ frontmatter: data, content, sha: file.sha });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await req.json();
    const frontmatter = frontmatterSchema.parse(body.frontmatter);
    const content = typeof body.content === "string" ? body.content : "";
    const sha = typeof body.sha === "string" ? body.sha : undefined;
    const commitMessage =
      typeof body.commitMessage === "string"
        ? body.commitMessage
        : `content: update guide "${frontmatter.title}"`;

    const fileBody = matter.stringify(content, frontmatter);

    const result = await putFile(`${GUIDES_DIR}/${slug}.mdx`, fileBody, commitMessage, sha);

    return NextResponse.json({ ok: true, sha: result.sha });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await req.json().catch(() => ({}));
    const sha = typeof body.sha === "string" ? body.sha : undefined;
    if (!sha) {
      return NextResponse.json({ error: "Missing sha for delete." }, { status: 400 });
    }
    await deleteFile(`${GUIDES_DIR}/${slug}.mdx`, `content: delete guide "${slug}"`, sha);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}

function errorResponse(err: unknown) {
  if (err instanceof GitHubConfigError) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  if (err instanceof GitHubConflictError) {
    return NextResponse.json({ error: err.message, conflict: true }, { status: 409 });
  }
  if (err instanceof z.ZodError) {
    return NextResponse.json({ error: "Invalid guide data.", issues: err.issues }, { status: 400 });
  }
  console.error(err);
  return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
}
