import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getFile, GitHubConflictError, GitHubConfigError, putFile } from "@/lib/github";

const CONTENT_PATH = "content/seminars.json";

const seminarSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  durationMin: z.number().positive(),
  host: z.string().min(1),
  registrationUrl: z.string().min(1),
  isPast: z.boolean(),
});

const seminarsSchema = z.array(seminarSchema);

export async function GET() {
  try {
    const file = await getFile(CONTENT_PATH);
    if (!file) return NextResponse.json({ seminars: [], sha: null });
    const seminars = seminarsSchema.parse(JSON.parse(file.content));
    return NextResponse.json({ seminars, sha: file.sha });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const seminars = seminarsSchema.parse(body.seminars);
    const sha = typeof body.sha === "string" ? body.sha : undefined;
    const commitMessage =
      typeof body.commitMessage === "string" ? body.commitMessage : "content: update seminars";

    const result = await putFile(
      CONTENT_PATH,
      JSON.stringify(seminars, null, 2) + "\n",
      commitMessage,
      sha
    );

    return NextResponse.json({ ok: true, sha: result.sha });
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
    return NextResponse.json({ error: "Invalid seminar data.", issues: err.issues }, { status: 400 });
  }
  console.error(err);
  return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
}
