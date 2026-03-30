# Classyfitters Database Migration Guide

## Run Order (against `ecommerce_d` database)

Open phpMyAdmin → select `ecommerce_d` → Import each file **in order**:

| # | File | What it does |
|---|------|--------------|
| 1 | `001_production_schema.sql` | Adds new columns to `products`, creates `product_variants`, extends `product_images` with `variant_id`. Seeds categories and brands. |
| 2 | `002_products_fragrances.sql` | **Clears all existing product data**, inserts all Edenrobe & ClassyFitters fragrances with SEO titles, short/long descriptions. |
| 3 | `003_products_watches_handbags.sql` | Inserts deduplicated watch products + colour variants + handbags + jewellery. |
| 4 | `004_product_images.sql` | Maps all product images to products and variants. |

> ⚠️ Run in order. Files 2–4 depend on the schema created in file 1.
> ⚠️ File 2 **truncates** product data — don't run it twice unless you want to reset.

---

## Product Summary After Migration

| Category | Products | Notes |
|----------|----------|-------|
| Men's Perfumes (Edenrobe) | 13 | EDN-001 to EDN-013 |
| Women's Perfumes (Edenrobe) | 5 | EDN-004, 014, 015, 016, 031 |
| Body Mists (Edenrobe) | 8 | EDN-017 to EDN-024 |
| Body Sprays (Edenrobe) | 6 | EDN-025 to EDN-030 |
| Imported Fragrances (ClassyFitters) | 10 | CFS-001 to CFS-010 |
| Watches (ClassyFitters) | 21 | Deduplicated from 48 rows — colour variants in `product_variants` |
| Handbags | 10 | Coach ×5, Givenchy, Jacquemus, Miu Miu, Valentino, Floral |
| Jewellery | 2 | Gold Bangles Set, Gold Jhumka Earrings |
| **Total products** | **~75** | Down from 100+ raw rows — no duplicates |

## Watch Deduplication

| Original rows | Product | Variants |
|---|---|---|
| CFS-011, 012, 013, 021 | Rizen RZ-0895 | White, Silver, White-Black, Black |
| CFS-014, 015, 016 | Rizen RZ-0899 | Olive Green, Sage Green, Black |
| CFS-017, 018 | Rizen RZ-0889 | Brown, Black |
| CFS-022, 023, 024 | Patek Philippe Geneve chain | Silver, Rose Gold-Silver, Black Stones |
| CFS-031, 032, 034 | Tanox T-1668 | Black, Blue-Black, Red-Black |
| CFS-037, 040 | Tissot Powermatic 80 Silicium | Black, Brown |
| CFS-038, 039 | Tissot T-129210A | Black, Brown |
| CFS-041, 042, 043 | Tissot PRX Powermatic 80 | White-Silver, Black-Silver, Blue-Silver |
| CFS-046, 047, 048 | Curren chain | Green-Golden, Blue-Silver, White-Silver |

## Image Folder
All images are at:
```
classyfitters-product-images/products/<filename>
```
PHP resolves relative paths to full URLs automatically. No hardcoded URLs needed.

## New API Endpoints
| Endpoint | Purpose |
|----------|---------|
| `get_products.php?slug=<slug>` | Fetch by SEO slug |
| `get_products.php?category_slug=<slug>` | Filter by category slug |
| `get_product_variants.php?product_id=<id>` | Get colour/size variants with images |
| `get_product_images.php?product_id=<id>` | All images for a product |
