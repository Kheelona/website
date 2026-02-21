const WIX_CONTACT_FUNCTION_URL = process.env.WIX_CONTACT_FUNCTION_URL;

interface ContactPayload {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    if (!WIX_CONTACT_FUNCTION_URL) {
      return Response.json(
        { success: false, message: "WIX_CONTACT_FUNCTION_URL is not configured" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ContactPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Missing required fields (name, email, message)" },
        { status: 400 }
      );
    }

    const upstreamRes = await fetch(WIX_CONTACT_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        phone: body.phone?.trim() || "",
        subject: body.subject?.trim() || "",
      }),
      cache: "no-store",
    });

    const raw = await upstreamRes.text();
    const parsed = safeJsonParse(raw);

    if (!upstreamRes.ok) {
      const parsedError =
        typeof parsed === "object" && parsed !== null
          ? "error" in parsed && typeof parsed.error === "string"
            ? parsed.error
            : "message" in parsed && typeof parsed.message === "string"
              ? parsed.message
              : null
          : null;

      const rawPreview = raw.trim().slice(0, 220);

      const debugDetails =
        process.env.NODE_ENV !== "production"
          ? {
              upstreamStatus: upstreamRes.status,
              upstreamUrl: WIX_CONTACT_FUNCTION_URL,
              upstreamRawPreview: rawPreview,
            }
          : {};

      return Response.json(
        {
          success: false,
          message: parsedError || "Failed to submit contact form",
          ...debugDetails,
        },
        { status: upstreamRes.status }
      );
    }

    return Response.json(
      typeof parsed === "object" && parsed !== null ? parsed : { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
