// AWS spike only (K-150, check 10). Never merged: lives on growth/2026-W48/aws-spike.
//
// Returns the few request fields that show which client address a function behind CloudFront
// sees, so the spike can tell what src/lib/store/rate-limit.ts clientKey() would use. It returns
// NOTHING else: no cookies, no other headers, no body. It logs nothing (addresses are personal
// data), and removing the stage removes it.
export const handler = async (event) => {
  const headers = event.headers ?? {};
  const body = {
    "x-forwarded-for": headers["x-forwarded-for"] ?? null,
    "x-real-ip": headers["x-real-ip"] ?? null,
    "x-forwarded-host": headers["x-forwarded-host"] ?? null,
    host: headers.host ?? null,
    via: headers.via ?? null,
    "cloudfront-viewer-address": headers["cloudfront-viewer-address"] ?? null,
    "x-amzn-trace-id-present": "x-amzn-trace-id" in headers,
    sourceIp: event.requestContext?.http?.sourceIp ?? null,
  };
  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
    body: JSON.stringify(body),
  };
};
