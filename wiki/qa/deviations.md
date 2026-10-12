---
title: "Approved deviations from the Gate A mockups"
type: qa
updated: 2026-10-13
sources: [../engineering/tasks.md, ../engineering/architecture.md, ../qa/test-plan.md, "build-wave runs wf_3a360d0e-7b7 and wf_8e83e0d9-f82 (wave 3 reviews)"]
---

# Approved deviations from the Gate A mockups

The visual-parity rule ([test plan §6](test-plan.md), [tasks SPA 1](../engineering/tasks.md#standard-page-acceptance-spa))
treats a chunk over tolerance as a defect unless the main session lists it here. Each row says what differs, why,
who decided, and what the founder sees at Gate B. Founder decisions after Gate A (D048-D051) are listed only when
they change a parity chunk.

| # | Page and fold | What differs from the mockup | Why | Decided | Parity effect |
|---|---|---|---|---|---|
| V1 | Store, fold 7 (store footer) | The line "No payment fees. Nothing recurring. Payments by Razorpay." with its "How to raise a chargeback with your bank" link (`mockup/pages/store.html:219`) renders as the last line of the store page's `main` (task 5.15), not inside the footer | The store layout's policy links are a frozen checkout contract (`test/guards/fixtures/checkout-contract/store-layout.json`, never edited, ADR-013); a sixth link `refund#chargeback` in the layout would be a checkout change (3.1 review finding 2) | Main session, 2026-10-13 (wave-3 close) | The footer chunk and the chunk above it at each width; `chrome.spec.ts` strips the line from the footer golden and cites this row |
| V2 | Home, product and store: the parent films strip | With motion on, each film tile is about 25 px taller at 390 (27 px at 1440), and phones 430-719 px wide get a wider gap, so the film in focus can grow (D049 pick 8) without covering its chip, caption or a neighbour | The mockup's scale overlapped the tile's own chip (3.3 review, blocking) | Main session, 2026-10-13; the founder sees it at Gate B | None: parity runs with reduced motion, where the layout is the mockup's |
| V3 | Product, fold 7 (details) without JavaScript | The tab row stays hidden and the three panels stack; the mockup's no-JavaScript render shows the tab row above the stacked panels (the DS `.kh-tabs__list { display: flex }` beats `hidden`) | A defect in the mockup's fallback; with JavaScript the build matches the approved tabs (P1, N21 corrected, task 3.5) | Main session, 2026-10-13 | Visual parity: none (JavaScript on). **Text parity, JavaScript-off pass** (SPA 2 compares it with the mockup's JavaScript-on text): the build's text lacks the second "Specs" (tab label and hidden heading) and adds the In the box and Safety panel lines; 5.2 records this as a `TEXT_DEVIATIONS` entry for `/products/kheelu` citing V3 (3.5 review) |
