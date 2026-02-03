import Script from "next/script";
let jsonLdCounter = 0;

export interface JsonLdProps {
  data: Record<string, unknown>;
  id?: string;
}

/**
 * Component to inject JSON-LD structured data into page head
 * Usage: <JsonLd data={generateProductSchema(...)} />
 */
export function JsonLd({ data, id }: JsonLdProps) {
  const scriptId = id || `json-ld-${++jsonLdCounter}`;
  return (
    <Script
      id={scriptId}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
}
