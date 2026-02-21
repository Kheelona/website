const WIX_CONTACT_FUNCTION_URL =
  process.env.WIX_CONTACT_FUNCTION_URL || "https://kheelona.com/_functions/contact";

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

      return Response.json(
        {
          success: false,
          message: parsedError || rawPreview || "Failed to submit contact form",
          upstreamStatus: upstreamRes.status,
          upstreamUrl: WIX_CONTACT_FUNCTION_URL,
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

// import { NextRequest, NextResponse } from "next/server";
// import { createClient, ApiKeyStrategy } from "@wix/sdk";
// import { contacts, notes } from "@wix/crm";

// function createWixClient() {
//   const apiKey = process.env.WIX_API_KEY;
//   const accountId = process.env.WIX_ACCOUNT_ID;

//   if (!apiKey || !accountId) {
//     throw new Error("WIX_API_KEY or WIX_ACCOUNT_ID is not configured");
//   }

//   return createClient({
//     modules: { contacts, notes },
//     auth: ApiKeyStrategy({
//       apiKey,
//       accountId,
//     }),
//   });
// }

// interface ContactFormData {
//   name: string;
//   email: string;
//   phone?: string;
//   subject: string;
//   message: string;
// }

// /**
//  * POST /api/contact
//  * Receives contact form submissions and sends them via Wix CRM
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const wixClient = createWixClient();

//     // Parse request body
//     const body = (await request.json()) as ContactFormData;

//     // Validate required fields
//     if (!body.name || !body.email || !body.subject || !body.message) {
//       return NextResponse.json(
//         { message: "Missing required fields (name, email, subject, message)" },
//         { status: 400 }
//       );
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(body.email)) {
//       return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
//     }

//     const trimmedName = body.name.trim();
//     const [firstName, ...lastNameParts] = trimmedName.split(/\s+/);

//     const contactData = {
//       name: {
//         first: firstName || trimmedName,
//         last: lastNameParts.join(" ") || undefined,
//       },
//       emails: {
//         items: [{ email: body.email.trim(), primary: true, tag: "MAIN" as const }],
//       },
//       ...(body.phone?.trim()
//         ? {
//             phones: {
//               items: [{ phone: body.phone.trim(), primary: true, tag: "MAIN" as const }],
//             },
//           }
//         : {}),
//     };

//     // Create contact in Wix CRM
//     console.log("contactData:", contactData);
//     const result = await wixClient.contacts.createContact(contactData);

//     // Log successful submission (for debugging)
//     console.log("Contact created in Wix CRM:", result);

//     // Extract contact ID from the response
//     const contactId =
//       (result.contact && typeof result.contact === "object" && "_id" in result.contact
//         ? (result.contact._id as string)
//         : null) || "unknown";

//     if (contactId !== "unknown") {
//       await wixClient.notes.createNote({
//         contactId,
//         text: `Subject: ${body.subject}\nEmail: ${body.email}\nPhone: ${body.phone ?? ""}\n\n${body.message}`,
//         type: "NOT_SET",
//       });
//     }

//     return NextResponse.json(
//       {
//         message: "Message received! We'll get back to you soon.",
//         contactId,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     // Log error for debugging
//     console.error("Error submitting contact form:", error);

//     const detail =
//       typeof error === "object" && error !== null && "details" in error
//         ? String((error as { details?: unknown }).details)
//         : "";

//     // Return error response
//     return NextResponse.json(
//       {
//         message: "Failed to submit message. Please try again or contact us directly.",
//         error: error instanceof Error ? error.message : "Unknown error",
//         detail,
//       },
//       { status: 500 }
//     );
//   }
// }
