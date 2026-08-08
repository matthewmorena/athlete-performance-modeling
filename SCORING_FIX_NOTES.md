# 10,000m scoring fix

The event normalizer removed commas before checking distances. `10,000` therefore became `10000`, but the prior `compact.includes("1000")` check matched first and classified it as the 1,000m.

That misclassification triggered the 1,000m-to-800m conversion and then evaluated the 800m quadratic formula using a roughly 1,250-second converted mark, producing ratings above 200,000.

The fix:

- checks 10,000m before 1,000m;
- uses anchored exact-distance regular expressions rather than substring checks;
- supports `10,000`, `10000`, `10,000m`, `10000m`, and `10k` while preserving XC handling.
