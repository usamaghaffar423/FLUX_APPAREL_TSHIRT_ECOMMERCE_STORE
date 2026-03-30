<?php
/**
 * GET Products — reads from the simple cf_products flat table.
 * Returns field names matching the existing frontend expectations:
 *   id, title, price, retail_price, discount_pct, image_url,
 *   category, is_trending, stock_status, description, short_description
 *
 * Auto-creates the cf_products table if it doesn't exist yet.
 */

require_once 'config.php';
header('Content-Type: application/json');

try {
    $pdo = getDbConnection();

    // Auto-create on first use
    $pdo->exec("CREATE TABLE IF NOT EXISTS cf_products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)   NOT NULL,
        category    VARCHAR(100)   NOT NULL DEFAULT 'General',
        price       DECIMAL(10,2)  NOT NULL,
        old_price   DECIMAL(10,2)  DEFAULT NULL,
        description TEXT,
        image       VARCHAR(500)   DEFAULT '',
        sizes       VARCHAR(200)   DEFAULT '',
        colors      VARCHAR(200)   DEFAULT '',
        stock       INT            NOT NULL DEFAULT 0,
        featured    TINYINT(1)     NOT NULL DEFAULT 0,
        active      TINYINT(1)     NOT NULL DEFAULT 1,
        sort_order  INT            NOT NULL DEFAULT 0,
        created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // ── Image base URL ───────────────────────────────────────────────────
    $protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host      = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $root      = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/')), '/');
    $imageBase = $protocol . '://' . $host . $root . '/';

    // ── Params ───────────────────────────────────────────────────────────
    $id       = isset($_GET['id'])       ? (int)$_GET['id']              : null;
    $category = isset($_GET['category']) && $_GET['category'] !== 'All'
                    ? trim($_GET['category']) : null;
    $search   = isset($_GET['search'])   ? trim($_GET['search'])          : null;
    $trending = isset($_GET['trending']) && $_GET['trending'] === '1';
    $limit    = isset($_GET['limit'])    ? min((int)$_GET['limit'], 500)  : 100;

    // ── Query ────────────────────────────────────────────────────────────
    $sql    = "SELECT * FROM cf_products WHERE active = 1";
    $params = [];

    if ($id) {
        $sql .= " AND id = ?";
        $params[] = $id;
    }
    if ($category) {
        $sql .= " AND category = ?";
        $params[] = $category;
    }
    if ($search) {
        $sql .= " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)";
        $params = array_merge($params, ["%$search%", "%$search%", "%$search%"]);
    }
    if ($trending) {
        $sql .= " AND featured = 1";
    }

    $sql .= " ORDER BY sort_order ASC, featured DESC, created_at DESC";

    if (!$id) {
        $sql .= " LIMIT ?";
        $params[] = $limit;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    // ── Normalise to existing frontend field format ───────────────────────
    $products = [];
    foreach ($rows as $r) {
        $price     = (float)$r['price'];
        $oldPrice  = $r['old_price'] ? (float)$r['old_price'] : $price;
        $discount  = ($oldPrice > $price) ? round((($oldPrice - $price) / $oldPrice) * 100) : 0;

        // Resolve relative image path
        $img = $r['image'] ?? '';
        if ($img && !str_starts_with($img, 'http')) {
            $img = $imageBase . ltrim($img, '/');
        }

        $products[] = [
            'id'                => (int)$r['id'],
            'title'             => $r['name'],
            'price'             => $price,
            'retail_price'      => $oldPrice,
            'discount_pct'      => $discount,
            'image_url'         => $img,
            'category'          => $r['category'],
            'is_trending'       => (bool)$r['featured'],
            'stock_status'      => ((int)$r['stock'] > 0) ? 'in_stock' : 'out_of_stock',
            'stock_quantity'    => (int)$r['stock'],
            'description'       => $r['description'] ?? '',
            'short_description' => mb_strimwidth($r['description'] ?? '', 0, 120, '…'),
            'sizes'             => $r['sizes'] ?? '',
            'colors'            => $r['colors'] ?? '',
            'slug'              => '',
            'brand_name'        => '',
            'free_shipping'     => false,
            'shipping_cost'     => 0,
            'created_at'        => $r['created_at'],
        ];
    }

    echo json_encode($products);

} catch (\Throwable $e) {
    error_log('get_products error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load products. Please try again.']);
}
?>
