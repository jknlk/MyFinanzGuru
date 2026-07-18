import { NextResponse } from "next/server";
import matter from "gray-matter";
import { getFile, listDirectory, GitHubConfigError } from "@/lib/github";

const GUIDES_DIR = "content/guides";

export async function GET() {
  try {
    const files = await listDirectory(GUIDES_DIR);
    const mdxFiles = files.filter((f) => f.name.endsWith(".mdx"));

    const guides = await Promise.all(
      mdxFiles.map(async (f) => {
        const slug = f.name.replace(/\.mdx$/, "");
        const file = await getFile(`${GUIDES_DIR}/${f.name}`);
        if (!file) return null;
        const { data } = matter(file.content);
        return {
          slug,
          title: data.title ?? slug,
          category: data.category ?? "",
          date: data.date ?? "",
          sha: f.sha,
        };
      })
    );

    return NextResponse.json({ guides: guides.filter(Boolean) });
  } catch (err) {
    if (err instanceof GitHubConfigError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
