<?php
/**
 * GET Product Variants API
 * Returns all colour/size variants for a product, including per-variant images.
 */

require_once 'config.php';

header('Content-Type: application/json');

if (empty($_GET['product_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing product_id parameter']);
    exit;
}

$productId = (int)$_GET['product_id'];
if ($productId <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid product_id']);
    exit;
}

try {
    $pdo = getDbConnection();

    $protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host      = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $scriptDir = dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/get_product_variants.php'));
    $imageBase = $protocol . '://' . $host . rtrim($scriptDir, '/') . '/';

    $stmt = $pdo->prepare("
        SELECT
            v.id,
            v.product_id,
            v.sku,
            v.color,
            v.size,
            v.retail_price,
            v.discount_pct,
            v.final_price,
            v.stock_quantity,
            v.stock_status,
            v.sort_order,
            pi.image_url AS primary_image
        FROM product_variants v
        LEFT JOIN product_images pi
            ON pi.variant_id = v.id AND pi.is_primary = 1
        WHERE v.product_id = ? AND v.is_active = 1
        ORDER BY v.sort_order ASC, v.id ASC
    ");
    $stmt->execute([$productId]);
    $variants = $stmt->fetchAll();

    foreach ($variants as &$v) {
        $v['id']             = (int)$v['id'];
        $v['product_id']     = (int)$v['product_id'];
        $v['retail_price']   = $v['retail_price'] !== null ? (float)$v['retail_price'] : null;
        $v['discount_pct']   = $v['discount_pct'] !== null ? (float)$v['discount_pct'] : null;
        $v['final_price']    = $v['final_price'] !== null ? (float)$v['final_price'] : null;
        $v['stock_quantity'] = (int)$v['stock_quantity'];

        if ($v['primary_image'] && !str_starts_with($v['primary_image'], 'http')) {
            $v['primary_image'] = $imageBase . $v['primary_image'];
        }
    }
    unset($v);

    echo json_encode($variants);

} catch (\PDOException $e) {
    error_log('get_product_variants error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to load variants.']);
}
?>
