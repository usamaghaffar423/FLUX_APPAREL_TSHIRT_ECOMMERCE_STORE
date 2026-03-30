<?php
/**
 * Migration: Assign correct images to all products
 * Run once: http://localhost/T-SHIRT-ECOMMERCE-STORE/api/migrations/assign_product_images.php
 */
require_once dirname(__DIR__) . '/config.php';
$pdo = getDbConnection();

// ── Fragrance Unsplash pool (10 unique perfume images) ──────────────────────
$perfumeImgs = [
    'https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1592945403407-9caf930a9a44?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1537236268012-d02ca4eb1c47?auto=format&fit=crop&q=80&w=800',
];

// ── Product → image mapping ─────────────────────────────────────────────────
// Local paths resolve to images/products/ (web-accessible via XAMPP)
$map = [
    // ── Clothing ──────────────────────────────────────────────────────────
    1  => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',

    // ── Fragrance (IDs 2–32, cycle through perfume pool) ──────────────────
    2  => $perfumeImgs[0],
    3  => $perfumeImgs[1],
    4  => $perfumeImgs[2],
    5  => $perfumeImgs[3],
    6  => $perfumeImgs[4],
    7  => $perfumeImgs[5],
    8  => $perfumeImgs[6],
    9  => $perfumeImgs[7],
    10 => $perfumeImgs[8],
    11 => $perfumeImgs[9],
    12 => $perfumeImgs[0],
    13 => $perfumeImgs[1],
    14 => $perfumeImgs[2],
    15 => $perfumeImgs[3],
    16 => $perfumeImgs[4],
    17 => $perfumeImgs[5],
    18 => $perfumeImgs[6],
    19 => $perfumeImgs[7],
    20 => $perfumeImgs[8],
    21 => $perfumeImgs[9],
    22 => $perfumeImgs[0],
    23 => $perfumeImgs[1],
    24 => $perfumeImgs[2],
    25 => $perfumeImgs[3],
    26 => $perfumeImgs[4],
    27 => $perfumeImgs[5],
    28 => $perfumeImgs[6],
    29 => $perfumeImgs[7],
    30 => $perfumeImgs[8],
    31 => $perfumeImgs[9],
    32 => $perfumeImgs[0],

    // ── Imported Fragrance (IDs 33–42) ────────────────────────────────────
    33 => $perfumeImgs[1],
    34 => $perfumeImgs[2],
    35 => $perfumeImgs[3],
    36 => $perfumeImgs[4],
    37 => $perfumeImgs[5],
    38 => $perfumeImgs[6],
    39 => $perfumeImgs[7],
    40 => $perfumeImgs[8],
    41 => $perfumeImgs[9],
    42 => $perfumeImgs[0],

    // ── RIZEN Watches (no brand-specific images, use Curren/Tissot) ───────
    43 => 'images/products/curren-white-gold-lifestyle-1.jpg',
    44 => 'images/products/curren-blue-silver-wrist-1.jpg',
    45 => 'images/products/curren-green-golden-wrist-1.jpg',
    46 => 'images/products/curren-green-golden-display-1.jpg',
    47 => 'images/products/curren-green-golden-wrist-1.jpg',
    48 => 'images/products/curren-blue-silver-wrist-1.jpg',
    49 => 'images/products/tissot-brown-leather-wrist-1.jpg',
    50 => 'images/products/tissot-black-minimalist-wrist-1.jpg',
    51 => 'images/products/tissot-brown-leather-display-1.jpg',
    52 => 'images/products/curren-white-gold-lifestyle-1.jpg',
    53 => 'images/products/tissot-prx-black-wrist-1.jpg',

    // ── PATEK PHILIPPE ────────────────────────────────────────────────────
    54 => 'images/products/patek-master-wrist-1.jpg',
    55 => 'images/products/patek-master-wrist-2.jpg',
    56 => 'images/products/patek-skeleton-blue-display-1.jpg',
    57 => 'images/products/patek-master-wrist-2.jpg',
    58 => 'images/products/patek-master-wrist-1.jpg',

    // ── ROLEX ─────────────────────────────────────────────────────────────
    59 => 'images/products/rolex-oyster-wrist-1.jpg',
    60 => 'images/products/rolex-oyster-wrist-2.jpg',
    61 => 'images/products/rolex-gold-silver-wrist-1.jpg',
    62 => 'images/products/rolex-oyster-wrist-2.jpg',

    // ── TANOX (no brand images, use Tissot) ───────────────────────────────
    63 => 'images/products/tissot-prx-black-wrist-1.jpg',
    64 => 'images/products/tissot-prx-wrist-1.jpg',
    65 => 'images/products/tissot-black-minimalist-wrist-1.jpg',
    66 => 'images/products/tissot-black-minimalist-wrist-2.jpg',

    // ── TISSOT ────────────────────────────────────────────────────────────
    67 => 'images/products/tissot-brown-leather-wrist-1.jpg',
    68 => 'images/products/tissot-prx-wrist-1.jpg',
    69 => 'images/products/tissot-black-minimalist-wrist-1.jpg',
    70 => 'images/products/tissot-prx-black-wrist-1.jpg',
    71 => 'images/products/tissot-brown-leather-display-1.jpg',
    72 => 'images/products/tissot-brown-leather-wrist-1.jpg',
    73 => 'images/products/tissot-prx-wrist-1.jpg',
    74 => 'images/products/tissot-prx-black-wrist-1.jpg',
    75 => 'images/products/tissot-prx-wrist-1.jpg',

    // ── CARTIER ───────────────────────────────────────────────────────────
    76 => 'images/products/cartier-auto-wrist-1.jpg',
    77 => 'images/products/cartier-auto-wrist-1.jpg',

    // ── CURREN ────────────────────────────────────────────────────────────
    78 => 'images/products/curren-green-golden-wrist-1.jpg',
    79 => 'images/products/curren-blue-silver-wrist-1.jpg',
    80 => 'images/products/curren-white-gold-lifestyle-1.jpg',
];

// ── Apply ───────────────────────────────────────────────────────────────────
$pdo->beginTransaction();
$updated = 0;

try {
    // Clear old placeholder images
    $pdo->exec("DELETE FROM product_images");

    $insert = $pdo->prepare("
        INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
        VALUES (?, ?, 1, 0)
    ");

    foreach ($map as $productId => $imageUrl) {
        $insert->execute([$productId, $imageUrl]);
        $updated++;
    }

    $pdo->commit();
    echo "<pre>✅ Done! Assigned images to {$updated} products.</pre>";

} catch (\Throwable $e) {
    $pdo->rollBack();
    echo "<pre>❌ Error: " . $e->getMessage() . "</pre>";
}
?>
