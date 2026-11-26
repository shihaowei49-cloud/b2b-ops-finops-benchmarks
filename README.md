# B2B Operations & FinOps Benchmarks

[Open the benchmark and calculators](https://shihaowei49-cloud.github.io/b2b-ops-finops-benchmarks/) · [Plain-text index](https://shihaowei49-cloud.github.io/b2b-ops-finops-benchmarks/llms.txt)

Editable worked scenarios for AI infrastructure cost, field photo closeouts, and apparel wholesale catalogs. All dollar rates in the showcase are illustrative USD inputs. The showcase calculators process inputs in the browser.

## Interactive tools

- [NutritionLabelPack](https://nutritionlabel.shihaoeth.site/) builds Nutrition Facts panels for U.S. packaging using 21 CFR 101.9 as the reference. Preview standard vertical, tabular, linear, dual-column, or bilingual English/Spanish layouts. Add UPC-A and export vector PDF or SVG. Specify 300 DPI when rasterizing for a print workflow that requires it.
- [SameFontPack](https://samefont.shihaoeth.site/) replaces raster text in the browser. Sample the background, match the font, stroke, and baseline, and export a fresh PNG or WebP with an output SHA-256 digest.
- [AIROIPack](https://airoipack.shihaoeth.site/) models automation ROI and payback, tests three scenarios for finance review, and charts 12 months of cash flow for a business proposal.
- [MAI Voice Budget](https://maivoice.shihaoeth.site/) estimates MAI-Voice-2 and MAI-Transcribe-2 pipeline cost and models GitHub Copilot code review organization billing ahead of the December 30, 2026 default change.
- [BudgetHub](https://budgethub.shihaoeth.site/) puts an AI budget and cached-token calculator on the homepage. The [token cost worksheet](https://budgethub.shihaoeth.site/tools/ai-token-cost-calculator) itemizes input, cache reads, and output charges.
- [CloseoutPack](https://closeout.shihaoeth.site/) pairs jobsite photos by work-order line. Use its [move-out inspection checklist](https://closeout.shihaoeth.site/tools/move-out-inspection-checklist) for handovers, the [change order template](https://closeout.shihaoeth.site/tools/construction-change-order-template) to record scope and price changes, and the [submittal log](https://closeout.shihaoeth.site/tools/construction-submittal-log-template) for revision and approval history.
- [LineSheetPack](https://linesheet.shihaoeth.site/) turns catalogs into buyer-specific line sheets. Use its [packing slip template](https://linesheet.shihaoeth.site/tools/wholesale-packing-slip-template), [product spec sheet](https://linesheet.shihaoeth.site/tools/product-spec-sheet-template), and [size-run order form](https://linesheet.shihaoeth.site/tools/wholesale-size-run-order-form) for fulfillment, product data, and per-size order quantities.

## MotionPack camera control

MotionPack uses Seedance 2.5 Pro, Seedance 2.0 Fast, and Seedream 5.0 Pro for photo-guided video, motion transfer, and staged product ads. [MotionPack studio](https://motionpack.shihaoeth.site/)

- **Real estate flythroughs** turn a start, curve, and target marked on a property photo into a Catmull–Rom trajectory plate for a single AI-generated HD shot. [Real estate drone flythrough generator](https://motionpack.shihaoeth.site/tools/real-estate-drone-flythrough-generator)
- **Hospitality and storefront tours** use the same path controls for a drawn approach to a hotel, rental, or shop entrance. The red path guides the shot and is automatically removed from the generated video. [Storefront and hotel FPV tour maker](https://motionpack.shihaoeth.site/tools/storefront-and-hotel-fpv-tour-maker)
- **Camera motion transfer** takes movement from a curated video reference and anchors the subject's appearance with one or two product or brand photos. [Copy camera motion from a reference video](https://motionpack.shihaoeth.site/tools/copy-camera-motion-from-reference-video)
- **Spoken ads** stage a 2K scene from a single product photo and turn it into a five- or ten-second clip with native English lip-sync. [AI product video generator from a photo](https://motionpack.shihaoeth.site/tools/ai-product-video-generator-from-photo)

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

- [CIPA Exif specification](https://www.cipa.jp/e/std/std-sec.html) defines the photo metadata used in the closeout example.
- [GS1 General Specifications](https://ref.gs1.org/standards/genspecs/) covers GTIN and barcode checks. [Shopify's product CSV documentation](https://help.shopify.com/en/manual/products/import-export/using-csv) explains the catalog import schema.
- [21 CFR 101.9](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9) defines U.S. Nutrition Facts declarations and layout rules.

The maintainers also publish the linked tools. The showcase code and worked examples use the [BSD Zero Clause License](LICENSE).
