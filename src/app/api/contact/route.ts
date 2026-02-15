import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { contacts } from "@wix/crm";

// Initialize Wix client with CRM module for contacts
const wixClient = createClient({
  modules: { contacts },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
  }),
});

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * POST /api/contact
 * Receives contact form submissions and sends them via Wix CRM
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = (await request.json()) as ContactFormData;

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { message: "Missing required fields (name, email, subject, message)" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // Create or update contact in Wix CRM
    const contactData = {
      source: {
        sourceType: "OTHER",
      },
      firstName: body.name.split(" ")[0] || body.name,
      lastName: body.name.split(" ").slice(1).join(" ") || "",
      emails: {
        emails: [body.email],
      },
      ...(body.phone && {
        phones: {
          phones: [body.phone],
        },
      }),
      info: {
        customFields: [
          {
            key: "subject",
            value: body.subject,
          },
          {
            key: "message",
            value: body.message,
          },
          {
            key: "submissionDate",
            value: new Date().toISOString(),
          },
        ],
      },
    };

    // Create contact in Wix CRM
    const result = await wixClient.contacts.createContact(contactData as any);

    // Log successful submission (for debugging)
    console.log("Contact created in Wix CRM:", result);

    // Extract contact ID from the response
    const contactId =
      (result.contact && typeof result.contact === "object" && "_id" in result.contact
        ? (result.contact._id as string)
        : null) || "unknown";

    return NextResponse.json(
      {
        message: "Message received! We'll get back to you soon.",
        contactId,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging
    console.error("Error submitting contact form:", error);

    // Return error response
    return NextResponse.json(
      {
        message: "Failed to submit message. Please try again or contact us directly.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
