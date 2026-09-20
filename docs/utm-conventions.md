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

---

## Paid social, and why it is different (2026-09-20)

**The links above are built by hand with `npm run utm`. Meta's are not.** They are configured once in
the ad's URL parameters field, using Meta's dynamic variables, and Meta fills them in per impression.
That is the whole reason this section exists: the builder cannot refuse what it never sees, so the
rules have to be written where the person setting up the ad will read them.

### What to put in the ad's URL parameters

```
utm_source=facebook
utm_medium=paid_social
utm_campaign={{campaign.name}}
utm_content={{ad.name}}
utm_id={{campaign.id}}
placement={{placement}}
```

### 🔴 Never `{{site_source_name}}`

It was in use until 2026-09-20 and it is the reason this section was written. It emits **`an`**,
**`fb`** and **`ig`** — the *placement* in the *source* field. Three channels where there is one, none
of them the `facebook` this document has specified since 2026-09-05, and `npm run utm` refuses all
three outright. Spend will not join to sessions, because there is nothing called "facebook" to join
to.

The placement is genuinely worth knowing — it is how Audience Network is told from Feed, and that
distinction found a real problem. It belongs in `placement`, its own field, not smuggled into the
source.

### `utm_campaign` still has to be `<yyyy-mm>-<slug>`

`{{campaign.name}}` emits whatever the campaign is called in Meta, so **rename the campaigns
themselves** to `2026-10-launch` form. Then the variable produces a conforming value on its own, and
the readable name replaces `120248101035710340` in every report. Renaming is the fix; loosening the
convention is not.

The same applies to `{{ad.name}}`: rule 1 is lowercase and hyphens, so an ad called
`Rabbit Hero A` becomes two different rows the moment anything URL-encodes it. Name ads
`rabbit-hero-a`.

### `utm_term` stays empty

Paid search only, as the table above says. `{{adset.name}}` does not go here. If the ad set matters,
it belongs in `utm_content` alongside the creative.

### Instagram

Meta-bought Instagram traffic is still `utm_source=facebook`, because the spend is one account and
one join. `placement` is what separates `instagram_feed` from `facebook_feed`. The `instagram` source
in the table above is for ORGANIC Instagram, which is a different channel with a different cost.

### These two fields needed code, and that is the transferable lesson

`utm_id` and `placement` are **not `utm_` keys**, so nothing picked them up by default. Our own
allowlist dropped them, and posthog-js's built-in campaign-parameter list contains neither (it covers
`utm_*` plus about twenty click ids). They would have arrived nowhere while looking perfectly tagged
in the Meta UI.

Both are now in `CAMPAIGN_KEYS` (`src/lib/campaign.ts`) and in `custom_campaign_params` on
`PostHogGate`, which posthog-js concatenates onto its defaults. **Before adding a parameter to an ad,
check it is in `CAMPAIGN_KEYS` — a parameter this repo does not name is a parameter that silently
goes nowhere.** `test/utm.test.ts` pins this section's block against that list so the two cannot
drift.
