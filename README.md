# B2B Operations & FinOps Benchmarks

[Open the benchmark and calculators](https://shihaowei49-cloud.github.io/b2b-ops-finops-benchmarks/) · [Plain-text index](https://shihaowei49-cloud.github.io/b2b-ops-finops-benchmarks/llms.txt)

Editable worked scenarios for AI infrastructure cost, field photo closeouts, and apparel wholesale catalogs. All dollar rates are illustrative USD inputs. Calculator inputs stay in the browser.

## Worked benchmarks

| Workload | Formula | Fixture result |
| --- | --- | --- |
| LLM tokens | `(standard × input_rate + cached × cached_rate + output × output_rate) / 1,000,000` | 6M standard at $2.50/M, 6M cache reads at $0.25/M, and 0.12M output at $15/M give **$18.30/month**. The cached share is 50% of total input. |
| Voice sessions | `standby = min(call_s, pauses × max(0, pause_s − threshold_s))`; `cost = calls × ((call_s − standby) × active_rate + standby × standby_rate) / 60` | Four 45-second pauses with a 10-second threshold yield 140 standby seconds in a 480-second call. At $0.05 active and $0.02 standby per minute, 1,000 calls give **$330/month**. |
| Agent retries | `attempts = completed_tasks × turns / (1 − failure_fraction)`; `cost = attempts × mean_cost_per_attempt` | 4,500 tasks × 8 turns at 10% independent, retryable failures give 40,000 expected attempts. At $0.013164 each, the estimate is **$526.56/month**. |
| RAG and vector store | `generation + embeddings + vector_store + reranking + egress` | $18.30 + $0.30 + $30 + $6 + $0 = **$54.60/month**. Count retrieved chunks once if they are already in generation input. |
| Closeout appendix | `ceil(photo_count / photos_per_page)` | Seven photos at four per page take **two pages** before the cover or approvals. The PDF and open-items CSV share the work-order line ID. |
| Wholesale MOQ | `cases = ceil(minimum_units / units_per_case)`; `units = cases × units_per_case` | A 25-unit minimum with six per case rounds up to **5 cases or 30 units**. |
| GTIN and Shopify CSV | Apply alternating 3/1 weights from the right of the GTIN payload. The check digit is `(10 − sum mod 10) mod 10`. Use the product handle plus the full option tuple to check for duplicate Shopify variant rows. | **036000291452** passes with digit **2**. Keep barcodes as text to retain leading zeros and use a fresh Shopify export for current headers. |

For photo packets, store Before/After slots, line status, source filenames and capture time when available. Use the EXIF offset if present and flag uncertain time ordering for review. Apply orientation once to the review copy and preserve the original image. For wholesale, separate buyer-tier prices and validate style, size, color, SKU, case size, and MOQ before export.

## CLI and GitHub Pages

From this directory, start the dependency-free preview and open `http://127.0.0.1:8000/`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Run the same formula module from Node.js.

```sh
node --input-type=module <<'JS'
import { gtin, llm, moq, photoPages } from "./benchmarks.mjs";
console.log(llm({
  requests: 3000, inputTokens: 4000, cachedPercent: 50, outputTokens: 40,
  inputRate: 2.50, cachedRate: 0.25, outputRate: 15,
}).toFixed(2)); // 18.30
console.log(photoPages({ photos: 7, perPage: 4 })); // 2
console.log(moq({ minimum: 25, caseSize: 6 })); // { units: 30, cases: 5 }
console.log(gtin({ code: "036000291452" })); // { valid: true, checkDigit: 2 }
JS
```

Place this directory's contents at the root of the `b2b-ops-finops-benchmarks` repository and use GitHub Pages **Deploy from a branch** with `main` and `/(root)`. The project sitemap is under the repository path. Google reads crawler rules from the hostname's root `/robots.txt`. [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Google robots.txt documentation](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

## References

- **FinOps** · [BudgetHub](https://budgethub.shihaoeth.site/) · [RAG and vector database TCO](https://budgethub.shihaoeth.site/tools/rag-vector-db-tco-calculator) · [LLM Token Estimator](https://llmtoken.shihaoeth.site/) · [Voice Budget](https://voicebudget.shihaoeth.site/) · [Agent Retry and Prompt Cache](https://apicache.shihaoeth.site/ai-agent-retry-and-prompt-cache-tco.html)
- **Closeout** · [CIPA Exif specification](https://www.cipa.jp/e/std/std-sec.html) · [CloseoutPack](https://closeout.shihaoeth.site/) · [Subcontractor Daily Report Generator](https://closeout.shihaoeth.site/tools/subcontractor-daily-report-generator) · [JobQuote](https://jobquote.shihaoeth.site/) · [PunchList](https://punchlist.shihaoeth.site/)
- **Wholesale** · [GS1 General Specifications](https://ref.gs1.org/standards/genspecs/) · [Shopify product CSV documentation](https://help.shopify.com/en/manual/products/import-export/using-csv) · [LineSheetPack](https://linesheet.shihaoeth.site/) · [Wholesale Order Form Generator](https://linesheet.shihaoeth.site/tools/wholesale-order-form-generator) · [MOQ Calc](https://moqcalc.shihaoeth.site/) · [CSV Clean](https://csvclean.shihaoeth.site/shopify-product-csv-variant-validator.html) · [Barcode Lab](https://barcodelab.shihaoeth.site/gs1-gtin-check-digit-and-upc-ean-validator.html)

The maintainers also publish the linked tools. The showcase code and worked examples use the [BSD Zero Clause License](LICENSE).
