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
values ('blr-sep-expo', 'Bangalore expo price', 9900, 100, '2026-09-30');
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
STORE_SIGNING_SECRET=<the deployment's value> npm run event-link -- blr-sep-expo
```

It prints `https://store.kheelona.com/e/blr-sep-expo?sig=...`. The secret must be
the same one the deployment uses, or the link will not verify. If you rotate
`STORE_SIGNING_SECRET`, every printed QR code stops working, so do not rotate it
during an event.

**3. Make the QR code** from that full URL, including the `?sig=` part. Any QR
generator is fine. Print it large enough to scan from a metre away, and put the
price beside it in words: a parent should know it is ₹99 before they scan.

## During the event

The page shows the label and the ₹99 amount, and the summary panel still states
the full ₹4,999 price and the ₹4,500 balance. That is deliberate: an event price
that hides what happens next is the fastest way to a refund request.

If the link stops working, the page says which of the three reasons it was and
offers the ₹499 price instead, so nobody is left stuck at a stall. You can lift a
cap mid-event by editing the row.

## After the event

Set `active` to false, or leave the expiry to do it. Event orders are ordinary
rows in `preorders` with `tier` set to the event id, so:

```sql
select count(*), sum(amount_paise) / 100 as rupees
from preorders where tier = 'blr-sep-expo' and status = 'paid';
```

That is your event's conversion, and it is the number worth carrying into the
decision about the next one.
