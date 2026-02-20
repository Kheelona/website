export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("https://kheelona.com/_functions/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.text();

    return new Response(data, {
      status: res.status,
    });
  } catch (error) {
    console.error("Error in contact API route:", error);
    return new Response("Internal Server Error", { status: 500 });
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
