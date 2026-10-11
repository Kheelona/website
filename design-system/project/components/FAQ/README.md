# FAQ

Rounded accordion items built on native `<details>`, with a plus sign that turns into a cross.

**Use it for:** "Questions parents ask first" on the website, the safety page and checkout reassurance.

**Props:** `items` (an array of `{ q, a, open? }`). `a` is a string or React nodes.

**Rules**
- Questions are in the parent's own words ("Is Kheelu always listening?"). Answers start with the answer ("No.") and stay under 60 words, linking out for depth.
- Use 5–8 items, ordered by sales impact: safety, price, ages, languages, shipping, internet.
- Answers use only approved facts. Open the first item by default on safety pages only.
