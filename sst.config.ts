/// <reference path="./.sst/platform/config.d.ts" />

/**
 * AWS move, Phase 2 spike (card K-150, action 2026-W48-AWS3).
 *
 * SPIKE ONLY. This file lives on the branch growth/2026-W48/aws-spike, which is never merged.
 * Deployed only by .github/workflows/aws-spike.yml, with the PREVIEW role
 * (kheelona-website-deploy-preview) through the GitHub environment aws-preview. Stage "spike"
 * only. There are no store secrets here: the six store variables below are the non-secret
 * placeholders of the local gate method (S5b serve.sh), so the store renders in token mode and
 * no live service is reached.
 *
 * The role is fenced by infra/bootstrap.yaml (the boundary kheelona-website-boundary), so:
 *  - every IAM role gets the boundary and a name that starts kheelona-website-spike-;
 *  - every Lambda function, log group, S3 bucket, SQS queue and DynamoDB table gets an explicit
 *    name that starts kheelona-website-spike- (SST would otherwise shorten the names and drop
 *    the app name, which the fence's name patterns would not match);
 *  - the provider tags every resource project=website and stage=spike (untagged creates are
 *    refused by the boundary);
 *  - the account ID is read at run time (aws.getCallerIdentity), never written in this file.
 *
 * The OpenNext build is done in an earlier job that has no AWS access. SST only deploys that
 * prebuilt output: buildCommand just checks that it is there.
 */

// Pure helpers (no SST globals, no imports: sst.config.ts is bundled by SST).

const PREFIX = "kheelona-website-spike-";

/** 32-bit FNV-1a, 8 hex characters. Deterministic, used only to keep truncated names unique. */
function shortHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/**
 * kheelona-website-spike-<logical name>, never longer than `max` characters.
 * If it would be longer, the logical name is cut and "-<8 hex>" of the full logical name is
 * added, so the result is still deterministic and unique. `suffix` (e.g. ".fifo") is always kept.
 * S3 bucket names must be lowercase, so they pass lower: true.
 */
function spikeName(
  logicalName: string,
  max: number,
  options: { lower?: boolean; suffix?: string } = {},
): string {
  const suffix = options.suffix ?? "";
  let slug = logicalName.replace(/[^A-Za-z0-9]/g, "");
  if (options.lower) slug = slug.toLowerCase();
  const full = `${PREFIX}${slug}${suffix}`;
  if (full.length <= max) return full;
  const hash = shortHash(logicalName);
  const room = max - PREFIX.length - suffix.length - hash.length - 1;
  return `${PREFIX}${slug.slice(0, Math.max(room, 1))}-${hash}${suffix}`;
}

// The six store variables, non-secret placeholders exactly as in the S5b serve.sh. src/lib/store/env.ts
// treats a value as missing only if it is empty, contains "DUMMY" or starts with "<".
const STORE_PLACEHOLDERS = {
  SUPABASE_URL: "http://127.0.0.1:9", // nothing listens: the offer count fails closed -> token mode
  SUPABASE_SERVICE_ROLE_KEY: "placeholder",
  RAZORPAY_KEY_ID: "rzp_placeholder",
  RAZORPAY_KEY_SECRET: "placeholder",
  RAZORPAY_WEBHOOK_SECRET: "placeholder",
  STORE_SIGNING_SECRET: "placeholder-signing-secret-0123456789abcdef",
};

// SST runs this itself on `diff` and `deploy`. It must not build: it only proves the build job's
// output is in place. The three .next files are read by SST's Nextjs plan from the site root.
const PREBUILT_CHECK =
  [
    "test -f .open-next/open-next.output.json",
    "test -f .next/BUILD_ID",
    "test -f .next/routes-manifest.json",
  ].join(" && ") +
  ' || { echo "No prebuilt OpenNext output here. Run the build job first." >&2; exit 1; }';

export default $config({
  app(input) {
    if (input.stage !== "spike") {
      throw new Error(
        `This config deploys the stage "spike" only (got "${input.stage}"). Use: sst <diff|deploy|remove> --stage spike`,
      );
    }
    return {
      name: "kheelona-website",
      version: "4.17.2",
      home: "aws",
      removal: "remove",
      providers: {
        aws: {
          region: "ap-south-1",
          // SST adds sst:app and sst:stage itself. The boundary refuses untagged creates.
          defaultTags: { tags: { project: "website", stage: input.stage } },
        },
      },
    };
  },

  async run() {
    // Built at run time from the caller identity: no account ID or ARN in the repo.
    const caller = await aws.getCallerIdentity({});
    const boundaryArn = `arn:aws:iam::${caller.accountId}:policy/kheelona-website-boundary`;

    // Transforms only apply to resources created AFTER they are registered: keep them first.

    // Every SST Function (the Next.js server, image optimizer, ISR seeder and revalidation
    // subscriber, and the echo). `name` sets the Lambda name and its log group
    // (/aws/lambda/<name>), so both start kheelona-website-spike- and match the fence.
    $transform(sst.aws.Function, (args, _opts, name) => {
      args.name = spikeName(name, 64);
    });

    // Every IAM role: the boundary and a fenced name (the fence allows only
    // role/kheelona-website-* and only with the boundary attached).
    $transform(aws.iam.Role, (args, _opts, name) => {
      args.name = spikeName(name, 64);
      args.permissionsBoundary = boundaryArn;
    });

    // The assets bucket (S3 is fenced by name only; names are lowercase, at most 63).
    $transform(aws.s3.Bucket, (args, _opts, name) => {
      args.bucket = spikeName(name, 63, { lower: true });
    });

    // The ISR revalidation queue is FIFO: SST adds ".fifo" itself, so keep it.
    $transform(aws.sqs.Queue, (args, _opts, name) => {
      args.name = $output(args.fifoQueue).apply((fifo) =>
        spikeName(name, 80, { suffix: fifo ? ".fifo" : "" }),
      );
    });

    // The ISR tag cache.
    $transform(aws.dynamodb.Table, (args, _opts, name) => {
      args.name = spikeName(name, 255);
    });

    // CloudFront functions, key-value stores and cache policies cannot be fenced by name or tag
    // (bootstrap.yaml, Q4), but a recognisable prefix shows whose they are in the console.
    $transform(aws.cloudfront.Function, (args, _opts, name) => {
      args.name = spikeName(name, 64);
    });
    $transform(aws.cloudfront.KeyValueStore, (args, _opts, name) => {
      args.name = spikeName(name, 64);
    });
    $transform(aws.cloudfront.CachePolicy, (args, _opts, name) => {
      args.name = spikeName(name, 128);
    });

    // The site: CloudFront + server Lambda + image optimizer + S3 assets + ISR queue/table.
    const site = new sst.aws.Nextjs("Site", {
      openNextVersion: "4.1.16", // @opennextjs/aws, pinned (SST 4.17.2 would default to 3.9.14)
      buildCommand: PREBUILT_CHECK,
      server: {
        runtime: "nodejs24.x",
        architecture: "arm64",
        memory: "1536 MB",
        timeout: "30 seconds",
      },
      warm: 0, // no warmer: cold starts are measured in the spike
      // protection is left at SST's default, "none" (founder, 18 Nov): the function URLs are
      // public so POSTs work and the store host can be checked with x-forwarded-host.
      environment: {
        KH_SITE_ENV: "production",
        ...STORE_PLACEHOLDERS,
      },
      transform: {
        // Not a `server` prop in SST 4.17.2: reserved concurrency goes through the Function args.
        // Caps cost and the share of the account's Lambda concurrency while the spike URL is public.
        server: { concurrency: { reserved: 10 } },
        // Founder, 18 Nov (Q-S15): its function URL is public under protection "none", so cap it too.
        imageOptimizer: { concurrency: { reserved: 5 } },
      },
    });

    // Spike-only echo (check 10): shows which X-Forwarded-For / X-Real-IP a function behind
    // CloudFront receives. Removed with the stage. Fronted by its own router distribution.
    const echo = new sst.aws.Function("Echo", {
      handler: "infra/spike/echo.handler",
      runtime: "nodejs24.x",
      architecture: "arm64",
      memory: "128 MB",
      timeout: "10 seconds",
      url: true,
      concurrency: { reserved: 2 },
      description: "kheelona website spike: request-header echo (no cookies, no body)",
    });
    const echoRouter = new sst.aws.Router("EchoRouter");
    echoRouter.route("/", echo.url);

    return {
      url: site.url, // the site's CloudFront URL
      serverUrl: site.nodes.server.apply((server) => server.url), // the server function URL (store-host checks)
      echoUrl: echoRouter.url, // echo behind CloudFront
      echoFunctionUrl: echo.url, // echo, direct
    };
  },
});
