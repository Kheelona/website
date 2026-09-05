# UTM conventions

**Written 2026-09-05, from the Ahrefs Web Analytics export for the fortnight to that date.**

## Why this exists

`UtmCampaign.csv` and `UtmTerm.csv` in that export are **100% "Direct / None"**. `UtmMedium.csv`
has five tagged visits in total. The only meaningful tagged source is `chatgpt.com`, which ChatGPT
appends by itself.

A Meta Pixel has been running since 2026-09-01 for Facebook and Instagram advertising (§8.30). The
moment that spend starts, every click lands in "Direct / None" and no report can tell a winning ad
from a losing one. Attribution cannot be reconstructed after the fact: an untagged click is
untagged forever.

This is not in the agency handoff, which deferred analytics work. It is cheap now and unrecoverable
later, which is the whole argument.

## The scheme

Every inbound link **we control** carries `utm_source`, `utm_medium` and `utm_campaign`. The other
two are optional and only earn their place on paid search and on creative tests.

| Parameter | Required | Values | Notes |
|---|---|---|---|
| `utm_source` | yes | `facebook` `instagram` `google` `linkedin` `whatsapp` `youtube` `newsletter` `qr` | The property, lowercase, no spaces. Never a campaign name. |
| `utm_medium` | yes | `cpc` `paid_social` `organic_social` `email` `referral` `print` | How it was bought or placed, never who placed it. |
| `utm_campaign` | yes | `<yyyy-mm>-<slug>` | e.g. `2026-10-launch`, `2026-09-preorder-500`. The date prefix sorts chronologically and survives a repeated theme. |
| `utm_content` | when testing | `<creative>-<variant>` | e.g. `rabbit-hero-a`. This is the only field that identifies a creative, so an ad test is unreadable without it. |
| `utm_term` | paid search only | the keyword | Leave empty everywhere else. |

## Rules

1. **Lowercase, hyphens, no spaces.** `Paid_Social` and `paid_social` are two different rows in
   every analytics tool that exists. Casing drift is the most common way a report fragments.
2. **Never tag an internal link.** A UTM on a link from one page of kheelona.com to another
   restarts the session and destroys the original attribution. The site's own links stay clean.
3. **Tag the destination a parent should land on**, not the home page. A Story-mode ad goes to
   `/products/kheelu#story-mode`, not `/`.
4. **Tag QR codes too.** The Ideabaaz event printed QR codes; anything printed is impossible to
   change later, so it must be tagged before it goes to print.
5. **`utm_source=chatgpt.com` is theirs, not ours.** Do not create a campaign that collides with
   the value an AI assistant appends by itself, or the two become indistinguishable.

## Worked examples

```text
Meta, paid, launch creative test, variant A
https://kheelona.com/products/kheelu?utm_source=instagram&utm_medium=paid_social&utm_campaign=2026-10-launch&utm_content=rabbit-hero-a

Instagram bio link
https://kheelona.com/?utm_source=instagram&utm_medium=organic_social&utm_campaign=2026-09-bio

Printed QR at an event
https://kheelona.com/products/kheelu?utm_source=qr&utm_medium=print&utm_campaign=2026-09-ideabaaz
```

## What survives a redirect

Next returns 308 for `permanent: true` and **preserves the query string**, so a UTM on
`/products/lumi` still arrives on `/products/kheelu` with its parameters intact. Verified
2026-09-05 with `utm_source=rename-test`. Old tagged links therefore keep working after the rename,
which is one reason the redirect is permanent rather than temporary.

## What this does not cover

Ad-platform auto-tagging (Google's `gclid`, Meta's `fbclid`) is separate and already works; it does
not replace UTMs, because it only reports inside that platform's own dashboard. The two coexist.
