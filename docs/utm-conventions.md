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

## Building a link

`npm run utm` builds a URL to this scheme, or refuses and says why. Use it rather
than typing parameters by hand — the two mistakes that matter are both silent.

```text
npm run utm -- --source=instagram --medium=paid_social \
               --campaign=2026-10-launch --path=/products/kheelu \
               --content=rabbit-hero-a
```

It refuses an unknown source or medium, a campaign without the `yyyy-mm` prefix,
any uppercase, a `utm_term` outside paid search, and a path that is already
tagged. Every refusal names the rule it is enforcing.

The vocabulary in the table above is the source of truth: `test/utm.test.ts`
parses this file and fails if the tool and the doc ever disagree, so adding a
source here without adding it to the tool (or the reverse) breaks the suite
rather than shipping a value that reports cleanly and aggregates with nothing.
The same test asserts the worked example below is exactly what the tool emits.

## What the site already captures

`create-order` copies the landing URL's `utm_` values onto the order row, so a
paid pre-order can be traced back to the ad that caused it — not just the visit.
That is the half that makes tagging worth doing, and it already works; it has
simply had nothing to record, because nothing has been tagged. A test asserts
this keeps working, and a companion test asserts no internal link is ever
tagged, since rule 2 is the one whose breach destroys the data silently.

## What survives a redirect

Next returns 308 for `permanent: true` and **preserves the query string**, so a UTM on
`/products/lumi` still arrives on `/products/kheelu` with its parameters intact. Verified
2026-09-05 with `utm_source=rename-test`. Old tagged links therefore keep working after the rename,
which is one reason the redirect is permanent rather than temporary.

## What this does not cover

Ad-platform auto-tagging (Google's `gclid`, Meta's `fbclid`) is separate and already works; it does
not replace UTMs, because it only reports inside that platform's own dashboard. The two coexist.
