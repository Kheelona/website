---
title: "D060: The beta links open to the public (no Vercel login)"
type: decision
updated: 2026-10-14
sources: ["founder's answer in the build session, 2026-10-14 (\"can we make it live for public?\", then \"Open the beta links\")", D048-beta-deployment.md, D051-beta-without-store-integrations.md, ../qa/gate-b-pack.md]
---

# D060: The beta links open to the public (no Vercel login)

## Context

The founder asked to make the rebuilt site public. Two readings were offered: open the beta links
(betawebsite.kheelona.com, betastore.kheelona.com) to anyone, or go live on kheelona.com (Gate B). Gate B cannot happen
yet: a production build stops while `/privacy`, `/terms`, `/refund` and `/shipping` are drafts (D029), and beta QA,
the founder's open questions and the Gate B OK are still to come ([Gate B pack](../qa/gate-b-pack.md)).

## Options

1. Open the beta links: anyone with the link sees the rebuild, no Vercel login.
2. Go live on kheelona.com (Gate B), replacing the live site.

## Choice

**Option 1: open the beta links.** The founder turns off Vercel Authentication in the Vercel dashboard (Settings →
Deployment Protection); the main session never changes Vercel settings (CLAUDE.md). On the Hobby plan the switch
covers every preview deployment, not only `beta`. What a public visitor gets, unchanged by this decision:

- **noindex, nofollow on every response** of a beta build (`next.config.ts` headers; the proxy on HTML routes; D048);
- **no payment**: the store answers "Pre-orders open here shortly." with the WhatsApp button (D051;
  `src/app/store/_components/StoreNotConfigured.tsx`);
- Meta, GA4 and Ahrefs off; PostHog tagged `env=beta` (D051);
- the four legal pages marked as drafts until the legal sign-off (D029).

kheelona.com stays the live site until Gate B.

## Why

The founder's choice. It also lets the main session run beta QA (task 7.2) without the bypass secret.

**Approved by.** Founder. **Date.** 2026-10-14.
