import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { languageId, sourceCode, stdin } = await req.json();

    if (!languageId || !sourceCode) {
      return NextResponse.json(
        { error: "languageId and sourceCode are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: sourceCode,
          stdin: stdin || "",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Judge0 service unavailable");
    }

    const result = await response.json();

    return NextResponse.json({
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      status: result.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
