# Running an event price (₹99 at a stall)

The store sells the same reservation at a different price behind a signed link,
so a family at an expo can pre-order for ₹99 while the public price stays ₹499.
Three things make that safe, and you need all three:

- **A signature**, so nobody can mint a cheap link by guessing a slug.
- **A cap**, so a forwarded link stops working after the allocation is gone.
- **An expiry**, so it stops working after the event regardless.

A printed QR code can be photographed and put in a group chat. Signing cannot
prevent that; the cap and the expiry are what make it not matter.

## Before the event

**1. Create the tier** in Supabase (Table editor, `event_tiers`, Insert row), or
paste this into the SQL editor with your own values:

```sql
insert into event_tiers (id, label, amount_paise, cap, expires_on)
values ('blr-oct-expo', 'Bangalore expo price', 9900, 100, '2026-10-15');
```

- `id` is lowercase letters, numbers and hyphens. It appears in the URL.
- `label` is shown to the parent, beside the amount. Write it as a price, not as
  a discount: "Bangalore expo price", never "50% off".
- `amount_paise` is PAISE. ₹99 is `9900`. Getting this wrong by a factor of a
  hundred is the one mistake here that costs real money, so read it twice.
- `cap` is how many can be sold at this price. Set it to the number of units you
  are prepared to honour, not to the number of people you expect.
- `expires_on` is the last day the link works, inclusive.

**2. Generate the link:**

```
STORE_SIGNING_SECRET=<the deployment's value> npm run event-link -- blr-oct-expo
```

It prints `https://store.kheelona.com/e/blr-oct-expo?sig=...`. The secret must be
the same one the deployment uses, or the link will not verify. If you rotate
`STORE_SIGNING_SECRET`, every printed QR code stops working, so do not rotate it
during an event.

**3. Make the QR code** from that full URL, including the `?sig=` part. Any QR
generator is fine. Print it large enough to scan from a metre away, and put the
price beside it in words: a parent should know it is ₹99 before they scan.

## During the event

The page shows the label and the ₹99 amount, and the summary panel still states
the full ₹4,999 price and the balance it still needs — derived from THIS token,
so a ₹99 booking reads ₹4,900, never the public ₹4,500 (2026-08-23; the receipt
and the thanks page derive the same way, from the order row). That is
deliberate: an event price that hides what happens next is the fastest way to a
refund request.

If the link stops working, the page says which of the three reasons it was and
offers the ₹499 price instead, so nobody is left stuck at a stall. You can lift a
cap mid-event by editing the row.

## After the event

Set `active` to false, or leave the expiry to do it. Event orders are ordinary
rows in `preorders` with `tier` set to the event id, so:

```sql
select count(*), sum(amount_paise) / 100 as rupees
from preorders where tier = 'blr-oct-expo' and status = 'paid';
```

That is your event's conversion, and it is the number worth carrying into the
decision about the next one.

## A public partner page (the /ideabaaz pattern, §8.25-g-i)

Sometimes the audience hears a URL from a stage instead of scanning a QR. For
that, a dedicated route (`src/app/store/<partner>/page.tsx`, reached as
`store.kheelona.com/<partner>`) signs its own tier server-side and renders the
same form — plus the partner's logo chip and the struck-through public price.
First use: `/ideabaaz` for Ideabaaz Startup Fest (₹99, expires 2026-08-31,
capless by founder decision, closed by hand after the fest).

What changes against a QR link: the URL is public, so signing no longer
contains anything — the expiry, any cap, and your manual close are the whole
containment. What does not change: the tier is still a dashboard row (create it
the same way as above), the amount is still read server-side, and the page still
needs no `?sig=` because it computes its own. Prefer a QR link for a stall;
prefer a page when the URL itself is the handout. To close one early, set
`active=false` — the page then renders its "has ended" state, which points at
the regular store.

One trap: with the local DUMMY `.env` the page can only render its not-open
state. To see the live ₹99 page locally, run `node tools/qa/supabase-stub.mjs`
and start the server with the stub's env (the stub's header comment carries the
exact incantation).

## Events and the 500-unit cap (2026-08-23, §8.26)

The public store's cap gate does not touch event links: a signed ₹99 QR keeps
working in either mode, contained by its own cap and expiry, and the event page
always renders the token-shaped form and summary — an event token is a token.

Two interactions to know. Paid event orders COUNT toward the 500 (they consume
real first-batch units at the held price). And keeping an event live after the
public flip to ₹7,999 is a decision, not an accident: that QR re-opens the
₹4,999 ladder for whoever holds it, which may be exactly the point of the event
or may be a leak, so decide per event.

## The confirmation link changed shape (2026-08-23, §8.28-b)

A receipt's "Add it here" link is still `…/thanks?ref=KH-…&t=<token>` and still works exactly as it
always did for a customer. What changed is what happens on arrival: `src/proxy.ts` consumes the token
into an HttpOnly cookie and 303s the browser to a clean `/thanks`, because that page carries three
measurement tags and every one of them reports the URL it loaded on. So if you are debugging and see
a 303 with a `Set-Cookie` where you expected a rendered page, that is correct.

Two consequences for anyone operating this. A bare `/thanks` with no cookie is now a real page saying
"We need your link again" rather than a 404, so it appears in `qa:sweep`. And rotating
`STORE_SIGNING_SECRET` invalidates every address link already emailed — the runbook step for that is
`security-review.md` section 5b.
